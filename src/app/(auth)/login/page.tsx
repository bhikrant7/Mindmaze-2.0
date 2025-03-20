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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Team } from "@/lib/types";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [teamForm, setTeamForm] = useState<Team>({
    team_name: "",
    email: "",
    password: "",
  });
  const {
    loading,
    user,
    setTeam,
    session,
    signOut,
    setSessionOverlap,
    session_overlap,
  } = useAuthStore();
  const router = useRouter();

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      "Team Data:",
      teamForm.team_name,
      teamForm.email,
      teamForm.password
    );

    // Check if the email exists in the teams table
    const { data: existingTeam } = await supabase
      .from("teams")
      .select("*")
      .eq("email", teamForm.email)
      .single();

    // If team exists, then sign in; otherwise, sign up
    if (existingTeam) {
      console.log("Existing team found. Signing in...");

      // Check if the refresh token in the database matches the current session token
      if (
        existingTeam.refresh_token &&
        existingTeam.refresh_token !== session?.refresh_token
      ) {
        console.log("Session already exists. Logging out first...");
        // setSessionOverlap(true);
        // Log the user out
        await signOut().then(() => {
          console.log("Logged out successfully");
          setSessionOverlap(existingTeam.email);
          console.log("session count: ",session_overlap)
          // Perform a hard refresh
          // router.replace("/login");
        });
      }
      if (session_overlap >= 2) {
        console.log("Session overlap detected. Block you here...");

        router.replace("/login");
        return;
      }

      // Sign in using Supabase Auth
      const { error } = await supabase.auth.signInWithPassword({
        email: teamForm.email,
        password: teamForm.password,
      });

      if (error) {
        console.error("Sign in error:", error.message);
        return;
      }

      // Update team's refresh_token with the new session's token
      const { data: newSession, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error fetching session:", sessionError.message);
        return;
      }

      const { error: updateError } = await supabase
        .from("teams")
        .update({ refresh_token: newSession?.session?.refresh_token })
        .eq("email", teamForm.email);

      if (updateError) {
        console.error("Failed to update refresh token:", updateError.message);
        return;
      }

      // Fetch the updated team data
      const { data: updatedTeam } = await supabase
        .from("teams")
        .select("*")
        .eq("email", teamForm.email)
        .single();

      // Update Zustand store
      // setUser(data.user);
      setTeam(updatedTeam || existingTeam);
    } else {
      console.log("No team found. Signing up...");
      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: teamForm.email,
        password: teamForm.password,
      });

      if (authError) {
        console.error("Sign up error:", authError.message);
        return;
      }

      const user = authData.user;
      if (!user) {
        console.error("No user returned after sign up");
        return;
      }

      // Insert new team into the teams table with default values
      const { data: newTeam, error: insertError } = await supabase
        .from("teams")
        .insert([
          {
            team_name: teamForm.team_name,
            email: teamForm.email,
            password: teamForm.password,
            current_question_id: 0,
            questions_solved: 0,
            has_submitted: false,
            refresh_token: authData.session?.refresh_token,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting team:", insertError.message);
        return;
      }

      // Update Zustand store
      // setUser(user);
      setTeam(newTeam);
    }

    // Navigate to main page after successful authentication
    router.push("/mainpage");
  };

  // Handle form input changes
  const handleChange = (newValues: Partial<Team>) => {
    setTeamForm((prevVal) => ({
      ...prevVal,
      ...newValues,
    }));
  };

  //Redirect to main page if user is authenticated
  useEffect(() => {
    if (user && !loading) {
      router.push("/mainpage");
    }
  }, [user, loading]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[url('/background.svg')] bg-cover bg-center bg-no-repeat">
      <h1 className="press-start-2p-regular text-7xl top font-bold text-white">
        MINDMAZE 2.0
      </h1>

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
            <Label
              htmlFor="team_name"
              className="text-sm sm:text-md font-medium leading-none"
            >
              Team Name
            </Label>

            <Input
              id="team_name"
              type="text"
              placeholder="Enter Team Name"
              value={teamForm.team_name}
              onChange={(e) => handleChange({ team_name: e.target.value })}
              className="flex h-9 mt-2 sm:h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm ring-offset-[#FF9544] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF9544] focus-visible:ring-offset-2 dark:bg-zinc-950 border-1 border-[#FF9544] p-4 focus:border-[#FF9544]"
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label
              htmlFor="email"
              className="text-sm sm:text-md font-medium leading-none"
            >
              Email
            </Label>
            <Input
              id="email"
              type="text"
              placeholder="Enter provided Email"
              value={teamForm.email}
              onChange={(e) => handleChange({ email: e.target.value })}
              className="flex h-9 mt-2 sm:h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm ring-offset-[#FF9544] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF9544] focus-visible:ring-offset-2 dark:bg-zinc-950 border-1 border-[#FF9544] p-4 focus:border-[#FF9544]"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label
              htmlFor="password"
              className="text-sm sm:text-md font-medium leading-none"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={teamForm.password}
              onChange={(e) => handleChange({ password: e.target.value })}
              className="flex h-9 mt-2 sm:h-10 w-full rounded-md bg-[#FF9544] px-3 py-2 text-sm ring-offset-[#FF9544] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF9544] focus-visible:ring-offset-2 dark:bg-zinc-950 border-1 border-[#FF9544] p-4 focus:border-[#FF9544]"
            />
          </div>
          <div className="my-8 flex justify-center align-middle">
            <Button
              onClick={handleLogin}
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-gradient-to-r from-[#fa8100] to-[#b05800] px-6 font-medium text-white transition-all duration-150 shadow-[3px_3px_8px_rgba(255,149,68,0.4)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)] active:bg-gradient-to-r active:from-[#fa8100] active:to-[#b05800] hover:bg-gradient-to-r hover:from-[#fa8100] hover:to-[#b05800] active:text-white"
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
                    // fill-rule="evenodd"
                    // clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
            </Button>
          </div>
        </div>

        <div className="text-center">
          <div className="text-xs sm:text-sm mb-3 text-zinc-900 dark:text-zinc-100 hover:underline">
            Forgot password? Shout for Chinmoy Da
          </div>
        </div>
      </div>
    </div>
  );
}
