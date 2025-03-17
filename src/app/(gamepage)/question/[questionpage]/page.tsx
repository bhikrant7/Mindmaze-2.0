"use client";

import QuestionCard from "@/components/QuestionCard";
import { getQuestion } from "@/lib/apiCalls/api";
import { Question } from "@/lib/types";
import { useEffect, useState, use } from "react";


export default function QuestionPage({
  params,
}: {
  params: { questionpage: string }
}) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const questionpage = use(params).questionpage; // question no.

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        setError(null);
        const questionId = parseInt(questionpage, 10); // question no.
        const fetchedQuestion = await getQuestion(questionId);

        if(!fetchedQuestion){
          setError("Question not found");
          return;
        }
        setQuestion(fetchedQuestion);
      }
      catch(error){
        console.error("Error fetching question:", error);
        setError("Failed to load question");
      }
      finally{
        setLoading(false);
      }
    }
    fetchQuestion();
  }, [questionpage]);

  if(loading){
    return <div>Loading...</div>;
  }

  if(error){
    return <div className="text-red-500">{error}</div>;
  }

  if(!question){
    return <div>No question found</div>;
  }

  return (
    <QuestionCard question={question} />

    
  )
















//   const resolvedParams = use(params);
//   const questionpage = resolvedParams.questionpage;

//   useEffect(() => {
//     const fetchQuestion = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const questionId = parseInt(questionpage, 10);
//         const fetchedQuestion = await getQuestion(questionId);

//         if (!fetchedQuestion) {
//           setError("Question not found");
//           return;
//         }

//         setQuestion(fetchedQuestion);
//       } catch (err) {
//         console.error("Error fetching question:", err);
//         setError("Failed to load question");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestion();
//   }, [questionpage]);

//   if (loading) {
//     return (
//       <div className="p-6">
//         <div className="animate-pulse">Loading question...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6">
//         <div className="text-red-500">{error}</div>
//       </div>
//     );
//   }

//   if (!question) {
//     return (
//       <div className="p-6">
//         <div>No question found</div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Question {questionpage}</h1>
//       <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-lg">
//         <p className="text-lg mb-6">{question.question_text}</p>
//         {question.options && (
//           <div className="space-y-3">
//             {question.options.map((option, index) => (
//               <button
//                 key={index}
//                 className="w-full text-left p-3 rounded-md bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
//               >
//                 {option}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
