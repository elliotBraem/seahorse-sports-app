"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { listSports } from "@/lib/api/sports";
import { Sport } from "@renegade-fanclub/types";

interface SportsSelectionProps {
  onNext: (selectedSports: Sport[]) => void;
}

export function SportsSelection({ onNext }: SportsSelectionProps) {
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSports, setSelectedSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const sportsList = await listSports();
        setSports(sportsList);
      } catch (error) {
        console.error("Failed to fetch sports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  const toggleSport = (sport: Sport) => {
    setSelectedSports((current) => {
      const exists = current.find((s) => s.id === sport.id);
      if (exists) {
        return current.filter((s) => s.id !== sport.id);
      }
      return [...current, sport];
    });
  };

  if (loading) {
    return <div>Loading sports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Select Your Favorite Sports</h2>
        <p className="text-muted-foreground">Choose the sports you want to follow</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {sports.map((sport) => {
          const isSelected = selectedSports.some((s) => s.id === sport.id);
          return (
            <Card
              key={sport.id}
              className={`p-4 cursor-pointer transition-colors ${
                isSelected ? "bg-primary/10 border-primary" : ""
              }`}
              onClick={() => toggleSport(sport)}
            >
              <div className="text-center">
                <h3 className="font-medium">{sport.name}</h3>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => onNext(selectedSports)}
          disabled={selectedSports.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
