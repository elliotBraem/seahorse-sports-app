import PreferencesComp from "./Components/preferences_page";

const preferences = [
  {
    sports: [
      {
        id: "1",
        title: "Football",
        description: "NFL, MLB, NCAA, etc.",
        points: 100,
        status: "active" as const,
      },
      {
        id: "2",
        title: "Basketball",
        description: "NBA, WNBA, NCAA, etc.",
        points: 200,
        status: "locked" as const,
      },
    ],
  },
  {
    teams: [
      {
        id: "1",
        title: "New York Giants",
        description:
          "The New York Giants are a professional American football team based in East Rutherford, New Jersey.",
        points: 100,
        status: "active" as const,
      },
      {
        id: "2",
        title: "Los Angeles Rams",
        description:
          "The Los Angeles Rams are a professional American football team based in Los Angeles, California.",
        points: 200,
        status: "locked" as const,
      },
    ],
  },
  {
    leagues: [
      {
        id: "1",
        title: "NFL",
        description: "National Football League",
        points: 100,
        status: "active" as const,
      },
      {
        id: "2",
        title: "NBA",
        description: "National Basketball Association",
        points: 200,
        status: "locked" as const,
      },
    ],
  },
  {
    athletes: [
      {
        id: "1",
        title: "Michael Jordan",
        description:
          "Michael Jordan is an American basketball player who played for the Chicago Bulls, Los Angeles Lakers, and Chicago Bulls of the National Basketball Association (NBA).",
        points: 100,
        status: "active" as const,
      },
      {
        id: "2",
        title: "LeBron James",
        description:
          "LeBron James is an American basketball player who plays for the Los Angeles Lakers of the National Basketball Association (NBA).",
        points: 200,
        status: "locked" as const,
      },
    ],
  },
];

export default function PreferencesPage() {

  return <PreferencesComp preferences={preferences} />;

 
}
