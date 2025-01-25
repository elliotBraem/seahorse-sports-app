import { GamesList } from "./_components/games-list";
import { Header } from "@/components/header";
import { Container } from "@/components/ui/container";

export default async function GamesPage() {
  return (
    <>
      <Header />
      <Container>
        <div className="px-2 pb-20">
          <GamesList />
        </div>
      </Container>
    </>
  );
}
