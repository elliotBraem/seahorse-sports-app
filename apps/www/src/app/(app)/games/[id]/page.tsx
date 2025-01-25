import { getGame } from "@/lib/api/games";
import { Game } from "./_components/game";

export default async function GamePage({ params }: { params: { id: string } }) {
  const gameId = parseInt(params.id);
  const initialGame = await getGame(gameId);

  return (
    <>
      <div className="relative w-full h-[260px]">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566577738928-c49fe1932e84?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-bottom opacity-60"
          style={{
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>
      <div className="-mt-24 relative z-10 m-4">
        <Game gameId={gameId} initialGame={initialGame} />
      </div>
    </>
  );
}
