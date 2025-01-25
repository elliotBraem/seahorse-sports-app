export const dynamic = "force-dynamic";

import { Header } from "@/components/header";
import { Container } from "@/components/ui/container";
import { Metadata } from "next";
import { Leaderboard } from "./_components/leaderboard";

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

export default function LeaderboardPage() {
  return (
    <>
      <Header />
      <Container>
        <div className="px-2 pb-20">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Leaderboard</h1>
            <p className="text-white/60 text-sm sm:text-base">
              Top fans competing for Super Bowl tickets
            </p>
          </div>
          <Leaderboard />
        </div>
      </Container>
    </>
  );
}
