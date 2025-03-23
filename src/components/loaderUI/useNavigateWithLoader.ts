// lib/hooks/useNavigateWithLoader.ts
"use client";

import { useRouter } from "next/navigation";
import useLoadingStore from "@/lib/store/loadingStore";

export default function useNavigateWithLoader() {
  const router = useRouter();
  const setGlobalLoading = useLoadingStore((state) => state.setGlobalLoading);

  const navigate = (path: string) => {
    setGlobalLoading(true); // Show loader before navigation
    router.push(path);
    setGlobalLoading(false);
    // setTimeout(() => {
    //    // Hide loader after navigation
    // }, 500); // Adjust delay if needed
  };

  return navigate;
}
