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
import { listQuests } from "@/lib/api/quests";
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

  return (
    <>
      <Header />
      <Container>
        <div className="grid w-full">
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
              <Card key={quest.id}>
                <CardHeader className="flex flex-col sm:flex-row gap-4 items-start justify-between">
                  <div className="flex flex-col gap-4">
                    <CardTitle>{quest.name}</CardTitle>
                    <CardDescription>{quest.description}</CardDescription>
                  </div>

                  <div
                    title={`You will earn ${quest.pointsValue} points for completing this quest`}
                    className="flex items-center space-x-4 bg-white/20 px-4 p-1 rounded-full"
                  >
                    <FontAwesomeIcon
                      icon={faTrophy}
                      className="h-4 w-4 text-yellow-500"
                    />
                    <span className="text-base font-medium">
                      {quest.pointsValue}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
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
