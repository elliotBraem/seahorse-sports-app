import { listSports } from "@/lib/api/sports";
import { listTeams } from "@/lib/api/teams";
import PreferencesForm from "./components/preferences-form";

export default async function PreferencesPage() {
  const [sports, teams] = await Promise.all([
    listSports(),
    listTeams()
  ]);

  // Transform the data to match the expected format
  const preferences = [
    {
      sports: sports.map(sport => ({
        id: sport.id.toString(),
        title: sport.name,
        description: sport.description || `${sport.name} sports and events`,
        status: "active" as const,
        points: 100, // Default points value
      }))
    },
    {
      teams: teams.map(team => ({
        id: team.id.toString(),
        title: team.name,
        description: team.description || `${team.name} team`,
        status: "active" as const,
        points: 100, // Default points value
      }))
    }
  ];

  return <PreferencesForm preferences={preferences} />;
}
