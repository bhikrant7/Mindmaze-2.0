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
  
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setTeam: (team: Partial<Team> | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  team: null,
  loading: true,
  session: null,
  setUser: (user: User | null) => set({ user }),
  setTeam: (team: Partial<Team> | null) => set({ team }),
  setSession: (session: Session | null) => set({ session }),
  setLoading: (loading: boolean) => set({ loading }),
  signOut: async () => {
    try {
      const { team } = useAuthStore.getState();
      //update the database to insert the refresh_token as null
      if (team) {
        await supabase
          .from("teams")
          .update({ refresh_token: null })
          .eq("id", team.id);
      }
      await supabase.auth.signOut();
      set({ user: null, team: null, session: null });
    } catch (err) {
      console.error("Error signing out", err);
      set({ user: null, team: null, session: null });
    }
  },
}));

//  Initialize authentication state
supabase.auth.getSession().then(({ data: { session } }) => {
  console.log("Initial session:", session);
  useAuthStore.getState().setUser(session?.user ?? null);
  useAuthStore.getState().setSession(session ?? null);
  useAuthStore.getState().setLoading(false);
});

//  Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth state changed:", event, session?.user?.user_metadata);
  useAuthStore.getState().setUser(session?.user ?? null);
  useAuthStore.getState().setSession(session ?? null);
  useAuthStore.getState().setLoading(false);
});
