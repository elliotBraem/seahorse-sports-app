"use client";

import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { getAllTimeLeaderboard } from "@/lib/api/leaderboard";
import { LeaderboardRankingResponse } from "@renegade-fanclub/types";

export function Leaderboard() {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => getAllTimeLeaderboard(1, 10),
  });

  if (isLoading) {
    return (
      <div className="grid">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4 flex items-center gap-4 animate-pulse">
            <div className="flex items-center justify-center w-8 h-8">
              <div className="h-6 w-4 bg-white/10 rounded" />
            </div>
            <div className="h-10 w-10 rounded-full bg-white/10" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4">
                <div className="h-4 w-24 bg-white/10 rounded" />
                <div className="h-6 w-16 bg-white/10 rounded-full shrink-0" />
              </div>
              <div className="h-3 w-32 bg-white/10 rounded mt-2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!leaderboard) return null;

  return (
    <div className="grid">
      {leaderboard.rankings.map((ranking: LeaderboardRankingResponse) => (
        <Card
          key={ranking.userId}
          className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-all duration-200"
        >
          <span className="flex items-center justify-center w-8 h-8 text-xl font-bold">
            {ranking.rank}
          </span>
          <Avatar className="h-10 w-10 border border-white/10">
            <AvatarImage
              src={ranking.avatar ?? undefined}
              alt={ranking.username}
            />
            <AvatarFallback className="bg-white/5 text-sm">
              {ranking.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <p className="font-medium truncate">{ranking.username}</p>
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full shrink-0">
                <span className="font-medium text-sm">
                  {ranking.totalPoints}
                </span>
              </div>
            </div>
            <p className="text-xs text-white/60 mt-1">
              Predictions: {ranking.predictionPoints} · Quests:{" "}
              {ranking.questPoints}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
