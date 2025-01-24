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
      <div className="grid grid-cols-1 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card
            key={i}
            className="flex items-center space-x-4 rounded-lg shadow-sm animate-pulse"
          >
            <div className="h-8 w-8 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!leaderboard) return null;

  return (
    <div className="grid grid-cols-1">
      {leaderboard.rankings.map((ranking: LeaderboardRankingResponse) => (
        <Card
          key={ranking.userId}
          className="flex items-center space-x-4 rounded-lg shadow-sm"
        >
          <span className="min-w-[2rem] text-2xl font-bold">
            {ranking.rank}
          </span>
          <Avatar>
            <AvatarImage
              src={ranking.avatar ?? undefined}
              alt={ranking.username}
            />
            <AvatarFallback>{ranking.username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">{ranking.username}</p>
            <p className="text-sm text-muted-foreground">
              {ranking.totalPoints} points
            </p>
            <p className="text-xs text-muted-foreground">
              Predictions: {ranking.predictionPoints} · Quests:{" "}
              {ranking.questPoints}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
