export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Header } from "@/components/header";
import { Container } from "@/components/ui/container";
import { getGame, getUserProfile } from "@/lib/api";
import { getUserQuests, listQuests } from "@/lib/api/quests";
import { QuestsList } from "./_components/quests-list";
import { Metadata } from "next";
import { Game } from "../games/[id]/_components/game";

export const metadata: Metadata = {
  title: "Quests | RNG Fan Club",
  description:
    "Complete exciting quests and challenges to earn points and win Super Bowl tickets. Track your progress and unlock achievements!",
  openGraph: {
    title: "Quests | RNG Fan Club",
    description:
      "Complete exciting quests and challenges to earn points and win Super Bowl tickets. Track your progress and unlock achievements!",
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
    title: "Quests | RNG Fan Club",
    description:
      "Complete exciting quests and challenges to earn points and win Super Bowl tickets. Track your progress and unlock achievements!",
    images: ["/images/rngfanclub-logo-white.png"],
  },
};

export default async function QuestsPage() {
  const quests = await listQuests();
  const gameId = 1;
  const initialGame = await getGame(1);

  // Find prediction quest for the game
  const predictionQuest = quests.find((q) => {
    if (q.verificationType !== "prediction") return false;
    const verificationData = q.verificationData as {
      game_id?: number;
    };
    return verificationData?.game_id === gameId;
  });
  const [profile, completedQuests] = await Promise.all([
    getUserProfile(),
    getUserQuests(),
  ]);

  return (
    <>
      <Header profile={profile} />
      <Container>
        {/*game predictions*/}
        <Game
          gameId={gameId}
          initialGame={initialGame}
          predictionQuest={predictionQuest || undefined}
        />
        {/* Quests List */}
        <QuestsList quests={quests} completedQuests={completedQuests} />
      </Container>
    </>
  );
}
