import { getGame } from "@/lib/api/games";
import { Game } from "./_components/game";

export default async function GamePage({ params }: { params: { id: string } }) {
  const gameId = parseInt(params.id);
  const initialGame = await getGame(gameId);

  return <Game gameId={gameId} initialGame={initialGame} />;
}
