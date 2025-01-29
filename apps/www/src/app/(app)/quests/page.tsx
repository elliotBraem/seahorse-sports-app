export const dynamic = "force-dynamic";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { getGame, getUserProfile } from "@/lib/api";
import { getUserQuests, listQuests } from "@/lib/api/quests";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faFootball, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Metadata } from "next";
import Link from "next/link";
import { Game } from "../games/[id]/_components/game";

export const metadata: Metadata = {
  title: "Quests | RNG Fan Club",
  description:
    "Complete exciting quests and challenges to earn points and win Super Bowl tickets. Track your progress and unlock achievements!",
  openGraph: {
    title: "Quests | RNG Fan Club",
    description:
      "Complete exciting quests and challenges to earn points and win Super Bowl tickets. Track your progress and unlock achievements!",
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
    title: "Quests | RNG Fan Club",
    description:
      "Complete exciting quests and challenges to earn points and win Super Bowl tickets. Track your progress and unlock achievements!",
    images: ["/images/rngfanclub-logo-white.png"],
  },
};

export default async function QuestsPage() {
  const quests = await listQuests();
  const gameId = 1;
  const initialGame = await getGame(1);

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
        {/*game pridictions*/}
        <Game gameId={gameId} initialGame={initialGame} />
        {/* Quests List */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {quests.map((quest) => {
            const verificationData = quest.verificationData as {
              platform?: string;
              action?: string;
              intent_url?: string;
              game_id?: number;
              game_link?: string;
              game_type?: string;
            };

            return (
              <Card
                key={quest.id}
                className="w-full overflow-hidden px-5 pt-6 pb-4 md:px-5 md:pb-2 md:pt-6 flex flex-col justify-between"
              >
                <div className="flex flex-col items-start justify-start gap-2 flex-grow">
                  <div
                    title={`You will earn ${quest.pointsValue} points for completing this quest`}
                    className="flex items-center space-x-1"
                  >
                    <FontAwesomeIcon
                      icon={faTrophy}
                      className="h-5 w-5 text-yellow-500"
                    />
                    <span className="font-medium text-lg">
                      {quest.pointsValue}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:gap-2 pt-2">
                    <CardTitle className="text-white/70 text-xs sm:text-sm leading-tight font-thin">
                      {quest.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-white/70 sm:text-sm leading-tight font-thin line-clamp-2 sm:line-clamp-none">
                      {quest.description}
                    </CardDescription>
                  </div>
                </div>

                <CardContent className="pt-4">
                  <div className="flex flex-col">
                    {/* Quest-specific actions */}
                    {quest.verificationType === "social_follow" &&
                      verificationData.platform === "twitter" && (
                        <a
                          href={verificationData.intent_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-2 h-9 w-28 text-sm px-5 py-2 bg-white rounded-full text-purple-900 mt-auto"
                        >
                          <FontAwesomeIcon icon={faXTwitter} />
                          <span>Follow</span>
                        </a>
                      )}

                    {quest.verificationType === "prediction" &&
                      verificationData.game_link && (
                        <Button
                          asChild
                          className="flex items-center space-x-1 text-sm px-5 py-2 h-9 w-28 mt-auto"
                        >
                          <Link
                            href={verificationData.game_link}
                            className="w-full sm:w-auto"
                          >
                            <FontAwesomeIcon icon={faFootball} />
                            <span>Predict</span>
                          </Link>
                        </Button>
                      )}
                  </div>

                  {/* <div className="mt-4 text-sm text-white/70">
                    Available until{" "}
                    {new Date(quest.endDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div> */}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </>
  );
}
