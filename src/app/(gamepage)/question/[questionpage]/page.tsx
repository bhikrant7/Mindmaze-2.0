"use client";

import QuestionCard from "@/components/QuestionCard";
import { getQuestion } from "@/lib/apiCalls/api";
import { Question } from "@/lib/types";
import { useEffect, useState } from "react";
import { useQuestionStore } from "@/lib/store/questionStore";

export default function QuestionPage({
  params,
}: {
  params: { questionpage: string };
}) {
  // const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const questionpage = params.questionpage; // Corrected
  const { curr_quest,  setCurrQuest } = useQuestionStore();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        setError(null);
        const questionId = parseInt(questionpage, 10); // Convert string to number
        const fetchedQuestion = await getQuestion(questionId);
        console.log('fetchedQuestion: ', fetchedQuestion);
        if (!fetchedQuestion) {
          setError("Question not found");
          return;
        }
        setCurrQuest(fetchedQuestion);
      } catch (error) {
        console.error("Error fetching question:", error);
        setError("Failed to load question");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionpage]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!curr_quest) {
    return <div>No question found</div>;
  }

  return <QuestionCard question={curr_quest} />;
}
