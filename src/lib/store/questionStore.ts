import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Question } from "../types";


interface questionState{
    questions:Partial<Question>[]|null; //all quesitons
    curr_quest:Partial<Question|null>; //current question
    corr_questions:Partial<Question[]|null>; //correct questions
    setCurrQuest:(curr_quest:Partial<Question|null>)=>void;
    setCurrAnswer:(curr_answer:string)=>void;
    setQuestions:(questions: Partial<Question>[] | null)=>void;
    setCorrQuest:(corr_questions:Partial<Question[]|null>)=>void;
}

export const useQuestionStore = create<questionState>((set)=>({
    questions:[],
    curr_quest: null,
    corr_questions: [],
    setCurrQuest: (curr_quest) => set({ curr_quest }),
    setCurrAnswer: (curr_answer: string) =>
        set((state) => ({
            curr_quest: state.curr_quest
            ? { ...state.curr_quest, answer: curr_answer } // Update existing question
            : { answer: curr_answer }, // Create a new object if curr_quest is null
    })),
    setQuestions: (questions) => set({ questions }),
    setCorrQuest: (corr_questions) => set({ corr_questions }),
}))