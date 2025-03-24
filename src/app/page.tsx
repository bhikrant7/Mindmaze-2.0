"use client"

import useNavigateWithLoader from "@/components/loaderUI/useNavigateWithLoader";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigateWithLoader();
  useEffect(() => {
    navigate("/login");
  }, [navigate]);
  return (
    <main className="min-h-screen flex flex-col">
      {/* Status Bar */}
      {/* Main Content Area */}
      <div className="flex-grow container mx-auto p-4">
        {/* Your main content goes here */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          MineMaze
        </h1>
      </div>
    </main>
  );
}
