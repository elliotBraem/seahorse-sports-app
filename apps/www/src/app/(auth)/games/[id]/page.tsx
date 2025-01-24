import { getGame } from "@/lib/api/games";
import { Game } from "./_components/game";

export default async function GamePage({ params }: { params: { id: string } }) {
  const gameId = parseInt(params.id);
  const initialGame = await getGame(gameId);

  return (
    <>
      <div className="relative w-full h-[260px]">
        <div 
          className="absolute inset-0 bg-[url('/images/stadium.jpeg')] bg-cover bg-bottom opacity-60"
          style={{ 
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
          }}
        />
      </div>
      <div className="-mt-24 relative z-10">
        <Game gameId={gameId} initialGame={initialGame} />
      </div>
    </>
  );
}
