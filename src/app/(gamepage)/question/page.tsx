"use client";

import useNavigateWithLoader from "@/components/loaderUI/useNavigateWithLoader";
// import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export default function QuestionPage() {
  const navigate = useNavigateWithLoader();
  const { user, team } = useAuthStore();

  useEffect(() => {
    // Different navigation methods in Next.js:

    // 1. push - adds to history stack (can go back)
    // router.push("/question/1");
    if (!user && !team) {
      navigate("/login");
    } else {
      navigate("/question/1");
    }

    // 2. replace - replaces current history entry (can't go back)
    // router.replace("/question/1");

    // 3. back - go to previous page
    // router.back();

    // 4. forward - go to next page
    // router.forward();

    // 5. refresh - refresh the current page
    // router.refresh();

    // 6. prefetch - prefetch a route (optimization)
    // router.prefetch("/question/1");
  }, [navigate, user, team]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse">Loading...</div>
    </div>
  );
}
