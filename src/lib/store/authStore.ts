"use client";

import { create } from "zustand";
import { supabase } from "../supabaseClient";
import { Session, User } from "@supabase/supabase-js";
import { Team } from "../types";

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
  team: null,
  loading: true,
  session: null,
  activeSessions: 0,

  setUser: (user: User | null) => set({ user }),
  setTeam: (team: Partial<Team> | null) => set({ team }),
  setSession: (session: Session | null) => set({ session }),
  setLoading: (loading: boolean) => set({ loading }),
  setActiveSessions: (count: number) => set({ activeSessions: count }),

  subscribeToSessionUpdates: (email: string) => {
    // Subscribe to changes on the sessions table for the current email
    const channel = supabase
      .channel(`session_updates_${email}`)
      .on(
        "postgres_changes",
        {
          event: "*", // listen for INSERT, UPDATE, and DELETE events
          schema: "public",
          table: "sessions",
          filter: `email=eq.${email}`,
        },
        async (payload) => {
          console.log("Session change detected:", payload);
          // Count active sessions directly from the sessions table
          const { data: sessions, error } = await supabase
            .from("sessions")
            .select("*")
            .eq("email", email);
          if (!error && sessions) {
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
      await supabase
        .from("sessions")
        .delete()
        .eq("team_id", useAuthStore.getState().team?.id)
        .eq("session_id", useAuthStore.getState().session?.refresh_token);

      await supabase.auth.signOut();
      set({ user: null, team: null, session: null, activeSessions: 0 });
    } catch (err) {
      console.error("Error signing out:", err);
      set({ user: null, team: null, session: null, activeSessions: 0 });
    }
  },
}));

// Initialize authentication state
supabase.auth.getSession().then(({ data: { session } }) => {
  console.log("Initial session:", session);
  useAuthStore.getState().setUser(session?.user ?? null);
  useAuthStore.getState().setSession(session ?? null);
  useAuthStore.getState().setLoading(false);

  if (session?.user?.email) {
    useAuthStore.getState().subscribeToSessionUpdates(session.user.email);
  }
});

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth state changed:", event, session);
  useAuthStore.getState().setUser(session?.user ?? null);
  useAuthStore.getState().setSession(session ?? null);
  useAuthStore.getState().setLoading(false);

  if (session?.user?.email) {
    useAuthStore.getState().subscribeToSessionUpdates(session.user.email);
  }
});
