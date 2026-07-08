import { useEffect, useState } from "react";
import ThreeCanvas from "./ThreeCanvas";
import { GameStats } from "./Statistics";
import { GameOver } from "./GameOver";
import { Game } from "../three/Game";

export function GameScreen({ size }: { size: number }) {
  const [game, setGame] = useState<Game | null>(null);
  const [restartKey, setRestartKey] = useState(0);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!game) {
      return;
    }

    const timer = setInterval(() => {
      forceUpdate((v) => v + 1);
    }, 200);

    return () => clearInterval(timer);
  }, [game]);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
      }}
    >
      <ThreeCanvas key={restartKey} radius={size} onGameReady={setGame} />

      <GameStats game={game} />

      <GameOver
        game={game}
        onRestart={() => {
          setGame(null);

          setRestartKey((value) => value + 1);
        }}
      />
    </div>
  );
}
