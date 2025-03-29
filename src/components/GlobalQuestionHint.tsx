"use client";


import * as React from "react";

const URL = "https://www.google.com/";

export function GlobalQuestionHint({ questionId, children }: { questionId: number; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  if (questionId !== 7) {
    return null; // Do not render if conditions aren't met
  }

  return (
    <>
      <span onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </span>
      {isOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    onClick={() => setIsOpen(false)} // Close when clicking the background
  >
    <div
      className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-auto text-center relative"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
    >
      <h2 className="text-xl text-[red] font-semibold">System Failure: Code Missing </h2>
      <p className="text-sm text-gray-500">[ Error:  ANSWER not found ]</p>
      {/* <p className="text-sm text-gray-500">You can find more details in the link below.</p> */}

    </div>
  </div>
)}

    </>
  );
}