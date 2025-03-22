// import { create } from "zustand";
// import { supabase } from "@/lib/supabaseClient";

// export interface Team {
//   id?: string; // UUID as a string
//   team_name: string;
//   password: string;
//   email: string;
//   refresh_token?: string | null;
//   current_question_id?: number; // Random 4-digit number
//   questions_solved?: number;
//   has_submitted?: boolean;
//   session_count?: number;
// }

// interface TeamStore {
//   teams: Team[];
//   fetchTeams: () => Promise<void>;
// }

// export const useTeamStore = create<TeamStore>((set) => ({
//   teams: [],
//   fetchTeams: async () => {
//     const { data, error } = await supabase.from("teams").select("*");

//     console.log("teams",data)
//     if (error) {
//       console.error("Error fetching teams:", error);
//       return;
//     }
//     set({ teams: data });
//   },
// }));
