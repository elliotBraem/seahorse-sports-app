import { GamesList } from "./_components/games-list";
import { Header } from "@/components/header";
import { Container } from "@/components/ui/container";

export default async function GamesPage() {
  return (
    <>
      <Header />
      <Container className="m-4">
        <GamesList />
      </Container>
    </>
  );
}
