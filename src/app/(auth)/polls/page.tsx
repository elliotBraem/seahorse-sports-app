"use client";

import { Container } from "@/components/ui/container";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import PollsPageComp from "./components/poll_page";

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
    description: "The Team B are a professional American football team.",
    logo: "/images/team-b.png",
    points: 19,
    color: "#00b5a3",
  },
];

export default function PollsPage() {
  return <PollsPageComp initialTeams={initialTeams} />;
}
