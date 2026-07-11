import { useEffect, useState } from "react";
import ThreeCanvas from "./ThreeCanvas";
import { GameStats } from "./Statistics";
import { GameOver } from "./GameOver";
import { Game } from "../three/Game";
import Keyboard from "./Keyboard";
import Hint from "./Hint";

export function GameScreen({
  size,
  onExit,
}: {
  size: number;
  onExit: () => void;
}) {
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
      <Keyboard />

      <Hint />
      <GameStats game={game} />

      <GameOver
        game={game}
        onRestart={() => {
          setGame(null);

          setRestartKey((value) => value + 1);
        }}
      />

      <button
        onClick={onExit}
        style={{
          position: "absolute",

          top: 20,
          right: 20,

          fontFamily: "Tahoma",

          fontWeight: "bold",

          cursor: "pointer",

          padding: "10px 20px",

          borderRadius: 5,

          border: "2px solid #316ac5",

          background: "linear-gradient(#fff,#9bbcf5)",
        }}
      >
        Go to Menu
      </button>
    </div>
  );
}
