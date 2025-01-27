export const dynamic = "force-dynamic";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { createUserProfile, getUserProfile } from "@/lib/api";
import { getUserQuests, listQuests } from "@/lib/api/quests";
import { getCurrentUserInfo } from "@/lib/auth";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Metadata } from "next";
import Link from "next/link";

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
        <div className="grid px-2">
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
              <Card key={quest.id} className="w-full overflow-hidden">
                <CardHeader className="flex flex-row items-start justify-between p-4 sm:p-6">
                  <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0 pr-4">
                    <CardTitle className="text-lg sm:text-xl leading-tight">
                      {quest.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 sm:line-clamp-none">
                      {quest.description}
                    </CardDescription>
                  </div>

                  <div
                    title={`You will earn ${quest.pointsValue} points for completing this quest`}
                    className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full shrink-0"
                  >
                    <FontAwesomeIcon
                      icon={faTrophy}
                      className="h-4 w-4 text-yellow-500"
                    />
                    <span className="font-medium">{quest.pointsValue}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-end">
                    {/* Quest-specific actions */}
                    {quest.verificationType === "social_follow" &&
                      verificationData.platform === "twitter" && (
                        <Button asChild>
                          <a
                            href={verificationData.intent_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto"
                          >
                            Follow on Twitter
                          </a>
                        </Button>
                      )}

                    {quest.verificationType === "prediction" &&
                      verificationData.game_link && (
                        <Button asChild>
                          <Link
                            href={verificationData.game_link}
                            className="w-full sm:w-auto"
                          >
                            Make Prediction
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
