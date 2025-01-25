export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Leaderboard } from "./_components/leaderboard";
import { Header } from "@/components/header";

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
      <Container
        title="Leaderboard"
        description="Top fans competing for Super Bowl tickets"
      >
        <Leaderboard />
      </Container>
    </>
  );
}
