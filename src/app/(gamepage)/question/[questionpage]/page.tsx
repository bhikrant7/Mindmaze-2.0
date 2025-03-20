"use client";

import QuestionCard from "@/components/QuestionCard";
import { getQuestion } from "@/lib/apiCalls/api";
import { Question } from "@/lib/types";
import { useEffect, useState } from "react";

export default function QuestionPage({
  params,
}: {
  params: { questionpage: string };
}) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const questionpage = params.questionpage; // Corrected

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        setError(null);
        const questionId = parseInt(questionpage, 10); // Convert string to number
        const fetchedQuestion = await getQuestion(questionId);

        if (!fetchedQuestion) {
          setError("Question not found");
          return;
        }
        setQuestion(fetchedQuestion);
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

  if (!question) {
    return <div>No question found</div>;
  }

  return <QuestionCard question={question} />;
}
