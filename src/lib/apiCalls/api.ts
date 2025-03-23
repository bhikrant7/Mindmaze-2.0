import bcrypt from "bcryptjs";
import { supabase } from "../supabaseClient";
import { Question, SolvedQuestion, UUID } from "@/lib/types";
import { useQuestionStore } from "../store/questionStore";

let count = 0;
//getQuestion
export async function getQuestion(id: number): Promise<Question | null> {
  try {
    const { data, error } = await supabase
      .from("questions")
      .select("id,question_text, media_image, media_video") // Explicitly select the columns you need
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching question:", error);
      return null;
    }

    // console.log("Fetched data:", data); // Debug log to see what we're getting

    const question = {
      ...data,
      correct_answer: "",
    };
    return question;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

//get all Question
export async function getAllQuestion(): Promise<Partial<Question>[] | null> {
  try {
    const { data, error } = await supabase
      .from("questions")
      .select("id,question_text, media_image, media_video, correct_answer")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching questions:", error);
      return null;
    }
    // console.log("Fetched questions:", data);
    return data as Partial<Question>[];
  } catch (err) {
    console.error("Error in getting :", err);
    return null;
  }
}

export async function getSolvedQuestions(
  team_id: UUID | undefined
): Promise<Partial<SolvedQuestion>[] | null> {
  try {
    console.log("getSolvedQuestions : No of times I am accessing:",++count);
    console.log("team_id: ", team_id);
    const { data, error } = await supabase
      .from("solved_questions")
      .select("*")
      .eq("team_id", team_id);

    if (error) {
      return null;
    }
    console.log("data: ", data);
    return data as Partial<SolvedQuestion>[];
  } catch (error) {
    console.error("Error in getting: ", error);
    return null;
  }
}

export async function createSubmission(
  teamId: UUID,
  questionId: number | undefined,
  user_answer: string,
  isCorrect: boolean,
  team_name: string
) {
  try {
    const { data: submission, error: submissionError } = await supabase
      .from("submissions")
      .insert([
        {
          team_id: teamId,
          question_id: questionId,
          submitted_answer: user_answer,
          is_correct: isCorrect,
          team_name: team_name,
        },
      ])
      .select();

    if (submissionError) {
      return null;
    }
    return submission;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error("Error in submission :", error);
    return null;
  }
}

export const fetchAllQuestions = async () => {
  try {
    const { questions, setQuestions } = useQuestionStore.getState();

    //  Avoid re-fetching if questions are already stored
    if (questions && questions.length > 0) {
      console.log("Using cached questions from Zustand");
      return;
    }

    console.log("Fetching questions from API...");
    const fetchedQuestions = await getAllQuestion();

    const questionsList: Partial<Question>[] =
      fetchedQuestions?.map((question) => {
        const hashedAnswer = question?.correct_answer
          ? bcrypt.hashSync(question.correct_answer.trim().toLowerCase(), 10) // Salt rounds = 10
          : undefined;
        return {
          ...question,
          correct_answer: hashedAnswer,
        };
      }) || [];

    console.log("questionsList: ", questionsList);
    setQuestions(questionsList); //  Store in Zustand (Persists in localStorage)
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
};
