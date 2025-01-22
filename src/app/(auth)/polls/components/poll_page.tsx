"use client";

import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Team {
  id: number;
  title: string;
  description?: string;
  logo: string;
  points: number;
  color: string;
}

interface Poll_PagePros {
  initialTeams: Team[];
}

export default function PollsPageComp({ initialTeams }: Poll_PagePros) {
  const [teams, setTeams] = useState(initialTeams);
  const [vote, setVote] = useState("");
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (teamTitle: string) => {
    setVote(teamTitle);
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.title === teamTitle ? { ...team, points: team.points + 1 } : team
      )
    );
    setHasVoted(true);
    toast.success(`${teamTitle} voted successfully!`);
  };

  const totalPoints = teams.reduce((sum, team) => sum + team.points, 0);
  const teamAWidth = (teams[0].points / totalPoints) * 100;
  const teamBWidth = (teams[1].points / totalPoints) * 100;

  return (
    <Container title="RNG" description="Win SuperBowl LIX Tickets">
      <div className="space-y-4">
        {/* Dynamic Bar */}
        <div className="relative bg-gray-200 rounded-lg h-12 transition-all overflow-hidden flex items-center">
          <div
            className="h-full transition-all"
            style={{
              width: `${teamAWidth}%`,
              backgroundColor: `${teams[0].color}`,
            }}
          >
            <div className="flex items-center justify-start  h-full pl-4 text-white text-sm font-bold">
              <img
                src={teams[0].logo}
                alt={teams[0].title}
                className="w-8 h-8 rounded-full"
              />
              <span className="ml-2">{teams[0].title}</span>
            </div>
          </div>

          {/* VS Sign on Bar */}
          <div
            className="absolute top-0 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg border-2 border-gray-300 text-lg font-extrabold text-red-500"
            style={{
              left: `calc(${teamAWidth}% - 24px)`,
            }}
          >
            VS
          </div>

          <div
            className="h-full transition-all"
            style={{
              width: `${teamBWidth}%`,
              backgroundColor: `${teams[1].color}`,
            }}
          >
            <div className="flex items-center justify-end h-full pr-4 text-white text-sm font-bold">
              <img
                src={teams[1].logo}
                alt={teams[1].title}
                className="w-8 h-8 rounded-full"
              />
              <span className="ml-2">{teams[1].title}</span>
            </div>
          </div>
        </div>

        {/* Main Game voting */}
        <Card className="flex flex-col items-center justify-center space-y-10 p-9">
          <h3 className="text-2xl font-bold mb-4">Who is gonna win?</h3>
          <div className="grid grid-cols-2 gap-4">
            {teams.map((team) => (
              <div
                key={team.id}
                className={`relative min-w-40 md:min-w-56 transition-all p-4 border rounded-xl border-mute pb-6 cursor-pointer hover:bg-white/5 ${
                  hasVoted ? "pointer-events-none" : ""
                }`}
                style={vote === team.title ? { borderColor: team.color } : {}}
                onClick={() => handleVote(team.title)}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <img
                    src={team.logo}
                    alt={team.title}
                    className="border border-gray-400 rounded-full p-2 bg-white w-16 h-16"
                  />
                </div>
                <div className="flex items-center justify-end">
                  <CheckCircle2
                    style={
                      vote === team.title
                        ? { color: team.color }
                        : { color: "transparent" }
                    }
                  />
                </div>
                <div className="flex flex-col items-center space-y-4 justify-between">
                  <span className="font-bold text-xl mt-10">{team.title}</span>
                  <p className="font-bold text-xl">-{team.points}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Container>
  );
}
