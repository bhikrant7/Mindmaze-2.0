"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { supabase } from "@/lib/supabaseClient";

const AuthInitializer = () => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, [setLoading, setUser]);

  return null;
};

export default AuthInitializer;
