import { Container } from "@/components/ui/container";
import { listGames } from "@/lib/api/games";
import { GamesList } from "./_components/games-list";

export default async function GamesPage() {
  const games = await listGames();

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-2xl font-bold mb-6">Current Games</h1>
        <GamesList games={games} />
      </div>
    </Container>
  );
}
