import { useState } from "react";
import { GameScreen } from "./components/GameScreen";

export default function App() {
  const [size, setSize] = useState<number | null>(null);

  if (size === null) {
    return <Menu onStart={(value) => setSize(value)} />;
  }

  return <GameScreen size={size} />;
}

export function Menu({ onStart }: { onStart: (size: number) => void }) {
  const [showError, setShowError] = useState(false);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        position: "relative",

        fontFamily: "Tahoma, Arial, sans-serif",

        background: "linear-gradient(#3a6ea5, #8cc63f)",
      }}
    >
      {/* Main XP window */}
      <div
        style={{
          width: 420,

          background: "#ece9d8",

          borderRadius: 12,

          border: "3px solid #245edb",

          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",

          overflow: "hidden",

          zIndex: 2,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: 38,

            display: "flex",

            alignItems: "center",

            justifyContent: "space-between",

            paddingLeft: 15,

            paddingRight: 8,

            color: "white",

            fontWeight: "bold",

            background: "linear-gradient(#4ca2ff,#0054e3)",

            textShadow: "1px 1px #003399",
          }}
        >
          <span>Hex 2048.exe</span>

          {/* Fake close button */}
          <button
            onClick={() => setShowError(true)}
            style={{
              width: 24,
              height: 24,

              padding: 0,

              cursor: "pointer",

              color: "white",

              fontWeight: "bold",

              fontSize: 16,

              lineHeight: "20px",

              borderRadius: 4,

              border: "1px solid white",

              background: "linear-gradient(#ff8080,#c00000)",
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: 30,

            textAlign: "center",
          }}
        >
          <h1
            style={{
              marginTop: 0,

              color: "#003399",
            }}
          >
            Hex 2048
          </h1>

          <p>Select field size</p>

          <XpButton onClick={() => onStart(2)}>Small (19 tiles)</XpButton>

          <XpButton onClick={() => onStart(3)}>Medium (37 tiles)</XpButton>

          <XpButton onClick={() => onStart(4)}>Large (61 tiles)</XpButton>
        </div>

        {/* Status bar */}
        <div
          style={{
            height: 30,

            background: "#d6d3ce",

            borderTop: "1px solid #aaa",
          }}
        />
      </div>

      {/* XP Error popup */}
      {showError && (
        <div
          style={{
            position: "absolute",

            zIndex: 5,

            width: 360,

            background: "#ece9d8",

            borderRadius: 8,

            border: "3px solid #245edb",

            boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
          }}
        >
          {/* Error title */}
          <div
            style={{
              height: 35,

              display: "flex",

              alignItems: "center",

              paddingLeft: 12,

              color: "white",

              fontWeight: "bold",

              background: "linear-gradient(#4ca2ff,#0054e3)",
            }}
          >
            Hex 2048.exe - Error
          </div>

          <div
            style={{
              padding: 25,

              display: "flex",

              gap: 15,

              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 42,

                height: 42,

                borderRadius: "50%",

                background: "#ff0000",

                color: "white",

                display: "flex",

                justifyContent: "center",

                alignItems: "center",

                fontSize: 28,

                fontWeight: "bold",
              }}
            >
              !
            </div>

            <div>
              <div>Cannot close Hex 2048.exe.</div>

              <br />

              <div>The hexagons are still thinking.</div>

              <div>Please merge responsibly.</div>
            </div>
          </div>

          <div
            style={{
              display: "flex",

              justifyContent: "center",

              paddingBottom: 20,
            }}
          >
            <XpButton onClick={() => setShowError(false)}>OK</XpButton>
          </div>
        </div>
      )}
    </div>
  );
}

function XpButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",

        height: 42,

        marginBottom: 12,

        cursor: "pointer",

        fontFamily: "Tahoma, Arial",

        fontSize: 15,

        fontWeight: "bold",

        borderRadius: 5,

        border: "2px solid #316ac5",

        background: "linear-gradient(#ffffff,#dbe9ff,#9bbcf5)",

        boxShadow: "inset 0 1px white, 0 2px 4px #777",
      }}
    >
      {children}
    </button>
  );
}
