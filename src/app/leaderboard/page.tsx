import { supabase } from "@/lib/supabaseClient";
import LeaderBoardPage from "./realtime-stats";

export default async function Stats() {
  // const { data } = await supabase.from("leaderboard").select();
  const { data } = await supabase
  .from("leaderboard")
  .select()
  .order("rank", { ascending: true });
  return <LeaderBoardPage serverStats={data ?? []} />;
}
