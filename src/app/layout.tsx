"use client";

import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import GlobalLoader from "@/components/GlobalLoader";
import useLoadingStore from "@/lib/store/loadingStore";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isGlobalLoading = useLoadingStore((state) => state.isGlobalLoading); 

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-center bg-cover bg-[url('/background.png')]">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {isGlobalLoading ? <GlobalLoader /> : <main className="flex-1 overflow-y-auto">{children}<Toaster /></main>}
        </ThemeProvider>
      </body>
    </html>
  );
}
