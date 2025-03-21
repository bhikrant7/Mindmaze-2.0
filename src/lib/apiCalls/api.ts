import { supabase } from "../supabaseClient";
import { Question } from "@/lib/types";

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

    console.log("Fetched data:", data); // Debug log to see what we're getting

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
    console.log("Fetched questions:", data);
    return data as Partial<Question>[];
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}



export async function createSubmission(teamId: number | undefined, questionId: number | undefined, isCorrect: boolean) {
  try {

    // const { data:question, error:questionError } = await supabase
    //   .from('questions')
    //   .select('*')
    //   .eq('id', questionId)
    //   .single();

    // console.log('question', question);
    const { data:submission, error:submissionError } = await supabase
    .from('submissions')
    .insert([
      {
        team_id: teamId,
        question_id: questionId,
        is_correct: isCorrect
      },
    ])
    .select('*');

    if (submissionError) {
      return null;
    }
    return submission;
  } catch (error) {
    return null;
  }
}

