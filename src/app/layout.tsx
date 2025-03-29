// app/layout.tsx (Server Component ✅)
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ClientWrapper from "../components/loaderUI/ClientWrapper";
// import FetchQuestions from "@/components/FetchQuestions";
import { Source_Code_Pro } from 'next/font/google';

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  weight: ['400', '700', '200'], // Add required weights
  variable: '--font-source-code-pro', // Define a CSS variable
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={sourceCodePro.variable}>
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