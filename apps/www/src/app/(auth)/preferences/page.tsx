export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { listSports } from "@/lib/api/sports";

export const metadata: Metadata = {
  title: "Sports & Teams Preferences | RNG Fan Club",
  description:
    "Customize your sports and teams preferences. Select your favorite sports and teams to personalize your experience.",
  openGraph: {
    title: "Sports & Teams Preferences | RNG Fan Club",
    description:
      "Customize your sports and teams preferences. Select your favorite sports and teams to personalize your experience.",
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
    title: "Sports & Teams Preferences | RNG Fan Club",
    description:
      "Customize your sports and teams preferences. Select your favorite sports and teams to personalize your experience.",
    images: ["/images/rngfanclub-logo-white.png"],
  },
};

import { listTeams } from "@/lib/api/teams";
import PreferencesForm from "./_components/preferences-form";
import { Header } from "@/components/header";

export default async function PreferencesPage() {
  const [sports, teams] = await Promise.all([listSports(), listTeams()]);

  // Transform the data to match the expected format
  const preferences = [
    {
      sports: sports.map((sport) => ({
        id: sport.id.toString(),
        title: sport.name,
        description: sport.description || `${sport.name} sports and events`,
        status: "active" as const,
        points: 100, // Default points value
      })),
    },
    {
      teams: teams.map((team) => ({
        id: team.id.toString(),
        title: team.name,
        description: team.description || `${team.name} team`,
        status: "active" as const,
        points: 100, // Default points value
      })),
    },
  ];

  return (
    <>
      <Header />
      <PreferencesForm preferences={preferences} />
    </>
  );
}
