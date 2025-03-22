"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Leaderboard } from "@/lib/types";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
// import { useTeamStore } from "@/lib/store/teamStore";

// const rank = [
//   { Rankings: 1, Name: "Alice Smith", Score: 98 },
//   { Rankings: 2, Name: "Bob Johnson", Score: 95 },
//   { Rankings: 3, Name: "Charlie Brown", Score: 92 },
//   { Rankings: 4, Name: "David Lee", Score: 90 },
//   { Rankings: 5, Name: "Eve Wilson", Score: 88 },
//   { Rankings: 6, Name: "Frank Garcia", Score: 85 },
//   { Rankings: 7, Name: "Grace Rodriguez", Score: 82 },
//   { Rankings: 8, Name: "Henry Martinez", Score: 80 },
//   { Rankings: 9, Name: "Isabella Anderson", Score: 78 },
//   { Rankings: 10, Name: "Jack Thomas", Score: 75 },
//   { Rankings: 11, Name: "Katie Jackson", Score: 72 },
//   { Rankings: 12, Name: "Liam White", Score: 70 },
//   { Rankings: 13, Name: "Mia Harris", Score: 68 },
//   { Rankings: 14, Name: "Noah Martin", Score: 65 },
//   { Rankings: 15, Name: "Olivia Thompson", Score: 62 },
// ];

export default function LeaderBoardPage({
  serverStats,
}: {
  serverStats: Leaderboard[];
}) {
  const [stats, setStats] = useState<Leaderboard[]>(serverStats); // Use the serverStats as the initial state
  // const { teams, fetchTeams } = useTeamStore();

  useEffect(() => {
    //teams fetch first nigga
    // fetchTeams();

    const channel = supabase
      .channel("realtime_stats")
      .on(
        "postgres_changes",
        {
          event: "*", //all event
          schema: "public",
          table: "leaderboard",
        },
        (payload) => {
          // update if insert in lead
          if (payload.eventType === "INSERT") {
            setStats((prevStats) => [...prevStats, payload.new as Leaderboard]);
          } else if (payload.eventType === "UPDATE") {
            //agor id milai update
            setStats((prevStats) =>
              prevStats.map((item) =>
                item.team_id === payload.new.team_id
                  ? { ...item, ...payload.new }
                  : item
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
  // Create a mapping of team_id to team_name
  // const teamMap = teams.reduce((acc, team) => {
  //   acc[team.id!] = team.team_name; // Ensure id exists before using
  //   return acc;
  // }, {} as Record<string, string>);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[url('/background.svg')] bg-fixed bg-auto bg-center bg-no-repeat">
      <h1 className="press-start-2p-regular sm:text-5xl md:text-5xl lg:text-7xl font-bold text-white mt-10">
        Leaderboard
      </h1>
      <div className="w-full max-w-2xl p-10 my-10 space-y-4 bg-gray/10 rounded-2xl shadow-lg shadow-black/90 backdrop-blur-[5.1px] border">
        <Table>
          <TableCaption className="text-sm italic">
            {stats.length} participating teams
          </TableCaption>
          <TableHeader>
            <TableRow className="uppercase text-lg font-extrabold">
              <TableHead className="w-[120px] text-[#FFA500] text-center">
                Rank
              </TableHead>
              <TableHead className="text-center text-[#00FFFF]">Name</TableHead>
              <TableHead className="text-center text-[#7FFF00]">
                Score
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((data) => (
              <TableRow key={data.team_id}>
                <TableCell className="font-medium text-[#FFA500] text-center">
                  {data.rank}
                </TableCell>
                <TableCell className="text-[#00FFFF] text-center">
                  {data.team_name || "Unknown Team"} {/* Match team_name */}
                </TableCell>
                <TableCell className="text-[#7FFF00] text-right">
                  {data.total_score}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
