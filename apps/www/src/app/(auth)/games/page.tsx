import { Container } from "@/components/ui/container";
import { GamesList } from "./_components/games-list";

export default async function GamesPage() {
  return (
    <Container>
      <div className="py-8">
        <h1 className="text-2xl font-bold mb-6">Current Games</h1>
        <GamesList />
      </div>
    </Container>
  );
}
