import { Question, UUID } from "@/lib/types";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "./ui/input";
import { useAuthStore } from "@/lib/store/authStore";
import { useQuestionStore } from "@/lib/store/questionStore";
import { Button } from "@/components/ui/button";
import { createSubmission } from "@/lib/apiCalls/api";
import { verifyAnswer } from "@/lib/helpers/common";

const QuestionCard = () => {
  const { team } = useAuthStore();
  const { curr_quest, setCurrAnswer } = useQuestionStore();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const handleSubmit = async () => {
    try {
      if (!curr_quest?.correct_answer) {
        console.log('No correct answer available');
        return;
      }
      setIsSubmitting(true);
      const isCorrect = verifyAnswer(curr_quest?.user_answer, curr_quest?.correct_answer);
      const currQuest = {
        team_id: team?.id,
        question_id: curr_quest.id,
        submitted_answer: curr_quest.user_answer,
        is_correct: isCorrect,
      };
      console.log('currQuest: ', currQuest);
      const newSubmission = await createSubmission(team?.id as UUID, curr_quest?.id, curr_quest?.user_answer as string, isCorrect);
      console.log('newSubmission: ', newSubmission);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="p-6">
      <h1 className="flex justify-center press-start-2p-regular text-5xl font-bold my-10 mb-20">
        Puzzle {curr_quest?.id}
      </h1>

      <div className="flex-col justify-center items-center aspect-auto shadow-lg w-full border-2 border-orange-400 rounded-lg p-4">
        <p className="text-2xl mb-6">{curr_quest?.question_text}</p>

        <div className="flex flex-row flex-wrap lg:flex-nowrap md:overflow-hidden gap-4">
          {curr_quest?.media_image && (
            <div className="relative w-[600px] h-[400px]">
              <Image
                src={curr_quest?.media_image}
                alt="Question media"
                layout="fill"
                objectFit="contain" // Ensures image fits properly
                className="rounded-lg"
                priority
              />
            </div>
          )}
          {curr_quest?.media_video && (
            <video controls className="mb-4 rounded-lg max-w-full">
              <source src={curr_quest?.media_video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <Input 
          value={curr_quest?.user_answer}
          width="30%"
          onChange={(e) => { 
            // console.log('currQuest: ', curr_quest);
            setCurrAnswer(e.target.value) 
          }}
          placeholder="Type your answer here..."
        />
          <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-gradient-to-r from-[#fa8100] to-[#b05800] px-6 font-medium text-white transition-all duration-150 shadow-[3px_3px_8px_rgba(255,149,68,0.4)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)] active:bg-gradient-to-r active:from-[#fa8100] active:to-[#b05800] hover:bg-gradient-to-r hover:from-[#fa8100] hover:to-[#b05800] active:text-white"
            >
              {isSubmitting ? (
                <span>Submitting...</span>
              ) : (
                <span>Submit</span>
              )}
              <div className="ml-1 transition group-hover:translate-x-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                >
                  <path
                    d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                    fill="currentColor"
                    // fill-rule="evenodd"
                    // clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
            </Button>
      </div>
    </div>
  );
};

export default QuestionCard;
