import { useEffect, useState } from "react";
import { Game } from "../../three/Game";
import XpButton from "../common/xpButton";

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
    <div
      style={{
        position: "absolute",

        top: 20,
        left: 20,

        width: 230,

        background: "#ece9d8",

        border: "3px solid #245edb",

        borderRadius: 10,

        overflow: "hidden",

        fontFamily: "Tahoma, Arial",

        boxShadow: "0 5px 20px rgba(0,0,0,0.5)",
      }}
    >
      {/* XP title bar */}
      <div
        style={{
          height: 35,

          display: "flex",

          alignItems: "center",

          justifyContent: "space-between",

          paddingLeft: 10,

          paddingRight: 6,

          color: "white",

          fontWeight: "bold",

          background: "linear-gradient(#4ca2ff,#0054e3)",

          textShadow: "1px 1px #003399",
        }}
      >
        <span>Game Statistics</span>

        {/* Close button */}
        <XpButton
          onClick={() => setVisible(false)}
          width={22}
          height={22}
          style={{
            padding: 0,

            minWidth: 22,

            color: "white",

            fontWeight: "bold",

            fontSize: 15,

            lineHeight: "18px",

            borderRadius: 4,

            border: "1px solid white",

            background: "linear-gradient(#ff8080,#c00000)",

            boxShadow: "none",
          }}
        >
          ×
        </XpButton>
      </div>

      {/* Stats content */}
      <div
        style={{
          padding: 20,

          color: "#000",
        }}
      >
        <div>
          Score:
          <b> {stats.score}</b>
        </div>

        <div>
          Moves:
          <b> {stats.moves}</b>
        </div>

        <div>
          Best tile:
          <b> {stats.highestTile}</b>
        </div>

        <div>
          Time:
          <b> {Math.floor((Date.now() - stats.startedAt) / 1000)}s</b>
        </div>

        {stats.gameOver && <div>Game Over!</div>}
      </div>

      {/* XP status bar */}
      <div
        style={{
          height: 25,

          background: "#d6d3ce",

          borderTop: "1px solid #aaa",
        }}
      />
    </div>
  );
}
