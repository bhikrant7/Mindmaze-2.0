"use client";

import { fetchAllQuestions } from "@/lib/apiCalls/api";
import { useEffect, useRef } from "react";

export default function FetchQuestions() {
  const isFetchedRef = useRef(false); // Track if API is called

  useEffect(() => {
    if (!isFetchedRef.current) {
      fetchAllQuestions();
      isFetchedRef.current = true; // Prevents multiple API calls
      // 
    }
  }, []);

  return null; //Remove unnecessary 
}
