"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import Image from "next/image"; // Import Next.js Image component

export default function Page() {
  const router = useRouter();
  const [completed, setCompleted] = useState<boolean[]>(Array(15).fill(false));
  const { user } = useAuthStore();

  const toggleCompletion = (index: number) => {
    router.push(`/question/${index + 1}`);
    setCompleted((prev) => {
      const newCompleted = [...prev];
      newCompleted[index] = !newCompleted[index]; // Toggle completion
      return newCompleted;
    });
  };
  
  return user ? (
    <main className="min-h-screen flex flex-col">
      {/* Status Bar */}
      {/* Main Content Area */}
      <div className="flex-grow container mx-auto p-4">
        {/* Title */}
        <div className="flex justify-center mt-20">
          <h1 className="press-start-2p-regular text-5xl sm:text-6xl md:text-7xl font-bold text-white">
            PUZZLES
          </h1>
        </div>

        {/* 3x5 Grid Layout for Questions */}
        <div className="mt-20 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-40 gap-y-20 px-4">
          {Array.from({ length: 15 }).map((_, index) => (
            <button
              key={index}
              onClick={() => toggleCompletion(index)}
              className="relative px-4 py-6 rounded-md text-white text-2xl font-semibold shadow-md transition hover:scale-105 flex items-center justify-center gap-2 
                bg-gradient-to-r from-orange-400 to-orange-600"
            >
              Puzzle {index + 1}
              {completed[index] && (
                <div className="absolute -bottom-4 -right-5 w-12">
                  <Image
                    src="/tick.png"
                    alt="Completed"
                    width={100}
                    height={100}
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </main>
  ) : (
    (() => {
      router.replace("/login");
      return null; // Ensures the function doesn't return JSX unexpectedly
    })()
  );
}
