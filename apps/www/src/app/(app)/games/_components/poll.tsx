"use client";

import { Card } from "@/components/ui/card";
import { useCreatePrediction, useGamePredictions } from "@/lib/hooks/use-games";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GameResponse } from "@renegade-fanclub/types";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Poll({ game }: { game: GameResponse }) {
  const {
    id: gameId,
    homeTeamId,
    awayTeamId,
    homeTeamName,
    awayTeamName,
    homeTeamMetadata,
    awayTeamMetadata,
  } = game;
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const { mutate: createPrediction, isPending: submitting } =
    useCreatePrediction();
  const { data: predictions = [] } = useGamePredictions(gameId);

  // Calculate votes for each team
  const homeTeamVotes = predictions.filter(
    (p) => p.predictedWinnerId === homeTeamId,
  ).length;
  const awayTeamVotes = predictions.filter(
    (p) => p.predictedWinnerId === awayTeamId,
  ).length;
  const totalVotes = homeTeamVotes + awayTeamVotes;

  // Calculate percentage widths
  const homeTeamWidth =
    totalVotes === 0 ? 50 : (homeTeamVotes / totalVotes) * 100;
  const awayTeamWidth =
    totalVotes === 0 ? 50 : (awayTeamVotes / totalVotes) * 100;

  const teams = [
    {
      id: homeTeamId,
      title: homeTeamName,
      color: homeTeamMetadata?.colors?.primary || "#666666",
      votes: homeTeamVotes,
    },
    {
      id: awayTeamId,
      title: awayTeamName,
      color: awayTeamMetadata?.colors?.primary || "#666666",
      votes: awayTeamVotes,
    },
  ];

  const handleVote = (teamId: number, teamTitle: string) => {
    if (submitting) return;

    createPrediction(
      {
        gameId,
        predictedWinnerId: teamId,
      },
      {
        onSuccess: () => {
          setSelectedTeamId(teamId);
          toast.success("Prediction submitted successfully!");
        },
        onError: (error) => {
          toast.error("Failed to submit prediction. Please try again.");
          console.error("Failed to submit prediction:", error);
        },
      },
    );
  };

  return (
    <div className="">
      {/* Dynamic Bar */}
      <div className="relative bg-gray-200 rounded-lg h-12 transition-all overflow-hidden flex items-center">
        <div
          className="h-full transition-all"
          style={{
            width: `${homeTeamWidth}%`,
            backgroundColor: `${teams[0].color}`,
          }}
        ></div>

        {/* VS Sign on Bar */}
        <div
          className="absolute top-0 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg border-2 border-gray-300 text-lg font-extrabold text-red-500"
          style={{
            left: `calc(${homeTeamWidth}% - 24px)`,
          }}
        >
          VS
        </div>

        <div
          className="h-full transition-all"
          style={{
            width: `${awayTeamWidth}%`,
            backgroundColor: `${teams[1].color}`,
          }}
        ></div>
      </div>

      {/* Main Game voting */}
      <Card className="flex flex-col items-center justify-center space-y-10 p-9">
        <h3 className="text-2xl font-bold mb-4">Who is gonna win?</h3>
        <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-2xl">
          {teams.map((team) => (
            <div
              key={team.id}
              className={`relative transition-all p-2 sm:p-4 border rounded-xl border-mute pb-4 sm:pb-6 cursor-pointer hover:bg-white/5 ${
                submitting ? "pointer-events-none opacity-50" : ""
              }`}
              style={
                selectedTeamId === team.id ? { borderColor: team.color } : {}
              }
              onClick={() => handleVote(team.id, team.title)}
            >
              <div className="flex items-center justify-end">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  size="lg"
                  style={
                    selectedTeamId === team.id
                      ? { color: team.color }
                      : { color: "transparent" }
                  }
                />
              </div>
              <div className="flex flex-col items-center space-y-4 justify-between">
                <span className="font-bold text-sm sm:text-xl mt-6 sm:mt-10">
                  {team.title}
                </span>
                <p className="font-bold text-sm sm:text-xl">
                  {team.votes} votes
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
