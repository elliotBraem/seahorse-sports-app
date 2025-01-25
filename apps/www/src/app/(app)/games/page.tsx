import { Container } from "@/components/ui/container";
import { GamesList } from "./_components/games-list";
import { Header } from "@/components/header";

export default async function GamesPage() {
  return (
    <>
      <Header />
      <Container>
        <GamesList />
      </Container>
    </>
  );
}
