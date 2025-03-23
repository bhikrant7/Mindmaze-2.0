// app/layout.tsx (Server Component ✅)
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ClientWrapper from "../components/loaderUI/ClientWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-center bg-cover bg-[url('/background.png')]">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ClientWrapper>
            <main className="flex-1 overflow-y-auto">{children}</main>
          </ClientWrapper>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
