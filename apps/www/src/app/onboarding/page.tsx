"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getUserProfile, updateUserProfile } from "@/lib/api/user";
import { useAuthStore } from "@/lib/store";
import { SportsSelection } from "./_components/sports-selection";
import { TeamsSelection } from "./_components/teams-selection";
import { Sport } from "@renegade-fanclub/types";

type OnboardingStep = "sports" | "teams";

export default function OnboardingPage() {
  const router = useRouter();
  const { accountId } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("sports");
  const [selectedSports, setSelectedSports] = useState<Sport[]>([]);

  useEffect(() => {
    if (!accountId) {
      router.replace("/");
      return;
    }

    const checkOnboardingStatus = async () => {
      try {
        const profile = await getUserProfile();

        // If user has completed onboarding steps, redirect to quests
        if (profile.profileData.onboardingComplete) {
          router.replace("/quests");
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to check onboarding status:", error);
        // If there's an error, assume user needs to complete onboarding
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [accountId]);

  const handleSportsNext = (sports: Sport[]) => {
    setSelectedSports(sports);
    setCurrentStep("teams");
  };

  const handleTeamsBack = () => {
    setCurrentStep("sports");
  };

  const handleTeamsNext = async () => {
    try {
      // Mark onboarding as complete
      await updateUserProfile({
        profileData: { onboardingComplete: true },
      });
      router.replace("/quests");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="flex min-h-dvh items-center justify-center">
          Loading...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex min-h-dvh flex-col items-center justify-center py-8">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <h1 className="text-2xl font-bold text-center">
              Welcome to Renegade Fan Club
            </h1>
            <p className="text-muted-foreground text-center">
              Let's get you set up
            </p>
          </CardHeader>
          <CardContent>
            {currentStep === "sports" && (
              <SportsSelection onNext={handleSportsNext} />
            )}
            {currentStep === "teams" && (
              <TeamsSelection
                selectedSports={selectedSports}
                onNext={handleTeamsNext}
                onBack={handleTeamsBack}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
