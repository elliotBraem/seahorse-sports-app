"use client";

import { Card } from "@/components/ui/card";
import { useGames } from "@/lib/hooks/use-games";
import Link from "next/link";
import { TeamCard } from "./team-card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";

export function GamesList() {
  const { data: games, isLoading } = useGames();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <Card className="p-6">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  if (!games?.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">No current games available</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col space-y-3">
      {games.map((game) => (
        <Link key={game.id} href={`/games/${game.id}`}>
          <Card className="p-6 pb-6 sm:p-8 sm:pb-12 hover:bg-white/[0.02] transition-all duration-200">
            <div className="flex flex-col gap-8">
              <div className="relative flex flex-col items-center text-center justify-center">
                {typeof game.apiMetadata === "object" &&
                  game.apiMetadata !== null &&
                  "conference" in game.apiMetadata && (
                    <h2 className="text-sm md:text-xl font-bold text-white">
                      {game.apiMetadata.conference as string} Championship
                    </h2>
                  )}

                {game.status === "completed" ? (
                  <div className="flex items-center justify-center space-x-2 bg-white/20 px-4 py-1.5 rounded-full mt-2 w-fit mx-auto">
                    <span className="font-medium text-sm">
                      Winner:{" "}
                      {game.winnerTeamId === game.homeTeamId
                        ? game.homeTeamName
                        : game.awayTeamName}
                    </span>
                  </div>
                ) : (
                  <div className="absolute -top-1 right-0 flex items-center space-x-2 bg-white/20 px-3 py-1.5 rounded-full">
                    <FontAwesomeIcon
                      icon={faTrophy}
                      className="h-3 w-3 text-yellow-500"
                    />
                    <span className="text-xs font-medium">
                      {game.pointsValue}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center -mx-2">
                <TeamCard
                  teamName={game.homeTeamName}
                  teamMetadata={game.homeTeamMetadata}
                  isHome={true}
                />

                <div className="flex flex-col items-center justify-center text-center space-y-2 max-w-28 md:max-w-48">
                  <span className="text-xs md:text-base font-bold bg-white/10 text-white px-3 py-2 md:px-4 rounded-full">
                    VS
                  </span>
                  <div className="w-full">
                    {typeof game.apiMetadata === "object" &&
                      game.apiMetadata !== null &&
                      "location" in game.apiMetadata && (
                        <p className="text-[7px] md:text-xs text-white/70 leading-3">
                          {game.apiMetadata.location as string}
                        </p>
                      )}
                    <p className="text-[7px] md:text-sm text-white/60">
                      {new Date(game.startTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <TeamCard
                  teamName={game.awayTeamName}
                  teamMetadata={game.awayTeamMetadata}
                  isHome={false}
                />
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
