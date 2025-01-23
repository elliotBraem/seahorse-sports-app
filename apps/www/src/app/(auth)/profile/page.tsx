import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { CopyLink } from "@/components/ui/copy-link";
import { getUserProfile } from "@/lib/api/user";
import { getUserQuests } from "@/lib/api/quests";
import { cn } from "@/lib/utils";
import { Settings, Trophy } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function ProfilePage() {
  const [profile, completedQuests] = await Promise.all([
    getUserProfile(),
    getUserQuests(),
  ]);

  const origin = headers().get("origin") || "";
  const totalPoints = completedQuests.reduce(
    (sum, quest) => sum + quest.pointsEarned,
    0,
  );

  return (
    <Container title="Profile" description="Review your account details">
      <Card>
        <CardHeader className="flex flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={profile.avatar ?? undefined}
                alt={profile.username}
              />
              <AvatarFallback>{profile.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]">
                {profile.username}
              </CardTitle>
              <CardDescription className="overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]">
                {profile.email}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-end space-x-4">
            <Link
              href="/settings"
              className={cn("text-xs text-muted-foreground hover:text-primary")}
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">{totalPoints} points</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
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

      <CopyLink
        title="Refer a Friend"
        description="Earn points for referring friends. Achieved when your referral completes the quest"
        link={`${origin}/refer/${profile.id}`}
      />
    </Container>
  );
}
