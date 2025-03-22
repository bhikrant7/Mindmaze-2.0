import { create } from "zustand";
import { Question, SolvedQuestion } from "../types";

interface questionState {
  questions: Partial<Question>[] | null; //all quesitons
  curr_quest: Partial<Question | null>; //current question
  corr_questions: Partial<SolvedQuestion>[] | null; //correct questions
  setCurrQuest: (curr_quest: Partial<Question | null>) => void;
  setCurrAnswer: (curr_answer: string) => void;
  updateQuestionByIndex: (
    indexToUpdate: number,
    updatedQuestionItem: Partial<Question>
  ) => void;
  setQuestions: (questions: Partial<Question>[] | null) => void;
  setCorrQuest: (corr_questions: Partial<SolvedQuestion>[] | null) => void;
  setCurrQuestByIndex: (index: number) => void;
}

export const useQuestionStore = create<questionState>((set) => ({
  questions: [],
  curr_quest: {
    id: 0,
    question_text: "",
    media_image: "", // URL of image (optional)
    media_video: "", // URL of video (optional)
    correct_answer: "",
    user_answer: "",
    is_submitted: false,
    is_solved: false,
  },
  corr_questions: [],
  setCurrQuest: (curr_quest) => set({ curr_quest }),
  setCurrAnswer: (curr_answer: string) =>
    set((state) => ({
      curr_quest: state.curr_quest
        ? { ...state.curr_quest, user_answer: curr_answer } // Update existing question
        : { user_answer: curr_answer }, // Create a new object if curr_quest is null
    })),
  updateQuestionByIndex: (
    indexToUpdate: number | undefined,
    updatedQuestionItem: Partial<Question>
  ) => {
    set((state) => {
      const updatedQuestions = state.questions?.map(
        (question: Partial<Question>, index: number) => {
          return indexToUpdate === index ? updatedQuestionItem : question;
        }
      );
      return { questions: updatedQuestions };
    });
  },
  setQuestions: (questions) => set({ questions }),
  setCorrQuest: (corr_questions) => set({ corr_questions }),
  setCurrQuestByIndex: (index: number) =>
    set((state) => {
      const questions = state.questions || [];
      if (index < 0 || index >= questions.length) {
        console.warn("Invalid index for setCurrQuestByIndex:", index);
        return {};
      }
      return { curr_quest: questions[index] };
    }),
}));
