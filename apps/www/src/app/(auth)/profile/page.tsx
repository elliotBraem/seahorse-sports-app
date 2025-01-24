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
import { Container } from "@/components/ui/container";
// import { CopyLink } from "@/components/ui/copy-link";
import { getUserQuests } from "@/lib/api/quests";
import { getUserPredictions, getUserProfile } from "@/lib/api/user";
import { cn } from "@/lib/utils";
import { Settings, Trophy } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Header } from "@/components/header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default async function ProfilePage() {
  const [profile, completedQuests, predictions] = await Promise.all([
    getUserProfile(),
    getUserQuests(),
    getUserPredictions(),
  ]);

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
            <Settings className="h-6 w-6" />
          </Link>
        }
      />
      <Container>
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
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">{totalPoints}</span>
          </div>
        </div>

        <Card>
          <CardHeader className="px-2 py-4">
            <CardTitle>Predictions</CardTitle>
          </CardHeader>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full max-w-[90%]"
          >
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="basis-1/3 lg:basis-1/5">
                  <div className="p-1">
                    <Card className="aspect-square p-0 w-full">
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-3xl font-semibold">
                          {index + 1}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext className=" h-12 w-12 text-xl border-none m-0 text-white" />
          </Carousel>
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
                    <Trophy className="h-4 w-4 text-yellow-500" />
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
      </Container>
    </>
  );
}
