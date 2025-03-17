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
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[url('/background.svg')] bg-cover bg-center bg-no-repeat">
      <h1 className="press-start-2p-regular text-7xl top font-bold text-white">MINDMAZE 2.0</h1>

      <div className="w-full max-w-sm sm:max-w-md p-4 sm:p-8 my-20 space-y-4 sm:space-y-6 bg-gray/10 rounded-2xl shadow-lg shadow-black/90 backdrop-blur-[5.1px] border">
        <div className="space-y-1 sm:space-y-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome Niggas
          </h1>
          <p className="text-sm my-5 sm:text-base text-zinc-500 dark:text-zinc-400">
            Log in with provided credentials
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
              placeholder="Enter Team Name"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="flex h-9 mt-2 sm:h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm ring-offset-[#FF9544] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF9544] focus-visible:ring-offset-2 dark:bg-zinc-950 border-1 border-[#FF9544] p-4 focus:border-[#FF9544]"
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
              className="flex h-9 mt-2 sm:h-10 w-full rounded-md bg-[#FF9544] px-3 py-2 text-sm ring-offset-[#FF9544] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF9544] focus-visible:ring-offset-2 dark:bg-zinc-950 border-1 border-[#FF9544] p-4 focus:border-[#FF9544]"
            />
          </div>
<div className="my-8 flex justify-center align-middle">
<Button
  onClick={handleLogin}
  className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-gradient-to-r from-[#fa8100] to-[#b05800] px-6 font-medium text-white transition-all duration-150 shadow-[3px_3px_8px_rgba(255,149,68,0.4)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)] active:bg-gradient-to-r active:from-[#fa8100] active:to-[#b05800] hover:bg-gradient-to-r hover:from-[#fa8100] hover:to-[#b05800] active:text-white">
    <span>Let&#039;s Go</span>
    <div className="ml-1 transition group-hover:translate-x-2">
    <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
      <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
    </svg>
  </div>
</Button>
            </div>
        </div>

        <div className="text-center">
          <a
            href="#"
            className="text-xs sm:text-sm mb-3 text-zinc-900 dark:text-zinc-100 hover:underline"
          >
            Forgot password? Shout for Chinmoy Da
          </a>
        </div>
      </div>
    </div>
  );
}
