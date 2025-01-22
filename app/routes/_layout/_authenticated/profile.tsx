import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuthStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings, Trophy } from "lucide-react";
import { CopyLink } from "@/components/ui/copy-link";
import { Container } from "@/components/ui/container";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_layout/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    setIsVisible(true);
  }, []);

  const user = useAuthStore((state) => state.user);
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  if (!user) return null;

  return (
    <Container
      title="Profile"
      description="Review your account details"
      isVisible={isVisible}
    >
      <Card>
        <CardHeader className="flex flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl ">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
          <div className="flex items-end space-x-4">
            <Link
              key="/settings"
              to="/settings"
              title="Settings"
              className={cn("text-xs text-muted-foreground hover:text-primary")}
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">{user.points} points</span>
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
            {user.completedQuests.length === 0 ? (
              <p className="text-muted-foreground">
                Complete quests to earn achievements!
              </p>
            ) : (
              user.completedQuests.map((quest) => (
                <div key={quest} className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span>{quest}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <CopyLink
        title="Refer a Friend"
        description="Earn points for referring friends. Achieved when your referral completes the quest"
        link={`${origin}/refer/${user.id}`}
      />
    </Container>
  );
}
