"use client";

import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { getAllTimeLeaderboard } from "@/lib/api/leaderboard";
import { LeaderboardRankingResponse } from "@renegade-fanclub/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

export function Leaderboard() {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => getAllTimeLeaderboard(1, 10),
  });

  if (isLoading) {
    return (
      <div className="grid">
        {[...Array(5)].map((_, i) => (
          <Card
            key={i}
            className="p-4 flex items-center gap-4 animate-pulse duration-1000"
          >
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
      <Card className="relative flex justify-center gap-4 mt-44 p-0 sm:p-0 h-28 rounded-2xl">
        {[2, 1, 3].map((rank, i) => {
          const ranking = leaderboard.rankings.find((r) => r.rank === rank);
          if (!ranking) return null;

          const rankColors = {
            1: "yellow-500",
            2: "[#C0C0C0]",
            3: "[#CE8946]",
          };

          return (
            <div
              key={ranking.rank}
              className="flex items-end justify-center gap-4 w-full h-full"
            >
              <div
                className={`flex flex-col items-center justify-start ${ranking.rank === 1 ? "absolute bottom-0 w-36 md:w-44" : "w-28 md:w-36"} `}
              >
                <>
                  <div
                    className={`relative flex flex-col items-center ${ranking.rank === 1 ? "-mb-14" : "-mb-2 md:-mb-1"}`}
                  >
                    {ranking.rank === 1 ? (
                      <FontAwesomeIcon
                        icon={faCrown}
                        className="text-4xl text-yellow-500"
                      />
                    ) : null}
                    <Avatar
                      className={`border border-white/10 z-10 ${ranking.rank === 1 ? "h-24 w-24 md:h-28 md:w-28" : "h-20 w-20 md:h-24 md:w-24"}`}
                    >
                      <AvatarImage
                        src={ranking.avatar ?? undefined}
                        alt={ranking.username}
                      />
                      <AvatarFallback className="bg-[#2C183E] text-sm">
                        {ranking.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`bg-${rankColors[ranking.rank as 1 | 2 | 3]} h-5 w-5 md:w-6 md:h-6 md:-mt-4 -mt-3 z-10 rotate-45 rounded-md flex items-center justify-center border border-white/20`}
                    >
                      <p className="-rotate-45 text-xs text-white">
                        {ranking.rank}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex flex-col items-center justify-center m-0 w-full  ${ranking.rank === 1 ? "pt-14 rounded-[2.5rem] rounded-b-none h-40 md:h-48 bg-[#5a4e66]" : "w-full h-20"} `}
                  >
                    <p
                      className={`font-medium ${ranking.rank === 1 ? "text-base md:text-lg" : "text-sm md:text-base"}`}
                    >
                      {ranking.username}
                    </p>
                    <span
                      className={`font-bold text-${rankColors[ranking.rank as 1 | 2 | 3]} text-lg md:text-xl`}
                    >
                      {ranking.totalPoints}
                    </span>
                  </div>
                </>
              </div>
            </div>
          );
        })}
      </Card>

      {leaderboard.rankings
        .slice(3)
        .map((ranking: LeaderboardRankingResponse) => (
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
