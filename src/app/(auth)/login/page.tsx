"use client";
// all components are Server Components by default
// Server Components can't use client-side features like:
// useState
// useEffect
// onClick handlers
// Browser APIs
// etc.

// to use client-side features, we need to use the "use client" directive

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function LoginPage() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const handleLogin = () => {
    console.log(user);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-zinc-100 dark:bg-zinc-900">
      <div className="w-full max-w-sm sm:max-w-md p-4 sm:p-8 space-y-4 sm:space-y-6 bg-white dark:bg-zinc-800 rounded-lg sm:rounded-xl shadow-lg">
        <div className="space-y-1 sm:space-y-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome Team
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
            Sign in with provided credentials
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <label
              htmlFor="username"
              className="text-sm sm:text-md font-medium leading-none"
            >
              Team Name
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your team name"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="flex h-9 sm:h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label
              htmlFor="password"
              className="text-sm sm:text-md font-medium leading-none"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="flex h-9 sm:h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950"
            />
          </div>

          <Button
            className="w-full h-9 sm:h-10 text-sm sm:text-base"
            onClick={handleLogin}
          >
            Sign in
          </Button>
        </div>

        <div className="text-center">
          <a
            href="#"
            className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 hover:underline"
          >
            Forgot password? Ask event coordinator
          </a>
        </div>
      </div>
    </div>
  );
}
