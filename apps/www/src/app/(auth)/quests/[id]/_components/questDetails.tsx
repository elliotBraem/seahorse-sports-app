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
import { Trophy } from "lucide-react";

export default function QuestDetails() {
  return (
    <>
      <Header showBackButton={true} />
      <Container title="Quest Title">
        <Card key="1">
          <CardHeader className="flex flex-row gap-4 items-start sm:items-center justify-between">
            <h3 className="font-bold">Description</h3>
            <Button variant={"outline"}>Get Started</Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <p>This is a description of the quest.</p>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium">50 points</span>
              </div>

              {/* Quest-specific actions */}

              <div className="mt-4 text-sm text-muted-foreground">
                Available until{" "}
                {new Date("2025-02-01").toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
