import { createFileRoute } from '@tanstack/react-router';
import { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const USERS: User[] = Array.from({ length: 10 }, (_, i) => ({
  id: `${i + 1}`,
  email: `user${i + 1}@example.com`,
  name: `User ${i + 1}`,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
  points: Math.floor(Math.random() * 1000),
  rank: i + 1,
  completedQuests: [],
})).sort((a, b) => b.points - a.points);

export const Route = createFileRoute('/leaderboard')({
  component: Leaderboard,
});

function Leaderboard() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 md:px-6">
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">Top fans competing for Super Bowl tickets</p>
      </div>

      <div className="space-y-4">
        {USERS.map((user) => (
          <div
            key={user.id}
            className="flex items-center space-x-4 rounded-lg bg-card p-4 shadow-sm"
          >
            <span className="min-w-[2rem] text-2xl font-bold">{user.rank}</span>
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.points} points</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}