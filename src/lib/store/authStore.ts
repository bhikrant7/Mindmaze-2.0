"use client";

import { create } from "zustand";
import { supabase } from "../supabaseClient";
// import { AuthError, Session, User } from "@supabase/supabase-js";
import { Session, User } from "@supabase/supabase-js";
import { Team } from "../types";

interface AuthState {
  user: User | null;
  team: Partial<Team> | null;
  loading: boolean;
  session: Session | null;
  session_overlap: number | 0;

  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setTeam: (team: Partial<Team> | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setSessionOverlap: (email: string) => void;
  // signIn: (
  //   email: string,
  //   password: string
  // ) => Promise<User | Session | AuthError | null>;
  // signUp: (
  //   email: string,
  //   password: string
  // ) => Promise<User | Session | AuthError | null>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  team: null,
  loading: true,
  session: null,
  session_overlap: 0,

  setUser: (user: User | null) => set({ user }),
  setTeam: (team: Partial<Team> | null) => set({ team }),
  setSession: (session: Session | null) => set({ session }),
  setLoading: (loading: boolean) => set({ loading }),
  setSessionOverlap: async (email: string) => {
    const { data, error } = await supabase
      .from("teams")
      .select("session_count")
      .eq("email", email)
      .single();

    if (error) {
      console.error("Error fetching session_overlap:", error.message);
      return;
    }

    const newSessionOverlap = (data?.session_count) + 1;

    const { error: updateError } = await supabase
      .from("teams")
      .update({ session_count: newSessionOverlap })
      .eq("email", email);

    if (updateError) {
      console.error("Error updating session_overlap:", updateError.message);
    } else {
      set({ session_overlap: newSessionOverlap });
    }
  },

  signOut: async () => {
    try {
      const { user } = useAuthStore.getState();
      await supabase.auth.signOut();

      if (user?.email) {
        await supabase
          .from("teams")
          .update({ refresh_token: null })
          .eq("email", user.email);
      }

      set({ user: null, team: null, session: null });
    } catch (err) {
      console.error("Error signing out:", err);
      set({ user: null, team: null, session: null });
    }
  },

  // signIn: async (
  //   email: string,
  //   password: string
  // ): Promise<User | Session | AuthError | null> => {
  //   try {
  //     const { data, error } = await supabase.auth.signInWithPassword({
  //       email,
  //       password,
  //     });
  //     if (data) {
  //       set({ user: data.user, session: data.session });
  //       return data.user || data.session;
  //     } else if (error) {
  //       console.error("Error signing in:", error);
  //       return error;
  //     }

  //     return null;
  //   } catch (err) {
  //     console.error("Error signing in:", err);
  //     return null;
  //   }
  // },

  // signUp: async (
  //   email: string,
  //   password: string
  // ): Promise<User | Session | AuthError | null> => {
  //   try {
  //     const { data, error } = await supabase.auth.signUp({
  //       email,
  //       password,
  //     });

  //     if (data) {
  //       set({ user: data.user, session: data.session });
  //       return data.session || data.user;
  //     } else if (error) {
  //       console.error("Error signing up:", error);
  //       return error;
  //     }

  //     return null;
  //   } catch (err) {
  //     console.error("Error signing up:", err);
  //     return null;
  //   }
  // },
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user: currentUser, session: currentSession } =
    useAuthStore.getState();

  // Only update if the session has changed
  if (session?.access_token !== currentSession?.access_token) {
    console.log("Auth state changed:", event, session);
    useAuthStore.getState().setUser(session?.user ?? null);
    useAuthStore.getState().setSession(session ?? null);
    useAuthStore.getState().setLoading(false);
  }
});
