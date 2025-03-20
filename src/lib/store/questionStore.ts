import { create } from "zustand";
import { Question } from "../types";


interface questionState{
    questions:Partial<Question|null>[]; //all quesitons
    curr_quest:Partial<Question|null>; //current question
    corr_questions:Partial<Question|null>[]; //correct questions
    setCurrQuest:(curr_quest:Partial<Question|null>)=>void;
    setQuestions:(questions:Partial<Question|null>[])=>void;
    setCorrQuest:(corr_questions:Partial<Question|null>[])=>void;
}

export const authStore = create<questionState>((set)=>({
    questions:[],
    curr_quest: null,
    corr_questions: [],
    setCurrQuest: (curr_quest) => set({ curr_quest }),
    setQuestions: (questions) => set({ questions }),
    setCorrQuest: (corr_questions) => set({ corr_questions }),
}))