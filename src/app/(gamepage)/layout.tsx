"use client";

// import { useAuthStore } from "@/lib/store/authStore";
// import { StyledWrapper } from "@/components/StyledWrapper";

export default function GamePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const {loading} = useAuthStore();
  return <div className="h-screen w-full p-6">{children}</div>;
}
