"use client";

import { useState, useEffect, useRef } from "react";
import { Fireworks } from "fireworks-js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabaseClient";
import { LeaderboardEntry } from "./Leaderboard";

export default function LeaderBoardPage({
  serverStats,
}: {
  serverStats: LeaderboardEntry[];
}) {
  const [stats, setStats] = useState<LeaderboardEntry[]>(serverStats);
  const fireworksRef = useRef<HTMLDivElement>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const teamsWithFireworks = useRef<Set<number>>(new Set()); // Track teams that triggered fireworks

  useEffect(() => {
    const channel = supabase
      .channel("realtime_stats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leaderboard",
        },
        (payload) => {
          setStats((prevStats) => {
            let updatedStats;

            if (payload.eventType === "INSERT") {
              updatedStats = [...prevStats, payload.new as LeaderboardEntry];
            } else if (payload.eventType === "UPDATE") {
              updatedStats = prevStats.map((item) =>
                item.team_id === payload.new.team_id
                  ? { ...item, ...payload.new }
                  : item
              );
            } else {
              updatedStats = prevStats;
            }

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

  useEffect(() => {
    // Check if any team has just reached 15 solved problems
    const teamJustReached15 = stats.find(
      (team) => {
        const totalScore = typeof team.total_score === "number" ? team.total_score : 0; // Default to 0 if empty
        return totalScore >= 15 && !teamsWithFireworks.current.has(team.team_id);
      }
    );

    if (teamJustReached15) {
      teamsWithFireworks.current.add(teamJustReached15.team_id);
      setShowFireworks(true);

      if (fireworksRef.current) {
        const fireworks = new Fireworks(fireworksRef.current, {
          acceleration: 1.05,
          friction: 0.98,
          particles: 100,
        });

        fireworks.start();

        setTimeout(() => {
          fireworks.stop();
          setShowFireworks(false);
        }, 20000); // Stop fireworks after 20 seconds
      }
    }
  }, [stats]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[url('/background.svg')] bg-cover bg-no-repeat">
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
            {stats.map((data, index) => {
              const totalScore = typeof data.total_score === "number" ? data.total_score : 0;
              const isChampion = totalScore >= 15;
              return (
                <TableRow
                  key={data.team_id}
                  className={isChampion ? "border-2 border-[#FFD700] text-black animate-pulse" : ""}
                >
                  <TableCell className="text-lg text-[#FFD700] text-center px-4 py-4">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-lg text-[#00FFFF] text-center px-4 py-2">
                    {data.team_name || "Unknown Team"}
                  </TableCell>
                  <TableCell className="text-lg text-[#7FFF00] text-center px-2 py-2">
                    {totalScore}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Fireworks Container */}
      {showFireworks && <div ref={fireworksRef} className="absolute top-0 left-0 w-full h-full"></div>}

      {/* Congratulatory Message */}
      {stats.some((data) => {
        const totalScore = typeof data.total_score === "number" ? data.total_score : 0;
        return totalScore >= 15;
      }) && (
        <div className="mt-6 text-center text-2xl font-bold text-[#FFD700] animate-bounce">
          🎉 Congratulations! A team has solved all the Problems! 🎉
        </div>
      )}
    </div>
  );
}
