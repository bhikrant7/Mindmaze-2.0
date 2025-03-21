"use client";

// import { useAuthStore } from "@/lib/store/authStore";
// import { StyledWrapper } from "@/components/StyledWrapper";
import { getAllQuestion } from "@/lib/apiCalls/api";
import { Question } from "@/lib/types";
import bcrypt from "bcryptjs";
import { useQuestionStore } from "@/lib/store/questionStore";
import { useEffect } from "react";

export default function GamePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const {loading} = useAuthStore();
  const { setQuestions } = useQuestionStore();

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

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  return <div className="h-screen w-full p-6">{children}</div>;
}
