"use client";
import { useEffect, useState } from "react";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useQuestionStore } from "@/lib/store/questionStore";
import Image from "next/image";
import { getAllQuestion } from "@/lib/apiCalls/api";
import { Question } from "@/lib/types";
import { StyledWrapper } from "@/components/StyledWrapper";

export default function Page() {
  const router = useRouter();
  const [completed, setCompleted] = useState<boolean[]>(Array(15).fill(false));
  const { user } = useAuthStore();
  const { questions, setQuestions } = useQuestionStore();

  const toggleCompletion = (index: number) => {
    router.push(`/question/${index + 1}`);
    setCompleted((prev) => {
      const newCompleted = [...prev];
      newCompleted[index] = !newCompleted[index]; // Toggle completion
      return newCompleted;
    });
  };

  useEffect(() => {
    if (!user) {
      <StyledWrapper />;
      // router.push("/login");
    }
  }, [user, router]);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Logout Button */}
      <div className="absolute top-2 left-4 sm:top-20 sm:left-20 flex justify-start">
        <button
          className="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base text-white bg-red-500 rounded-md shadow-md hover:bg-red-600 transition"
        >
          Log Out
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow container mx-auto p-4">
        {/* Title */}
        <div className="flex justify-center mt-20">
          <h1 className="press-start-2p-regular text-4xl sm:text-5xl md:text-6xl font-bold text-white">
            PUZZLES
          </h1>
        </div>

        {/* 3x5 Grid Layout for Questions */}
        <div className="mt-20 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 sm:gap-x-40 gap-y-10 sm:gap-y-20 px-2 sm:px-4">
          {questions?.map((_, index) => (
            <button
              key={index}
              onClick={() => router.push(`/question/${index + 1}`)}
              className="relative px-3 py-4 sm:px-4 sm:py-6 rounded-md text-white text-lg sm:text-2xl font-semibold shadow-md transition hover:scale-105 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-orange-600"
            >
              Puzzle {index + 1}
              {completed[index] && (
                <Image
                  src="/tick_white.png"
                  alt="Completed"
                  width={30}
                  height={30}
                  className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
