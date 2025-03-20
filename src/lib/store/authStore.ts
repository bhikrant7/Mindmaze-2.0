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
  session_overlap: boolean;

  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setTeam: (team: Partial<Team> | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setSessionOverlap:(session_overlap:boolean)=>void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  team: null,
  loading: true,
  session: null,
  session_overlap:false,

  setUser: (user: User | null) => set({ user }),
  setTeam: (team: Partial<Team> | null) => set({ team }),
  setSession: (session: Session | null) => set({ session }),
  setLoading: (loading: boolean) => set({ loading }),
  setSessionOverlap:(session_overlap:boolean)=>set({session_overlap}),

  signOut: async () => {
    try {
      const { team } = useAuthStore.getState();

      await supabase.auth.signOut();

      if (team) {
        await supabase
          .from("teams")
          .update({ refresh_token: null })
          .eq("team_name", team.team_name);
      }

      set({ user: null, team: null, session: null });
    } catch (err) {
      console.error("Error signing out", err);
      set({ user: null, team: null, session: null });
    }
  },
}));

// Initialize authentication state
supabase.auth.getSession().then(({ data: { session } }) => {
  console.log("Initial session:", session);
  useAuthStore.getState().setUser(session?.user ?? null);
  useAuthStore.getState().setSession(session ?? null);
  useAuthStore.getState().setLoading(false);
});

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  const { user: currentUser, session: currentSession } = useAuthStore.getState();
  
  // Only update if the session has changed
  if (session?.access_token !== currentSession?.access_token) {
    console.log("Auth state changed:", event, session);
    useAuthStore.getState().setUser(session?.user ?? null);
    useAuthStore.getState().setSession(session ?? null);
    useAuthStore.getState().setLoading(false);
  }
});
