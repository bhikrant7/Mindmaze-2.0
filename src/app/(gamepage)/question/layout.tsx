"use client";

export default function GamePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-screen w-full p-6">
    <div className=""></div>
    {children}</div>;
}
