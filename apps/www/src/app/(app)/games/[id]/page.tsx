import { getGame } from "@/lib/api/games";
import { Game } from "./_components/game";
import { Header } from "@/components/header";
import { getUserProfile, getUserQuests } from "@/lib/api";
import { listQuests } from "@/lib/api/quests";

export default async function GamePage({ params }: { params: { id: string } }) {
  const gameId = parseInt(params.id);
  const initialGame = await getGame(gameId);

  const [profile, completedQuests, quests] = await Promise.all([
    getUserProfile(),
    getUserQuests(),
    listQuests(),
  ]);

  // Find prediction quest for the game
  const predictionQuest = quests.find(q => {
    if (q.verificationType !== "prediction") return false;
    const verificationData = q.verificationData as {
      game_id?: number;
    };
    return verificationData?.game_id === gameId;
  });

  const totalPoints = completedQuests.reduce(
    (sum, quest) => sum + quest.pointsEarned,
    0,
  );

  return (
    <>
      <Header profile={profile} totalPoints={totalPoints} />
      <div className="-mt-24 relative z-10 m-4">
        <Game 
          gameId={gameId} 
          initialGame={initialGame} 
          predictionQuest={predictionQuest || undefined}
        />
      </div>
    </>
  );
}
