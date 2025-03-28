import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Question, SolvedQuestion } from "../types";

interface QuestionState {
  questions: Partial<Question>[] | null;
  curr_quest: Partial<Question | null>;
  corr_questions: Partial<SolvedQuestion>[] | null;
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

export const useQuestionStore = create<QuestionState>()(
  persist(
    (set) => ({
      questions: null, // Initially null
      curr_quest: {
        id: 0,
        question_text: "",
        question_description:"",
        media_image: [],
        media_video: [],
        media_audio: [],
        hint: "",
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
            ? { ...state.curr_quest, user_answer: curr_answer }
            : { user_answer: curr_answer },
        })),
      updateQuestionByIndex: (indexToUpdate, updatedQuestionItem) =>
        set((state) => {
          const updatedQuestions = state.questions?.map((question, index) =>
            indexToUpdate === index ? updatedQuestionItem : question
          );
          return { questions: updatedQuestions };
        }),
      setQuestions: (questions) => set({ questions }),
      setCorrQuest: (corr_questions) => set({ corr_questions }),
      setCurrQuestByIndex: (index) =>
        set((state) => {
          const questions = state.questions || [];
          if (index < 0 || index >= questions.length) {
            console.warn("Invalid index for setCurrQuestByIndex:", index);
            return {};
          }
          return { curr_quest: questions[index] };
        }),
    }),
    {
      name: "question-storage",
      storage: createJSONStorage(() => localStorage), // Correct way to persist state
    }
  )
);
