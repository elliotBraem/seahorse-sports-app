"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { listTeams, addFavoriteTeam } from "@/lib/api/teams";
import { Sport, TeamResponse } from "@renegade-fanclub/types";

interface TeamsSelectionProps {
  selectedSports: Sport[];
  onNext: () => void;
  onBack: () => void;
}

export function TeamsSelection({
  selectedSports,
  onNext,
  onBack,
}: TeamsSelectionProps) {
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<TeamResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsList = await listTeams();
        // Filter teams by selected sports
        const filteredTeams = teamsList.filter((team) =>
          selectedSports.some((sport) => sport.id === team.sportId),
        );
        setTeams(filteredTeams);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [selectedSports]);

  const toggleTeam = (team: TeamResponse) => {
    setSelectedTeams((current) => {
      const exists = current.find((t) => t.id === team.id);
      if (exists) {
        return current.filter((t) => t.id !== team.id);
      }
      return [...current, team];
    });
  };

  const handleNext = async () => {
    try {
      // Add all selected teams as favorites
      await Promise.all(
        selectedTeams.map((team) => addFavoriteTeam({ teamId: team.id })),
      );
      onNext();
    } catch (error) {
      console.error("Failed to save favorite teams:", error);
    }
  };

  if (loading) {
    return <div>Loading teams...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Select Your Favorite Teams</h2>
        <p className="text-muted-foreground">
          Choose the teams you want to follow
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {teams.map((team) => {
          const isSelected = selectedTeams.some((t) => t.id === team.id);
          return (
            <Card
              key={team.id}
              className={`p-4 cursor-pointer transition-colors ${
                isSelected ? "bg-primary/10 border-primary" : ""
              }`}
              onClick={() => toggleTeam(team)}
            >
              <div className="text-center">
                <h3 className="font-medium">{team.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedSports.find((s) => s.id === team.sportId)?.name}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={selectedTeams.length === 0}>
          Next
        </Button>
      </div>
    </div>
  );
}
