import { Game } from "../three/Game";

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
      <div
        style={{
          width: 450,

          background: "#ece9d8",

          border: "3px solid #245edb",

          borderRadius: 10,

          boxShadow: "0 15px 50px rgba(0,0,0,0.8)",

          overflow: "hidden",
        }}
      >
        {/* XP title */}
        <div
          style={{
            height: 40,

            display: "flex",

            alignItems: "center",

            paddingLeft: 15,

            color: "white",

            fontWeight: "bold",

            background: "linear-gradient(#4ca2ff,#0054e3)",

            textShadow: "1px 1px #003399",
          }}
        >
          Hex 2048.exe - Fatal Error
        </div>

        <div
          style={{
            padding: 25,

            display: "flex",

            gap: 20,

            alignItems: "center",
          }}
        >
          {/* GIF */}
          <img
            src="/dog.gif"
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
            padding: "0 25px 20px",

            color: "#333",
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

        {/* Buttons */}
        <div
          style={{
            display: "flex",

            justifyContent: "center",

            paddingBottom: 20,
          }}
        >
          <button
            onClick={onRestart}
            style={{
              width: 100,

              height: 35,

              fontFamily: "Tahoma",

              fontWeight: "bold",

              cursor: "pointer",

              borderRadius: 5,

              border: "2px solid #316ac5",

              background: "linear-gradient(#fff,#9bbcf5)",
            }}
          >
            OK
          </button>
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
    </div>
  );
}
