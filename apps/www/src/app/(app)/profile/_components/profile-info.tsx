"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { ProfileResponse } from "@renegade-fanclub/types";
import { useUserPoints } from "@/lib/hooks/use-user-points";

interface ProfileInfoProps {
  profile: ProfileResponse;
}

export function ProfileInfo({ profile }: ProfileInfoProps) {
  const { data: totalPoints } = useUserPoints();

  return (
    <div className="flex flex-col items-center space-y-4 py-4">
      <Avatar className="h-20 w-20 border-2 border-white/10">
        <AvatarImage src={profile.avatar ?? undefined} alt={profile.username} />
        <AvatarFallback className="bg-white/5 text-lg">
          {profile.username[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center">
        <p className="font-semibold tracking-tight text-2xl overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]">
          {profile.username}
        </p>
        <p className="text-sm text-white/60 overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]">
          {profile.email}
        </p>
      </div>
      <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full">
        <FontAwesomeIcon icon={faTrophy} className="h-4 w-4 text-yellow-500" />
        <span className="font-medium">{totalPoints}</span>
      </div>
    </div>
  );
}
