// app/layout.tsx (Server Component ✅)
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ClientWrapper from "../components/loaderUI/ClientWrapper";
// import FetchQuestions from "@/components/FetchQuestions";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"], // Choose weights if needed
  variable: "--font-orbitron", // Create a CSS variable for the font
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={orbitron.variable}>
      <body className="min-h-screen flex flex-col bg-center bg-cover bg-[url('/background.png')]">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientWrapper>
            {/* <FetchQuestions /> */}
            <main className="flex-1 overflow-y-auto">{children}</main>
          </ClientWrapper>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
// 