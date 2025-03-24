"use client";

import { getSolvedQuestions } from "@/lib/apiCalls/api";
import { UUID } from "@/lib/types";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useQuestionStore } from "@/lib/store/questionStore";
import FetchQuestions from "@/components/FetchQuestions";

export default function GamePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { team } = useAuthStore();
  const { corr_questions, setCorrQuest } = useQuestionStore();

  useEffect(() => {
    if (team?.id) {
      const fetchSolvedQuestions = async () => {
        try {
          if (corr_questions && corr_questions.length > 0) {
            console.log("Using cached solved questions from Zustand");
            return; // Avoid unnecessary API call
          }

          console.log("Fetching solved questions from API...");
          const solvedQuestions = await getSolvedQuestions(team?.id as UUID);
          setCorrQuest(solvedQuestions);
        } catch (error) {
          console.error(error);
        }
      };
      fetchSolvedQuestions();
    }
  }, [team, corr_questions, setCorrQuest]);

  return (
    <div className="h-screen w-full p-6">
      <FetchQuestions /> {/* Fetches all questions */}
      {children}
    </div>
  );
}
