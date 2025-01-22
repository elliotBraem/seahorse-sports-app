import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import toast from "react-hot-toast";
import { CheckCircle2 } from "lucide-react";

const initialTeams = [
  {
    id: 1,
    title: "Team A",
    description: "The Team A are a professional American football team.",
    logo: "/images/team-a.png",
    points: 10,
    color: "#cd9d00",
  },
  {
    id: 2,
    title: "Team B",
    logo: "/images/team-b.png",
    points: 19,
    color: "#00b5a3",
  },
];

export const Route = createFileRoute("/_layout/_authenticated/polls")({
  component: Polls_page,
});

function Polls_page() {
  const [isVisible, setIsVisible] = useState(false);
  const [teams, setTeams] = useState(initialTeams);
  const [vote, setVote] = useState("");
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleVote = (teamTitle: string) => {
    // Increment points for the selected team
    setVote(teamTitle);
    // Update points for the selected team on DB
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.title === teamTitle ? { ...team, points: team.points + 1 } : team
      )
    );
    // flag user as voted
    setHasVoted(true);
    toast.success(`${teamTitle} voted successfully!`);
  };

  const totalPoints = teams.reduce((sum, team) => sum + team.points, 0);
  const teamAWidth = (teams[0].points / totalPoints) * 100;
  const teamBWidth = (teams[1].points / totalPoints) * 100;

  return (
    <Container
      title="RNG"
      description="Win SuperBowl LIX Tickets"
      isVisible={isVisible}
    >
      <div className="space-y-4">
        {/* Dynamic Bar */}
        <div className="relative bg-gray-200 rounded-lg h-12 overflow-hidden flex items-center">
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
              left: `calc(${teamAWidth}% - 24px)`, // Dynamically position "VS" based on team A's width
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
        <div className="bg-white rounded-lg p-4">
          <h3 className="text-lg font-bold mb-4">Who is gonna win?</h3>
          <div className="grid grid-cols-2 gap-4">
            {teams.map((team) => (
              <div
                key={team.id}
                className={`p-4 border rounded-xl border-gray-200 pb-6 cursor-pointer hover:bg-gray-50 ${
                  hasVoted ? "pointer-events-none" : ""
                } `}
                style={vote === team.title ? { borderColor: team.color } : {}}
                onClick={() => handleVote(team.title)}
              >
                <div className="flex items-center justify-end">
                  <CheckCircle2
                    style={
                      vote === team.title
                        ? { color: team.color }
                        : { color: "transparent" }
                    }
                  />
                </div>
                <div className="flex flex-col items-center justify-between">
                  <div className="flex flex-col items-center space-x-2">
                    <img
                      src={team.logo}
                      alt={team.title}
                      className=" border border-gray-400 rounded-full p-2 bg-white w-16 h-16"
                    />
                    <span className="font-bold text-l">{team.title}</span>
                  </div>
                  <span className="font-bold">{team.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
