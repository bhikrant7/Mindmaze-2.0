"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Team } from "@/lib/types";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import useLoadingStore from "@/lib/store/loadingStore";
import useNavigateWithLoader from "@/components/loaderUI/useNavigateWithLoader";

export default function LoginPage() {
  const navigate = useNavigateWithLoader();

  const [teamForm, setTeamForm] = useState<Team>({
    team_name: "",
    email: "",
    password: "",
  });
  const { loading, user, setTeam, setSession } = useAuthStore();
  const router = useRouter();

  // handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      "Team Data:",
      teamForm.team_name,
      teamForm.email,
      teamForm.password
    );

    // check if the email exists in the teams table
    const { data: existingTeam } = await supabase
      .from("teams")
      .select("*")
      .eq("email", teamForm.email)
      .maybeSingle();

    if (existingTeam) {
      if (
        existingTeam.team_name !== teamForm.team_name ||
        existingTeam.password !== teamForm.password
      ) {
        await supabase.auth.signOut();
        console.error("User already exists with different credentials.");
        toast.error("User already exists with different credentials.", {
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
      console.log("Existing team found. Signing in...");

      // active sessions for this team
      const { data: activeSessions } = await supabase
        .from("sessions")
        .select("*")
        .eq("team_id", existingTeam.id);

      if (activeSessions && activeSessions.length >= 1) {
        console.log(
          "Active session detected. Please log out of there first..."
        );
        toast.error(
          "Active session detected. Please log out of there first...",
          {
            duration: 10000, // How long the toast stays (in ms)
            position: "top-center", // Position of the toast
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
          }
        ); // Success toast

        return;
      }

      // // Get current session count from the database
      // const { data: sessionData } = await supabase
      //   .from("teams")
      //   .select("session_count")
      //   .eq("email", teamForm.email)
      //   .single();

      // if (sessionData?.session_count >= 2) {
      //   console.log("Session limit reached. Blocking login...");
      //   toast.warning("Second session detected. Please log out first.", {
      //     autoClose: false,
      //   });
      //   router.replace("/login");
      //   return;
      // }

      // // If there is an existing refresh token mismatch, force logout
      // if (
      //   existingTeam.refresh_token &&
      //   existingTeam.refresh_token !== session?.refresh_token
      // ) {
      //   console.log("Session already exists. Logging out first...");
      //   await signOut();
      //   router.replace("/login");
      //   return;
      // }

      // sign in using Supabase Auth
      const { error } = await supabase.auth.signInWithPassword({
        email: teamForm.email,
        password: teamForm.password,
      });

      if (error) {
        console.error("Sign in error:", error.message);
        return;
      }

      // fetch the new session
      const { data: newSession, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error fetching session:", sessionError.message);
        return;
      }

      // new session into `sessions` table
      const { error: sessionInsertError } = await supabase
        .from("sessions")
        .insert([
          {
            team_id: existingTeam.id,
            id: newSession.session?.refresh_token, // Using refresh token for tracking
            email: teamForm.email,
          },
        ]);

      if (sessionInsertError) {
        console.error("Error inserting session:", sessionInsertError.message);
        return;
      }

      // Increment session count in `teams` table
      // const { error: sessionCountError } = await supabase
      //   .from("teams")
      //   .update({ session_count: existingTeam.session_count + 1 })
      //   .eq("id", existingTeam.id);

      // if (sessionCountError) {
      //   console.error(
      //     "Failed to update session count:",
      //     sessionCountError.message
      //   );
      //   return;
      // }

      // // Update the refresh token in the database
      // const { error: updateError } = await supabase
      //   .from("teams")
      //   .update({ refresh_token: newSession?.session?.refresh_token })
      //   .eq("email", teamForm.email);

      // if (updateError) {
      //   console.error("Failed to update refresh token:", updateError.message);
      //   return;
      // }

      // updated team fetch
      const { data: updatedTeam } = await supabase
        .from("teams")
        .select("*")
        .eq("email", teamForm.email)
        .single();

      // now update zustand
      setSession(newSession.session); // Store the session in Zustand
      setTeam(updatedTeam || existingTeam);
    } else {
      console.log("No team found. Signing up...");

      // total teams chekc
      const { count, error: countError } = await supabase
        .from("teams")
        .select("*", { count: "exact", head: true });

      if (countError) {
        console.error("Error fetching team count:", countError.message);
        return;
      }

      // no sign-in if team count exceeds 5
      if (count !== null && count >= 5) {
        toast.error("Maximum team limit reached. No more sign-ins allowed.");
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

      const user = authData.user;
      if (!user) {
        console.error("No user returned after sign-up");
        return;
      }

      // new team into teams
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
            // session_count: 1, // Set initial session count
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting team:", insertError.message);
        return;
      }

      //get the current session
      const { data: newSession, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error fetching session:", sessionError.message);
        return;
      }

      // insert new session into `sessions` table
      const { error: sessionInsertError } = await supabase
        .from("sessions")
        .insert([
          {
            team_id: newTeam.id,
            id: newSession.session?.refresh_token, // Using refresh token for tracking
            email: teamForm.email,
          },
        ]);

      if (sessionInsertError) {
        console.error("Error inserting session:", sessionInsertError.message);
        return;
      }

      // update Zustand store
      setSession(authData.session); // Store session in Zustand
      setTeam(newTeam);
    }

    // navigate to main page after successful authentication
    useLoadingStore.getState().setGlobalLoading(true);
    router.push("/mainpage");
    // setTimeout(() => {

    //   // window.location.reload();
    //   useLoadingStore.getState().setGlobalLoading(false);
    // }, 1000);
  };

  // handle form input changes
  const handleChange = (newValues: Partial<Team>) => {
    setTeamForm((prevVal) => ({
      ...prevVal,
      ...newValues,
    }));
  };

  //redirect to main page if user is authenticated
  useEffect(() => {
    if (user && !loading) {
      // useLoadingStore.getState().setGlobalLoading(true);
      // router.push("/mainpage");
      // setTimeout(() => {
      //   // window.location.reload();
      //   useLoadingStore.getState().setGlobalLoading(false);
      // }, 500);
      navigate("/mainpage");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[url('/background.svg')] bg-cover bg-center bg-no-repeat">
      <h1 className="press-start-2p-regular text-lg sm:text-3xl md:text-5xl lg:text-7xl font-bold text-white text-center">
        MINDMAZE 2.0
      </h1>

      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-4 sm:p-6 md:p-8 my-12 space-y-4 sm:space-y-6 bg-gray/10 rounded-2xl shadow-lg shadow-black/90 backdrop-blur-[5.1px] border">
        <div className="space-y-1 sm:space-y-2 text-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white">
            Welcome Team
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
            Log in with provided credentials
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
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
            Forgot password? Shout for Chinmoy Borah
          </div>
        </div>
      </div>
    </div>
  );
}
