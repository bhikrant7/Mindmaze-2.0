import type { Config } from "tailwindcss";
import scrollbarHide from 'tailwind-scrollbar-hide';

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      boxShadow: {
        up: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [
    scrollbarHide
  ],
};

export default config;
