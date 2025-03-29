"use client";

import { getSolvedQuestions } from "@/lib/apiCalls/api";
import { UUID } from "@/lib/types";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useQuestionStore } from "@/lib/store/questionStore";
import FetchQuestions from "@/components/FetchQuestions";

export default function GamePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { team, user } = useAuthStore();
  const { corr_questions, setCorrQuest } = useQuestionStore();
  const prevCorrQuestions = useRef(corr_questions);

  // useEffect(() => {
  //   if (team && user) {
  //     const fetchSolvedQuestions = async () => {
  //       try {
  //         if (corr_questions && corr_questions.length > 0) {
  //           
  //           return; // Avoid unnecessary API call
  //         }

  //         
  //         const solvedQuestions = await getSolvedQuestions(team?.id as UUID);
  //         setCorrQuest(solvedQuestions);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     };
  //     fetchSolvedQuestions();
  //   }
  // }, [team, user, setCorrQuest]);

  useEffect(() => {
    if (team && user) {
      const fetchSolvedQuestions = async () => {
        try {
          if (
            prevCorrQuestions.current &&
            prevCorrQuestions.current.length > 0
          ) {
            
            return;
          }

          
          const solvedQuestions = await getSolvedQuestions(team?.id as UUID);
          setCorrQuest(solvedQuestions);
          prevCorrQuestions.current = solvedQuestions; // Update ref
        } catch (error) {
          console.error(error);
        }
      };
      fetchSolvedQuestions();
    }
  }, [team, user, setCorrQuest]);

  return (
    <div className="h-screen w-full p-6">
      {user && <FetchQuestions />} {/* Fetches all questions */}
      {children}
    </div>
  );
}
