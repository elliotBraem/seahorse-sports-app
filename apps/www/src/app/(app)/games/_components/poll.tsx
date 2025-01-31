"use client";

import { GameResponse, PredictionResponse } from "@renegade-fanclub/types";
import { motion, AnimatePresence } from "framer-motion";

interface PollProps {
  game: GameResponse;
  selectedTeamId?: number | null;
  predictions: PredictionResponse[];
}

export default function Poll({ game, selectedTeamId, predictions }: PollProps) {
  const {
    id: gameId,
    homeTeamId,
    awayTeamId,
    homeTeamName,
    awayTeamName,
    homeTeamMetadata,
    awayTeamMetadata,
  } = game;

  // Calculate votes for each team, including the local prediction
  const homeTeamVotes =
    predictions.filter((p) => p.predictedWinnerId === homeTeamId).length +
    (selectedTeamId === homeTeamId ? 1 : 0);
  const awayTeamVotes =
    predictions.filter((p) => p.predictedWinnerId === awayTeamId).length +
    (selectedTeamId === awayTeamId ? 1 : 0);
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

  // Removed handleVote since it's now handled in the parent Game component

  return (
    <div className="">
      {/* Dynamic Bar */}
      <div className="relative rounded-lg h-12 overflow-hidden flex items-center">
        <motion.div
          className="h-full"
          initial={{ width: 0 }}
          animate={{ width: `${homeTeamWidth}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            backgroundColor: `${teams[0].color}`,
          }}
        />

        {/* VS Sign on Bar */}
        <motion.div
          className="absolute top-0 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg border-2 border-gray-300 text-lg font-extrabold text-red-500"
          animate={{
            left: `calc(${homeTeamWidth}% - 24px)`,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          VS
        </motion.div>

        <motion.div
          className="h-full"
          initial={{ width: 0 }}
          animate={{ width: `${awayTeamWidth}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            backgroundColor: `${teams[1].color}`,
          }}
        />
      </div>

      {/* Vote counts display */}
      <div className="flex justify-between mt-4 px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.p
            className="text-lg font-bold"
            key={homeTeamVotes}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {homeTeamVotes} votes
          </motion.p>
        </motion.div>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.p
            className="text-lg font-bold"
            key={awayTeamVotes}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {awayTeamVotes} votes
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
