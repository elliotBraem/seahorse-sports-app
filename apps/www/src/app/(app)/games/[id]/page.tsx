import { getGame } from "@/lib/api/games";
import { Game } from "./_components/game";
import { Header } from "@/components/header";
import { getUserProfile, getUserQuests } from "@/lib/api";

export default async function GamePage({ params }: { params: { id: string } }) {
  const gameId = parseInt(params.id);
  const initialGame = await getGame(gameId);

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
      <div className="-mt-24 relative z-10 m-4">
        <Game gameId={gameId} initialGame={initialGame} />
      </div>
    </>
  );
}
