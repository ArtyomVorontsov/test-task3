import { useEffect, useState } from "react";
import { Game } from "../../three/Game";
import XpButton from "../common/XpButton";
import XpWindow from "../common/XpWindow";

export function GameStats({ game }: { game: Game | null }) {
  const [visible, setVisible] = useState(true);

  const [, update] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      update((v) => v + 1);
    }, 200);

    return () => clearInterval(timer);
  }, []);

  if (!game || !visible) {
    return (
      <XpButton
        onClick={() => setVisible(true)}
        width={120}
        height={40}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
        }}
      >
        Show Stats
      </XpButton>
    );
  }

  const stats = game.getStats();

  return (
    <XpWindow
      title="Game Statistics"
      width={230}
      onClose={() => setVisible(false)}
      style={{
        position: "absolute",
        top: 20,
        left: 20,
      }}
    >
      <div>
        Score: <b>{stats.score}</b>
      </div>

      <div>
        Moves: <b>{stats.moves}</b>
      </div>

      <div>
        Best tile: <b>{stats.highestTile}</b>
      </div>

      <div>
        Time: <b>{Math.floor((Date.now() - stats.startedAt) / 1000)}s</b>
      </div>

      {stats.gameOver && <div>Game Over!</div>}
    </XpWindow>
  );
}
