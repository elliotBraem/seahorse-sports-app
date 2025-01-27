import { GamesList } from "./_components/games-list";
import { Header } from "@/components/header";
import { Container } from "@/components/ui/container";
import { getUserProfile, getUserQuests } from "@/lib/api";

export default async function GamesPage() {
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
      <Container>
        <div className="px-2 pb-20">
          <GamesList />
        </div>
      </Container>
    </>
  );
}
