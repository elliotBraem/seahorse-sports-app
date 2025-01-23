export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "Leaderboard | RNG Fan Club",
  description:
    "See the top fans competing for Super Bowl tickets. Track points from predictions and completed quests.",
  openGraph: {
    title: "Leaderboard | RNG Fan Club",
    description:
      "See the top fans competing for Super Bowl tickets. Track points from predictions and completed quests.",
    images: [
      {
        url: "/images/rngfanclub-logo-white.png",
        width: 1200,
        height: 630,
        alt: "RNG Fan Club Logo",
      },
    ],
  },
  twitter: {
    title: "Leaderboard | RNG Fan Club",
    description:
      "See the top fans competing for Super Bowl tickets. Track points from predictions and completed quests.",
    images: ["/images/rngfanclub-logo-white.png"],
  },
};

import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { getAllTimeLeaderboard } from "@/lib/api/leaderboard";
import { LeaderboardRankingResponse } from "@renegade-fanclub/types";

export default async function LeaderboardPage() {
  const leaderboard = await getAllTimeLeaderboard(1, 10);

  return (
    <Container
      title="Leaderboard"
      description="Top fans competing for Super Bowl tickets"
    >
      <div className="grid grid-cols-1 gap-4">
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
    </Container>
  );
}
