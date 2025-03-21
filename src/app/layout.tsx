import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
// import StatusBar from "@/components/StatusBar";
import "./globals.css";
import { Toaster } from "react-hot-toast";
// import AuthInitializer from "./_component/AuthInitializer";


export const metadata: Metadata = {
  title: "Your App",
  description: "Your app description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-center bg-cover bg-[url('/background.png')]">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <AuthInitializer /> */}
          {/* <SeedTeams /> */}
          {/* Sticky StatusBar */}
          {/* <div className="sticky top-0 left-0 right-0 z-50 flex-none">
            <StatusBar />
          </div> */}

          {/* Main content should only scroll when content exceeds viewport height */}
          <main className="flex-1 overflow-y-auto">
            {children}
            <Toaster />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
