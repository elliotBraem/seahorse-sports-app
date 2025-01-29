export const dynamic = "force-dynamic";

import { Header } from "@/components/header";
import { Container } from "@/components/ui/container";
import { Metadata } from "next";
import { Leaderboard } from "./_components/leaderboard";
import { getUserProfile, getUserQuests } from "@/lib/api";

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

export default async function LeaderboardPage() {
  const [profile, completedQuests] = await Promise.all([
    getUserProfile(),
    getUserQuests(),
  ]);

  const totalPoints = completedQuests.reduce(
    (sum, quest) => sum + quest.pointsEarned,
    0,
  );
  return (
    <>
      <Header profile={profile} totalPoints={totalPoints} />
      <Container>
        <div className="px-2 pb-20">
          <div className="mb-8 flex items-center flex-col gap-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold">Leaderboard</h1>
            <p className="text-white text-sm sm:text-base">
              Top fans competing for Super Bowl tickets
            </p>
          </div>
          <Leaderboard />
        </div>
      </Container>
    </>
  );
}
