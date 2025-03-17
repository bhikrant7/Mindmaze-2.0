import { Question } from "@/lib/types";
import React from "react";

const QuestionCard = ({ question }: { question: Question }) => {
  return (
    <>
      <div className="p-6 ">
        <h1 className="text-2xl font-bold mb-4 underline">
          Question. {question.id}
        </h1>
        {/* <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-lg min-w-[300px] max-w-[600px]"> */}

        <div className="aspect-auto bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg w-full border-2 border-orange-400 rounded-lg p-4">
          <p className="text-2xl  mb-6">{question.question_text}</p>
          <div className="flex flex-row flex-wrap lg:flex-nowrap md:overflow-hidden gap-4 ">
            {question.media_image && (
              <img
                src={question.media_image}
                alt="Question media"
                className="mb-4 rounded-lg"
                width={600}
                height={600}
              />
            )}
            {question.media_video && (
              <video controls className="mb-4 rounded-lg">
                <source src={question.media_video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionCard;
