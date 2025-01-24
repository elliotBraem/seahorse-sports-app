import { Container } from "@/components/ui/container";
import { GamesList } from "./_components/games-list";
import { Header } from "@/components/header";

export default async function GamesPage() {
  return (
    <>
      <Header />
      <Container>
        <div className="py-8">
          <h1 className="text-2xl font-bold mb-6">Current Games</h1>
          <GamesList />
        </div>
      </Container>
    </>
  );
}
