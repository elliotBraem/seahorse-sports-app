"use client";

import { Header } from "@/components/header";
import { Container } from "@/components/ui/container";
import { getUserProfile, getUserQuests } from "@/lib/api";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default async function ShopPage() {
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
          <div className="mb-8 flex items-center flex-col gap-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold">Shop</h1>
            <p className="text-white text-sm sm:text-base">
              Shop for Super Bowl tickets
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          <p className="text-white/60 text-sm sm:text-base">Coming soon...</p>
        </div>
      </Container>
    </>
  );
}
