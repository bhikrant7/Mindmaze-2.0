"use client"

import { create } from "zustand";
import { supabase } from "../supabaseClient";
import { Session, User } from "@supabase/supabase-js";
import { Team } from "../types";

// Define your state interface
interface AuthState {
  user: User | null;
  team: Partial<Team> | null;
  loading: boolean;
  session: Session | null;
  activeSessions: number;

  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setTeam: (team: Partial<Team> | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setActiveSessions: (count: number) => void;
  subscribeToSessionUpdates: (email: string) => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  team:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("auth-team") || "null")
      : null, // Only access localStorage on the client
  loading: true,
  session: null,
  activeSessions: 0,

  setUser: (user: User | null) => set({ user }),
  setTeam: (team: Partial<Team> | null) => {
    if (typeof window !== "undefined") {
      // Check if we're on the client-side
      localStorage.setItem("auth-team", JSON.stringify(team)); // Persist team to localStorage
    }
    set({ team });
  },
  setSession: (session: Session | null) => set({ session }),
  setLoading: (loading: boolean) => set({ loading }),
  setActiveSessions: (count: number) => set({ activeSessions: count }),

  // subscribeToSessionUpdates: (email: string) => {
  //   const channel = supabase
  //     .channel(`session_updates_${email}`)
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "sessions",
  //         filter: `email=eq.${email}`,
  //       },
  //       async (payload) => {
  //         console.log("Session change detected:", payload);
  //         const { data: sessions, error } = await supabase
  //           .from("sessions")
  //           .select("*")
  //           .eq("email", email);
  //         if (!error && sessions) {
  //           if(sessions.length > 5){

  //           }
  //           set({ activeSessions: sessions.length });
  //         }
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // },
  subscribeToSessionUpdates: (email: string) => {
    const channel = supabase
      .channel(`session_updates_${email}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sessions",
          filter: `email=eq.${email}`,
        },
        async (payload) => {
          console.log("Session change detected:", payload);
          const { data: sessions, error } = await supabase
            .from("sessions")
            .select("*")
            .eq("email", email);
          if (!error && sessions) {
            if (sessions.length > 5) {
            }
            set({ activeSessions: sessions.length });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  signOut: async () => {
    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData?.session?.refresh_token) {
        throw new Error("Failed to retrieve session token");
      }

      const { error: deleteError } = await supabase
        .from("sessions")
        .delete()
        .eq("id", sessionData.session.refresh_token);

      if (deleteError) {
        console.error("Failed to delete session:", deleteError);
      }

      await supabase.auth.signOut();

      if (typeof window !== "undefined") {
        localStorage.removeItem("supabase.auth.token");
        localStorage.removeItem("auth-team");
        localStorage.removeItem("question-storage")
      }
      sessionStorage.clear();

      set({ user: null, team: null, session: null, activeSessions: 0 });
    } catch (err) {
      console.error("Error signing out:", err);
      set({ user: null, team: null, session: null, activeSessions: 0 });
    }
  },
}));

// Initialize authentication state
supabase.auth.getSession().then(async ({ data: { session } }) => {
  useAuthStore.getState().setUser(session?.user ?? null);
  useAuthStore.getState().setSession(session ?? null);
  useAuthStore.getState().setLoading(false);

  if (session?.user?.email) {
    useAuthStore.getState().subscribeToSessionUpdates(session.user.email);
    if (!useAuthStore.getState().team) {
      const { data: team, error } = await supabase
        .from("teams")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (!error) {
        useAuthStore.getState().setTeam(team);
      }
    }
  }
});

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  useAuthStore.getState().setUser(session?.user ?? null);
  useAuthStore.getState().setSession(session ?? null);
  useAuthStore.getState().setLoading(false);

  if (session?.user?.email) {
    useAuthStore.getState().subscribeToSessionUpdates(session.user.email);
  }
});
