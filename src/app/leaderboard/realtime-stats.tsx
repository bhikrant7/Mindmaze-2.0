"use client";

import {
  Table,
  TableBody,
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
          setStats((prevStats) => {
            let updatedStats;

            if (payload.eventType === "INSERT") {
              updatedStats = [...prevStats, payload.new as Leaderboard];
            } else if (payload.eventType === "UPDATE") {
              updatedStats = prevStats.map((item) =>
                item.team_id === payload.new.team_id
                  ? { ...item, ...payload.new }
                  : item
              );
            } else {
              updatedStats = prevStats;
            }

            // Ensure the leaderboard is always sorted by rank
            return updatedStats.sort(
              (a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity)
            );
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  // Create a mapping of team_id to team_name
  // const teamMap = teams.reduce((acc, team) => {
  //   acc[team.id!] = team.team_name; // Ensure id exists before using
  //   return acc;
  // }, {} as Record<string, string>);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[url('/background.svg')] bg-auto bg-center bg-no-repeat">
      <h1 className="press-start-2p-regular sm:text-5xl md:text-5xl lg:text-7xl font-bold text-white mt-10">
        Leaderboard
      </h1>
      <div className="w-full max-w-5xl p-10 my-10 space-y-4 bg-gray/10 rounded-2xl shadow-lg shadow-black/90 backdrop-blur-[5.1px] border">
        <Table>
          <TableHeader>
            <TableRow className="uppercase text-4xl font-extrabold">
              <TableHead className="text-[#FFD700] text-center px-4 py-2">
                Rank
              </TableHead>
              <TableHead className="text-center text-[#00FFFF] px-4 py-2">
                Team
              </TableHead>
              <TableHead className="text-center text-[#7FFF00] py-2">
                Solved
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((data, index) => (
              <TableRow key={data.team_id}>
                <TableCell className="text-lg text-[#FFD700] text-center px-4 py-4">
                  {index + 1}
                </TableCell>
                <TableCell className="text-lg text-[#00FFFF] text-center px-4 py-2">
                  {data.team_name || "Unknown Team"}
                </TableCell>
                <TableCell className="text-lg text-[#7FFF00] text-center px-2 py-2">
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
