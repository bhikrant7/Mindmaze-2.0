import { UUID } from "@/lib/types";
import React, { useState } from "react";
import Image from "next/image";
import { Input } from "./ui/input";
import { useAuthStore } from "@/lib/store/authStore";
import { useQuestionStore } from "@/lib/store/questionStore";
import { Button } from "@/components/ui/button";
import { createSubmission } from "@/lib/apiCalls/api";
import { verifyAnswer } from "@/lib/helpers/common";
import { toast } from "react-hot-toast";
import { GlobalQuestionHint } from "./GlobalQuestionHint";

const QuestionCard = () => {
  const { team } = useAuthStore();
  const { curr_quest, corr_questions, setCurrAnswer, setCorrQuest } =
    useQuestionStore();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isSolved, setIsSolved] = useState<boolean>(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!curr_quest || curr_quest.id === undefined) {
      console.log("No current question available");
      return;
    }

    if (!curr_quest.correct_answer) {
      console.log("No correct answer available");
      return;
    }

    if (curr_quest.user_answer?.trim().length == 0) {
      toast.error("Enter an Answer", {
        duration: 5000,
        position: "top-center",
        style: {
          background: "rgba(19, 12, 28, 0.15)",
          border: "1px solid #422d28",
          color: "#ff4d4d",
          padding: "12px 16px",
          borderRadius: "8px",
          backdropFilter: "blur(8px)",
        },
        iconTheme: {
          primary: "#ff4d4d",
          secondary: "#422d28",
        },
      });
      return;
    }

    setIsSubmitting(true);
    setHasSubmitted(true);

    try {
      const isCorrect = verifyAnswer(
        curr_quest?.user_answer,
        curr_quest?.correct_answer
      );

      if (!isCorrect) {
        toast.error("Wrong answer! Try Again", {
          duration: 10000,
          position: "top-center",
          style: {
            background: "rgba(19, 12, 28, 0.15)",
            border: "1px solid #422d28",
            color: "#ff4d4d",
            padding: "12px 16px",
            borderRadius: "8px",
            backdropFilter: "blur(8px)",
          },
          iconTheme: {
            primary: "#ff4d4d",
            secondary: "#422d28",
          },
        });
      } else {
        setIsSolved(true);
      }

      const newSubmission = await createSubmission(
        team?.id as UUID,
        curr_quest?.id,
        curr_quest?.user_answer as string,
        isCorrect,
        team?.team_name as string
      );
      // console.log("newSubmission: ", newSubmission);
      if (newSubmission && isCorrect) {
        setCorrQuest([
          ...(corr_questions ?? []),
          {
            id: curr_quest?.id,
            team_id: team?.id,
            question_id: curr_quest?.id,
            team_name: team?.team_name,
          },
        ]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setCurrAnswer("");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full mb-20">
      <h1 className="text-center text-xl md:text-3xl font-bold mt-10 md:mt-10 press-start-2p-regular leading-loose">
        {curr_quest?.question_text}
      </h1>

      <div className="w-full max-w-5xl flex flex-col items-center text-center px-2 py-5 sm:p-10 mt-10 md:my-20 space-y-4 sm:space-y-6 bg-transparent rounded-2xl border border-orange-400">
        <p className="text-sm sm:text-base md:text-xl text-center leading-7 sm:text-center sm:leading-10 px-4 sm:px-10">
          {curr_quest?.question_description}
        </p>

        {/* Media Containers */}
        <div className="flex flex-col w-full">
          {/* Images */}
          {(curr_quest?.media_image || []).length > 0 && (
            <div className=" flex flex-wrap justify-center gap-4">
              {curr_quest?.media_image?.map((img, index) => (
                <div
                  key={index}
                  className="relative w-full max-w-[300px] md:max-w-[500px] lg:max-w-[600px] h-[200px] md:h-[300px] lg:h-[400px]"
                >
                  <Image
                    src={img}
                    alt={`Question media ${index + 1}`}
                    draggable="false"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                    priority
                  />
                </div>
              ))}
            </div>
          )}

          {/* Videos */}
          {(curr_quest?.media_video || []).length > 0 && (
            <div className="p-4 flex flex-wrap justify-center gap-4">
              {curr_quest?.media_video?.map((vid, index) => (
                <video
                  key={index}
                  controls
                  className="w-full max-w-[250px] lg:max-w-[400px] rounded-lg"
                >
                  <source src={vid} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ))}
            </div>
          )}

          {/* Audios */}
          {(curr_quest?.media_audio || []).length > 0 && (
            <div className="p-4 flex flex-wrap justify-center gap-4">
              {curr_quest?.media_audio?.map((audio, index) => (
                <audio
                  key={index}
                  controls
                  className="w-full max-w-[300px] md:max-w-[500px] lg:max-w-[600px] rounded-lg"
                >
                  <source src={audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              ))}
            </div>
          )}
        </div>

        {/* Hint for specific question */}
        {curr_quest?.id === 7 &&
          !isSolved &&
          !corr_questions?.some((q) => q.question_id === curr_quest?.id) &&
          hasSubmitted && (
            <GlobalQuestionHint
              questionId={curr_quest?.id}
              userAnswer={curr_quest?.user_answer}
            >
              <Button variant="outline">View Hint</Button>
            </GlobalQuestionHint>
          )}

        <p className="font-semibold text-lg sm:text-2xl text-red-600">{curr_quest?.hint}</p>

        {/* Answer Input / Solved Message */}
        {corr_questions?.some((q) => q.question_id === curr_quest?.id) ||
        isSolved ? (
          <p className="text-green-500 text-3xl font-bold">Solved</p>
        ) : (
          <Input
            value={curr_quest?.user_answer || ""}
            type="text"
            onChange={(e) => setCurrAnswer(e.target.value)}
            onBlur={(e) => {
              if (e.target.value.trim() === "") {
                setCurrAnswer("");
              }
            }}
            className="w-full max-w-[20rem] py-6 px-4 border border-[#FF9544] focus:ring-[#FF9544] rounded-md dark:bg-zinc-950"
            placeholder="Type your answer here..."
          />
        )}

        {/* Submit Button */}
        {!corr_questions?.some((q) => q.question_id === curr_quest?.id) &&
          !isSolved && (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="group relative inline-flex h-12 items-center w-auto min-w-[150px] max-w-[150px] justify-center overflow-hidden rounded-md bg-gradient-to-r from-[#fa8100] to-[#b05800] px-6 font-medium text-white transition-all duration-150 shadow-[5px_5px_5px_rgba(255,149,68,0.4)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)] active:bg-gradient-to-r active:from-[#fa8100] active:to-[#b05800] hover:bg-gradient-to-r hover:from-[#fa8100] hover:to-[#b05800] active:text-white"
            >
              {isSubmitting ? <span>Submitting...</span> : <span>Submit</span>}
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
                  ></path>
                </svg>
              </div>
            </Button>
          )}
      </div>
    </div>
  );
};

export default QuestionCard;
