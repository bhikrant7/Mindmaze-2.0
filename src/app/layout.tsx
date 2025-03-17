import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import StatusBar from "@/components/StatusBar";
import "./globals.css";

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
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Sticky StatusBar */}
          <div className="sticky top-0 left-0 right-0 z-50 flex-none">
            <StatusBar />
          </div>

          {/* Main content should only scroll when content exceeds viewport height */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
