import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { getGame, getGamePredictions } from "@/lib/api/games";
import { GamePredictionForm } from "../_components/game-prediction-form";
import { GamePredictions } from "../_components/game-predictions";

export default async function GamePage({ params }: { params: { id: string } }) {
  const gameId = parseInt(params.id);
  const [game, predictions] = await Promise.all([
    getGame(gameId),
    getGamePredictions(gameId),
  ]);

  return (
    <Container>
      <div className="container py-8">
        <Card className="p-6 mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-semibold">{game.homeTeamName}</h3>
                <p className="text-sm text-gray-500">Home Team</p>
              </div>
              <div className="text-center px-4">
                <span className="text-lg font-bold">VS</span>
                <p className="text-sm text-gray-500">
                  {new Date(game.startTime).toLocaleDateString()}
                </p>
              </div>
              <div className="flex-1 text-right">
                <h3 className="font-semibold">{game.awayTeamName}</h3>
                <p className="text-sm text-gray-500">Away Team</p>
              </div>
            </div>

            <div className="text-sm text-gray-500 text-center">
              Points Value: {game.pointsValue}
            </div>

            {game.status === "completed" && (
              <div className="text-center font-medium">
                Winner:{" "}
                {game.winnerTeamId === game.homeTeamId
                  ? game.homeTeamName
                  : game.awayTeamName}
              </div>
            )}
          </div>
        </Card>

        {game.status === "upcoming" && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Make Your Prediction</h2>
            <GamePredictionForm game={game} />
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-4">Predictions</h2>
          <GamePredictions predictions={predictions} />
        </div>
      </div>
    </Container>
  );
}
