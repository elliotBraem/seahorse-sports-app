export const dynamic = "force-dynamic";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { listQuests } from "@/lib/api/quests";

export default async function QuestsPage() {
  const quests = await listQuests();

  return (
    <Container
      title="Quests"
      description="Complete quests to win Super Bowl tickets!"
    >
      <div className="grid gap-6 w-full">
        {quests.map((quest) => (
          <Card key={quest.id}>
            <CardHeader>
              <CardTitle>{quest.name}</CardTitle>
              <CardDescription>{quest.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {quest.pointsValue} points
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
