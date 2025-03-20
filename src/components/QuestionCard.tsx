import { Question } from "@/lib/types";
import React from "react";
import Image from "next/image";

const QuestionCard = ({ question }: { question: Question }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 underline">
        Question. {question.id}
      </h1>

      <div className="aspect-auto shadow-lg w-full border-2 border-orange-400 rounded-lg p-4">
        <p className="text-2xl mb-6">{question.question_text}</p>

        <div className="flex flex-row flex-wrap lg:flex-nowrap md:overflow-hidden gap-4">
          {question.media_image && (
            <div className="relative w-[600px] h-[400px]">
              <Image
                src={question.media_image}
                alt="Question media"
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
          )}
          {question.media_video && (
            <video controls className="mb-4 rounded-lg max-w-full">
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
