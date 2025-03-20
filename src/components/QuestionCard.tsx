import { Question } from "@/lib/types";
import Image from "next/image";
import React from "react";

const QuestionCard = ({ question }: { question: Question }) => {
  return (
    <div className="p-6">
      <h1 className="flex justify-center my-10 press-start-2p-regular text-5xl top font-bold text-white">
      Puzzle {question.id}
      </h1>

      <div className="aspect-auto bg-white dark:bg-zinc-900 rounded-lg  shadow-lg w-full border-2 border-orange-400 p-4">
        <p className="text-2xl mb-6">{question.question_text}</p>

        <div className="flex flex-row flex-wrap lg:flex-nowrap md:overflow-hidden gap-4">
          {/* Next.js Optimized Image */}
          {question.media_image && (
            <div className="relative w-full max-w-[600px] h-[300px] md:h-[400px] lg:h-[500px]">
              <Image
                src={question.media_image}
                alt="Question media"
                layout="fill"
                objectFit="contain" // Ensures image fits properly
                className="rounded-lg"
                priority
              />
            </div>
          )}

          {/* Video Handling */}
          {question.media_video && (
            <video controls className="mb-4 rounded-lg w-full max-w-[600px]">
              <source src={question.media_video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
