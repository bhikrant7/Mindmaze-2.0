// "use client";

// import {} from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Questions } from "@/components/data";
// import { useRouter } from "next/navigation";
// import Guide from "./Guide";

// const RightSidebar = () => {
//   const isLoading = false;
//   const router = useRouter();
//   return (
//     <div className="h-full flex flex-col select-none w-full max-w-[1000px] min-w-fit">
//       {/* Library section */}
//       <div className="h-full rounded-lg bg-zinc-800/35 flex flex-col overflow-hidden shadow-lg border border-zinc-700/30">
//         <Guide />

//         {/* Scroll area */}
//         <ScrollArea className="flex-1">
//           <div className="p-4 space-y-2">
//             {isLoading ? (
//               <div>Loading...</div>
//             ) : (
//               Questions.map((q) => (
//                 <div
//                   key={q.id}
//                   className="p-3 hover:bg-white/5 rounded-md flex items-center gap-3 group cursor-pointer transition-colors duration-200"
//                   onClick={() => router.push(`/question/${q.id}`)}
//                 >
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-zinc-100 flex items-center">
//                       <span className="min-w-[24px]">{q.id}</span>
//                       <span className="mx-2">.</span>
//                       <span className="overflow-hidden text-ellipsis whitespace-nowrap">
//                         {q.question_text}
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </ScrollArea>
//       </div>
//     </div>
//   );
// };

// export default RightSidebar;
