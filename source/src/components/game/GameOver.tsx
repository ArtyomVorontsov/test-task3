import { Game } from "../../logic/Game";
import dogGif from "../../../assets/dog.gif";

import XpButton from "../common/XpButton";
import XpWindow from "../common/XpWindow";

export function GameOver({
  game,
  onRestart,
}: {
  game: Game | null;
  onRestart: () => void;
}) {
  if (!game) {
    return null;
  }

  const stats = game.getStats();

  if (!stats.gameOver) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        background: "rgba(0,0,0,0.45)",

        zIndex: 20,

        fontFamily: "Tahoma, Arial, sans-serif",
      }}
    >
      <XpWindow
        title="Hex 2048.exe - Fatal Error"
        width={450}
        contentStyle={{
          padding: 25,
        }}
      >
        <>
          {/* Main content */}
          <div
            style={{
              display: "flex",

              gap: 20,

              alignItems: "center",

              marginBottom: 20,
            }}
          >
            <img
              src={dogGif}
              alt="Game Over"
              style={{
                width: 120,
                height: 120,

                objectFit: "cover",
              }}
            />

            <div>
              <div
                style={{
                  fontSize: 18,

                  fontWeight: "bold",

                  marginBottom: 10,
                }}
              >
                No more legal moves!
              </div>

              <div>The hexagons have formed an unstoppable union.</div>

              <br />

              <div>
                Windows suggests:
                <br />
                "Have you tried turning the board off and on again?"
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div
            style={{
              color: "#333",

              marginBottom: 24,
            }}
          >
            Final score:
            <b> {stats.score}</b>
            <br />
            Best tile:
            <b> {stats.highestTile}</b>
            <br />
            Moves survived:
            <b> {stats.moves}</b>
          </div>

          {/* Button */}
          <div
            style={{
              display: "flex",

              justifyContent: "center",
            }}
          >
            <XpButton width={90} onClick={onRestart}>
              OK
            </XpButton>
          </div>
        </>
      </XpWindow>
    </div>
  );
}
