import { useState } from "react";
import { Game } from "../three/Game";
import ThreeCanvas from "./ThreeCanvas";
import { GameStats } from "./Statistics";

export function GameScreen({ size }: { size: number }) {
  const [game, setGame] = useState<Game | null>(null);

  return (
    <div>
      <ThreeCanvas radius={size} onGameReady={setGame} />

      <GameStats game={game} />
    </div>
  );
}
