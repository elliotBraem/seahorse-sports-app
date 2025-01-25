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
  console.log(predictions);

  return (
    <>
      <Header
        rightChildren={
          <Link
            href="/settings"
            className="bg-none rounded-full border-none p-0 h-9 w-9 hover:bg-none"
          >
            <FontAwesomeIcon icon={faCog} className="h-6 w-6" />
          </Link>
        }
      />
      <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={profile.avatar ?? undefined}
              alt={profile.username}
            />
            <AvatarFallback>{profile.username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center">
            <p className="font-semibold tracking-tight text-2xl overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]">
              {profile.username}
            </p>
            <p className="text-sm text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]">
              {profile.email}
            </p>
          </div>
          <div className="flex items-center space-x-4 bg-white/20 px-4 p-2 rounded-full">
            <FontAwesomeIcon
              icon={faTrophy}
              className="h-5 w-5 text-yellow-500"
            />
            <span className="font-medium">{totalPoints}</span>
          </div>
        </div>

        <Card>
          <CardHeader className="px-2 py-4">
            <CardTitle>Predictions</CardTitle>
          </CardHeader>
          {predictions.length > 0 ? (
            <p>
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full max-w-[90%]"
              >
                <CarouselContent>
                  {predictions.map((prediction) => (
                    <CarouselItem
                      key={prediction.id}
                      className="basis-1/2 lg:basis-1/4"
                    >
                      <div className="p-1">
                        <Card className="aspect-square p-0 w-full">
                          <CardContent className="flex aspect-square flex-col items-center justify-center p-4 text-center">
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
                                  <div className="text-[10px] text-muted-foreground">
                                    {gameMap.get(prediction.gameId)?.gameType ||
                                      "Game"}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground">
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
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselNext className=" h-12 w-12 text-xl border-none m-0 text-white" />
              </Carousel>
            </p>
          ) : (
            <div className="flex flex-col items-start py-4 px-2 gap-4">
              <p className="text-md">No predictions yet</p>
              <Link href={"/games"}>
                <Button variant={"outline"} className="">
                  Make Predictions
                </Button>
              </Link>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quest Completions</CardTitle>
            <CardDescription>
              Your progress towards Super Bowl tickets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedQuests.length === 0 ? (
                <p className="text-muted-foreground">
                  Complete quests to earn achievements!
                </p>
              ) : (
                completedQuests.map((quest) => (
                  <div key={quest.id} className="flex items-center space-x-2">
                    <FontAwesomeIcon
                      icon={faTrophy}
                      className="h-4 w-4 text-yellow-500"
                    />
                    <span>{quest.questName}</span>
                    <span className="text-sm text-muted-foreground">
                      +{quest.pointsEarned} points
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        {/* <CopyLink
          title="Refer a Friend"
          description="Earn points for referring friends. Achieved when your referral completes the quest"
          link={`${origin}/refer/${profile.id}`}
        /> */}
    </>
  );
}
