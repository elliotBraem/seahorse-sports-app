export const dynamic = "force-dynamic";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile | RNG Fan Club",
  description:
    "View your achievements, points earned, and progress towards Super Bowl tickets. Track your completed quests and refer friends to earn more points.",
  openGraph: {
    title: "My Profile | RNG Fan Club",
    description:
      "View your achievements, points earned, and progress towards Super Bowl tickets. Track your completed quests and refer friends to earn more points.",
    images: [
      {
        url: "/images/rngfanclub-logo-white.png",
        width: 1200,
        height: 630,
        alt: "RNG Fan Club Logo",
      },
    ],
  },
  twitter: {
    title: "My Profile | RNG Fan Club",
    description:
      "View your achievements, points earned, and progress towards Super Bowl tickets. Track your completed quests and refer friends to earn more points.",
    images: ["/images/rngfanclub-logo-white.png"],
  },
};

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserQuests } from "@/lib/api/quests";
import { getUserPredictions, getUserProfile } from "@/lib/api/user";
import { listTeams } from "@/lib/api/teams";
import { listGames } from "@/lib/api/games";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";
import Link from "next/link";
import { Header } from "@/components/header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faClock,
  faCog,
  faCopy,
  faTrophy,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { CopyLink } from "@/components/ui/copy-link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default async function ProfilePage() {
  const [profile, completedQuests, predictions, teams, games] =
    await Promise.all([
      getUserProfile(),
      getUserQuests(),
      getUserPredictions(),
      listTeams(),
      listGames(),
    ]);

  // Create maps for team names and game details
  const teamMap = new Map(teams.map((team) => [team.id, team.name]));
  const gameMap = new Map(games.map((game) => [game.id, game]));

  const origin = headers().get("origin") || "";
  const totalPoints = completedQuests.reduce(
    (sum, quest) => sum + quest.pointsEarned,
    0,
  );

  return (
    <>
      <Header
        showBackButton={true}
        rightChildren={
          <Link
            href="/settings"
            className="bg-none rounded-full border-none p-0 h-9 w-9 hover:bg-none"
          >
            <FontAwesomeIcon icon={faCog} className="h-6 w-6" />
          </Link>
        }
      />
      <Container>
        <div className="px-2 pb-20 space-y-6">
          <div className="flex flex-col items-center space-y-4 py-4">
            <Avatar className="h-20 w-20 border-2 border-white/10">
              <AvatarImage
                src={profile.avatar ?? undefined}
                alt={profile.username}
              />
              <AvatarFallback className="bg-white/5 text-lg">
                {profile.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center">
              <p className="font-semibold tracking-tight text-2xl overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]">
                {profile.username}
              </p>
              <p className="text-sm text-white/60 overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]">
                {profile.email}
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full">
              <FontAwesomeIcon
                icon={faTrophy}
                className="h-4 w-4 text-yellow-500"
              />
              <span className="font-medium">{totalPoints}</span>
            </div>
          </div>

          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Predictions</CardTitle>
            </CardHeader>
            {predictions.length > 0 ? (
              <CardContent className="p-0">
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 sm:-ml-4">
                    {predictions.map((prediction) => (
                      <CarouselItem
                        key={prediction.id}
                        className="pl-2 sm:pl-4 basis-[280px]"
                      >
                        <Card className="overflow-hidden">
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-3">
                            <div
                              className={cn(
                                "mb-2 text-sm font-medium flex items-center gap-1",
                                prediction.pointsEarned === null
                                  ? "text-yellow-500" // Pending
                                  : prediction.pointsEarned > 0
                                    ? "text-green-500" // Won
                                    : "text-red-500", // Lost
                              )}
                            >
                              {prediction.pointsEarned === null ? (
                                <>
                                  <FontAwesomeIcon
                                    icon={faClock}
                                    className="h-4 w-4"
                                  />
                                  <span>Pending</span>
                                </>
                              ) : prediction.pointsEarned > 0 ? (
                                <>
                                  <FontAwesomeIcon
                                    icon={faCheck}
                                    className="h-4 w-4"
                                  />
                                  <span>+{prediction.pointsEarned}</span>
                                </>
                              ) : (
                                <>
                                  <FontAwesomeIcon
                                    icon={faX}
                                    className="h-4 w-4"
                                  />
                                  <span>0</span>
                                </>
                              )}
                            </div>
                            <div className="text-xs space-y-1">
                              <div className="font-semibold text-sm">
                                {teamMap.get(prediction.predictedWinnerId) ||
                                  "Unknown Team"}
                              </div>
                              {gameMap.get(prediction.gameId) && (
                                <>
                                  <div className="text-white/60">
                                    {gameMap.get(prediction.gameId)?.gameType ||
                                      "Game"}
                                  </div>
                                  <div className="text-white/60">
                                    {new Date(
                                      gameMap.get(prediction.gameId)
                                        ?.startTime || "",
                                    ).toLocaleDateString()}
                                  </div>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {/* <CarouselNext className="h-12 w-12 text-xl border-none m-0 text-white" /> */}
                </Carousel>
              </CardContent>
            ) : (
              <div className="flex flex-col items-start py-4 px-4 sm:px-6 gap-4">
                <p className="text-white/60">No predictions yet</p>
                <Link href="/games">
                  <Button variant="outline">Make Predictions</Button>
                </Link>
              </div>
            )}
          </Card>

          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Quest Completions</CardTitle>
              <CardDescription className="text-white/60">
                Your progress towards Super Bowl tickets
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-4">
                {completedQuests.length === 0 ? (
                  <p className="text-white/60">
                    Complete quests to earn achievements!
                  </p>
                ) : (
                  completedQuests.map((quest) => (
                    <div
                      key={quest.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <FontAwesomeIcon
                          icon={faTrophy}
                          className="h-4 w-4 text-yellow-500"
                        />
                        <span className="text-sm">{quest.questName}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full">
                        <span className="text-sm font-medium">
                          +{quest.pointsEarned}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </>
  );
}
