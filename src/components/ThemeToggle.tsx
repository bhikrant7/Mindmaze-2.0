// "use client";

// import { useTheme } from "next-themes";
// import { useEffect, useState } from "react";
// import { Moon, Sun } from "lucide-react"; // Optional: install lucide-react for icons
// import { Button } from "@/components/ui/button"

// export function ThemeToggle() {
//   const [mounted, setMounted] = useState(false);
//   const { theme, setTheme } = useTheme();

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) {
//     return null;
//   }

//   return (
//     <Button
//       onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//       className="p-5 rounded-md hover:bg-zinc-400 dark:hover:bg-zinc-800"
//       aria-label="Toggle theme"
//       variant="outline"
//     >
//       {theme === "dark" ? (
//         <Sun className="h-10 w-10" />
//       ) : (
//         <Moon className="h-10 w-10" />
//       )}
//     </Button>
//   );
// }
