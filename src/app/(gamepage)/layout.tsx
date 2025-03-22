"use client";

// import { useAuthStore } from "@/lib/store/authStore";
// import { StyledWrapper } from "@/components/StyledWrapper";
import { getAllQuestion, getSolvedQuestions } from "@/lib/apiCalls/api";
import { Question, UUID } from "@/lib/types";
import bcrypt from "bcryptjs";
import { useQuestionStore } from "@/lib/store/questionStore";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export default function GamePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const {loading} = useAuthStore();
  const { team } = useAuthStore();
  const { questions, setQuestions, setCorrQuest } = useQuestionStore();

  const fetchAllQuestions = async () => {
    try {
      const questions = await getAllQuestion();
      const questionsList: Partial<Question>[] =
        questions?.map((question) => {
          const hashedAnswer = question?.correct_answer
            ? bcrypt.hashSync(question.correct_answer.trim().toLowerCase(), 10) // Salt rounds = 10
            : undefined;
          return {
            ...question,
            correct_answer: hashedAnswer,
          };
        }) || [];
      console.log("questionsList: ", questionsList);
      setQuestions(questionsList);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSolvedQuestions = async () => {
    try {
      const solvedQuestions = await getSolvedQuestions(team?.id as UUID);
      setCorrQuest(solvedQuestions);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  useEffect(() => {
    if (team?.id) {
      fetchSolvedQuestions();
    }
  }, [team]);

  return <div className="h-screen w-full p-6">{children}</div>;
}
