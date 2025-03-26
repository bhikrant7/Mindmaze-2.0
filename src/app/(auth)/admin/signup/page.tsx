"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export interface Team {
  team_name: string;
  email: string;
  password: string;
  adminKey: string;
}

export default function AdminMode() {
  const router = useRouter();

  const [teamForm, setTeamForm] = useState<Team>({
    team_name: "",
    email: "",
    password: "",
    adminKey: "",
  });
  const { loading } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      "Team Data:",
      teamForm.team_name,
      teamForm.email,
      teamForm.password,
      // teamForm.adminKey
    );

    // console.log(
    //   "type of key",
    //   typeof process.env.NEXT_PUBLIC_ADMIN_KEY,
    //   " and value ",
    //   process.env.NEXT_PUBLIC_ADMIN_KEY
    // );

    if (!teamForm.password || !teamForm.team_name || !teamForm.email) {
      console.log("Credentials not provided!");
      toast.error("Credentials not provided!", {
        duration: 1000,
        position: "top-center",
        style: {
          background: "rgba(19, 12, 28, 0.15)",
          border: "1px solid #422d28",
          color: "#ff4d4d",
          padding: "12px 16px",
          borderRadius: "8px",
          backdropFilter: "blur(8px)",
        },
        iconTheme: {
          primary: "#ff4d4d",
          secondary: "#422d28",
        },
      });
      return;
    }

    if (!teamForm.adminKey) {
      console.log("No Admin key provided!");
      toast.error("Admin key not provided.", {
        duration: 1000,
        position: "top-center",
        style: {
          background: "rgba(19, 12, 28, 0.15)",
          border: "1px solid #422d28",
          color: "#ff4d4d",
          padding: "12px 16px",
          borderRadius: "8px",
          backdropFilter: "blur(8px)",
        },
        iconTheme: {
          primary: "#ff4d4d",
          secondary: "#422d28",
        },
      });
      return;
    }

    if (
      teamForm.adminKey.trim() !== process.env.NEXT_PUBLIC_ADMIN_KEY?.trim()
    ) {
      // console.log(
      //   "Admin Key from input:", JSON.stringify(teamForm.adminKey),
      //   "Admin Key from ENV:", JSON.stringify(process.env.NEXT_PUBLIC_ADMIN_KEY)
      // );

      toast.error("Admin key doesn't match.", {
        duration: 1000,
        position: "top-center",
        style: {
          background: "rgba(19, 12, 28, 0.15)",
          border: "1px solid #422d28",
          color: "#ff4d4d",
          padding: "12px 16px",
          borderRadius: "8px",
          backdropFilter: "blur(8px)",
        },
        iconTheme: {
          primary: "#ff4d4d",
          secondary: "#422d28",
        },
      });
      return;
    }

    // check if the email exists in the teams table
    const { data: existingTeamByMail } = await supabase
      .from("teams")
      .select("*")
      .eq("email", teamForm.email)
      .maybeSingle();

    const { data: existingTeamByName } = await supabase
      .from("teams")
      .select("*")
      .eq("team_name", teamForm.team_name)
      .maybeSingle();

    if (existingTeamByMail) {
      console.error("Team already exists with the email.");
      toast.error("Team already exists with the email.", {
        duration: 10000,
        position: "top-center",
        style: {
          background: "rgba(19, 12, 28, 0.15)",
          border: "1px solid #422d28",
          color: "#ff4d4d",
          padding: "12px 16px",
          borderRadius: "8px",
          backdropFilter: "blur(8px)",
        },
        iconTheme: {
          primary: "#ff4d4d",
          secondary: "#422d28",
        },
      });
      return;
    }
    if (existingTeamByName) {
      console.error("Team already exists with the name.");
      toast.error("Team already exists with the name.", {
        duration: 10000,
        position: "top-center",
        style: {
          background: "rgba(19, 12, 28, 0.15)",
          border: "1px solid #422d28",
          color: "#ff4d4d",
          padding: "12px 16px",
          borderRadius: "8px",
          backdropFilter: "blur(8px)",
        },
        iconTheme: {
          primary: "#ff4d4d",
          secondary: "#422d28",
        },
      });
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: teamForm.email,
      password: teamForm.password,
    });

    if (authError) {
      console.error("Sign up error:", authError.message);
      return;
    }

    // new team into teams
    const { error: insertError } = await supabase.from("teams").insert([
      {
        team_name: teamForm.team_name,
        email: teamForm.email,
        password: teamForm.password,
        current_question_id: 0,
        questions_solved: 0,
        has_submitted: false,
        refresh_token: authData.session?.refresh_token,
        // session_count: 1, // Set initial session count
      },
    ]);
    //   .select()
    //   .single();
    if (insertError) {
      console.error("Error inserting team:", insertError.message);
      return;
    }

    toast.success("Signed Out successfully", {
      duration: 10000,
      position: "top-center",
      style: {
        background: "rgba(19, 12, 28, 0.15)",
        border: "1px solid #00AB66",
        color: "#00AB66",
        padding: "12px 16px",
        borderRadius: "8px",
        backdropFilter: "blur(8px)",
      },
      iconTheme: {
        primary: "#00AB66",
        secondary: "#FFFFFF",
      },
    });
    //successful signup
    router.refresh();
  };

  // handle form input changes
  const handleChange = (newValues: Partial<Team>) => {
    setTeamForm((prevVal) => ({
      ...prevVal,
      ...newValues,
    }));
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[url('/background.svg')] bg-cover bg-center bg-no-repeat">
      <h1 className="press-start-2p-regular text-lg sm:text-3xl md:text-5xl lg:text-7xl font-bold text-white text-center">
        ADMIN MODE
      </h1>

      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-4 sm:p-6 md:p-8 my-12 space-y-4 sm:space-y-6 bg-gray/10 rounded-2xl shadow-lg shadow-black/90 backdrop-blur-[5.1px] border">
        <div className="space-y-1 sm:space-y-2 text-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white">
            REGISTRATION
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
            SIGNUP FORM
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label
              htmlFor="admin_key"
              className="text-sm sm:text-md font-medium leading-none text-white"
            >
              Admin Key
            </Label>
            <Input
              id="admin_key"
              type="password"
              placeholder="Enter Admin Key"
              value={teamForm.adminKey}
              onChange={(e) => handleChange({ adminKey: e.target.value })}
              className="h-9 sm:h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm ring-offset-[#FF9544] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF9544] focus-visible:ring-offset-2 dark:bg-zinc-950 border border-[#FF9544] focus:border-[#FF9544]"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label
              htmlFor="team_name"
              className="text-sm sm:text-md font-medium leading-none text-white"
            >
              Team Name
            </Label>
            <Input
              id="team_name"
              type="text"
              placeholder="Enter Team Name"
              value={teamForm.team_name}
              onChange={(e) => handleChange({ team_name: e.target.value })}
              className="h-9 sm:h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm ring-offset-[#FF9544] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF9544] focus-visible:ring-offset-2 dark:bg-zinc-950 border border-[#FF9544] focus:border-[#FF9544]"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label
              htmlFor="email"
              className="text-sm sm:text-md font-medium leading-none text-white"
            >
              Email
            </Label>
            <Input
              id="email"
              type="text"
              placeholder="Enter provided Email"
              value={teamForm.email}
              onChange={(e) => handleChange({ email: e.target.value })}
              className="system-ui h-9 sm:h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm ring-offset-[#FF9544] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF9544] focus-visible:ring-offset-2 dark:bg-zinc-950 border border-[#FF9544] focus:border-[#FF9544]"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label
              htmlFor="password"
              className="text-sm sm:text-md font-medium leading-none text-white"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={teamForm.password}
              onChange={(e) => handleChange({ password: e.target.value })}
              className="h-9 sm:h-10 w-full rounded-md bg-[#FF9544] px-3 py-2 text-sm ring-offset-[#FF9544] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF9544] focus-visible:ring-offset-2 dark:bg-zinc-950 border border-[#FF9544] focus:border-[#FF9544]"
            />
          </div>

          <div className="my-6 flex justify-center">
            <Button
              onClick={handleLogin}
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-gradient-to-r from-[#fa8100] to-[#b05800] px-6 font-medium text-white transition-all duration-150 shadow-[5px_5px_1px_rgba(255,149,68,0.3)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)] active:bg-gradient-to-r active:from-[#fa8100] active:to-[#b05800] hover:bg-gradient-to-r hover:from-[#fa8100] hover:to-[#b05800] active:text-white"
            >
              {!loading ? (
                <span>Let&#039;s Go</span>
              ) : (
                <span>Signing in...</span>
              )}
              <div className="ml-1 transition group-hover:translate-x-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                >
                  <path
                    d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
            </Button>
          </div>
        </div>

        <div className="text-center">
          <div className="text-xs sm:text-sm mb-3 text-white hover:underline hover:[text-underline-offset:3px]">
            BE MINDFULL ADMIN!!
          </div>
        </div>
      </div>
    </div>
  );
}
