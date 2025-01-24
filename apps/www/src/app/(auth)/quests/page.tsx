export const dynamic = "force-dynamic";

import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { listQuests } from "@/lib/api/quests";
import Link from "next/link";
import { Header } from "@/components/header";
import { Trophy } from "lucide-react";

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
      <Container
        title="Quests"
        description="Complete quests to win Super Bowl tickets!"
      >
        <div className="grid gap-6 w-full">
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
              <Link key={quest.id} href={`/quests/${quest.id}`}>
                <Card key={quest.id}>
                  <CardHeader>
                    <CardTitle>{quest.name}</CardTitle>
                    <CardDescription>{quest.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm font-medium">
                          {quest.pointsValue} points
                        </span>
                      </div>

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
                          <Button variant="outline" asChild>
                            <Link
                              href={verificationData.game_link}
                              className="w-full sm:w-auto"
                            >
                              Make Prediction
                            </Link>
                          </Button>
                        )}
                    </div>

                    <div className="mt-4 text-sm text-muted-foreground">
                      Available until{" "}
                      {new Date(quest.endDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </>
  );
}
