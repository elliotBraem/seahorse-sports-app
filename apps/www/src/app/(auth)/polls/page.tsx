import { getCurrentGames, getGamePredictions } from "@/lib/api/games";
import { getTeam } from "@/lib/api/teams";
import PollsPageComp from "./components/poll_page";
import { notFound } from "next/navigation";

export default async function PollsPage() {
  // Get current games
  const currentGames = await getCurrentGames();
  
  if (!currentGames.length) {
    notFound();
  }

  // Get the first active game
  const game = currentGames[0];
  
  // Get teams data
  const [homeTeam, awayTeam] = await Promise.all([
    getTeam(game.homeTeamId),
    getTeam(game.awayTeamId)
  ]);

  // Get predictions for this game
  const predictions = await getGamePredictions(game.id);

  // Calculate points (predictions) for each team
  const homeTeamPredictions = predictions.filter(p => p.predictedWinnerTeamId === game.homeTeamId).length;
  const awayTeamPredictions = predictions.filter(p => p.predictedWinnerTeamId === game.awayTeamId).length;

  const teams = [
    {
      id: homeTeam.id,
      title: homeTeam.name,
      description: homeTeam.description || `${homeTeam.name} team`,
      logo: homeTeam.logo || "/images/team-a.png", // Fallback to default image
      points: homeTeamPredictions,
      color: "#cd9d00", // Default color
    },
    {
      id: awayTeam.id,
      title: awayTeam.name,
      description: awayTeam.description || `${awayTeam.name} team`,
      logo: awayTeam.logo || "/images/team-b.png", // Fallback to default image
      points: awayTeamPredictions,
      color: "#00b5a3", // Default color
    }
  ];

  return <PollsPageComp gameId={game.id} initialTeams={teams} />;
}
