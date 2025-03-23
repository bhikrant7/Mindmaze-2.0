// components/ClientWrapper.tsx (Client Component ✅)
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import GlobalLoader from "./GlobalLoader";
import useLoadingStore from "@/lib/store/loadingStore";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isGlobalLoading = useLoadingStore((state) => state.isGlobalLoading);
  const setGlobalLoading = useLoadingStore((state) => state.setGlobalLoading);

  useEffect(() => {
    setGlobalLoading(true); // Show loader when route changes

    const timeout = setTimeout(() => {
      setGlobalLoading(false); // Hide loader after a short delay (prevents flickering)
    }, 500);

    return () => clearTimeout(timeout); // Cleanup timer to prevent memory leaks
  }, [pathname]);

  return (
    <>
      {isGlobalLoading && <GlobalLoader />}
      {!isGlobalLoading && children} {/* Hide content while loading */}
    </>
  );
}
