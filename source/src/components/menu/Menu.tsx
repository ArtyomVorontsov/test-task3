import { useEffect, useState } from "react";
import clipGif from "../../../assets/clip.gif";
import XpButton from "../common/xpButton";

export function Menu({ onStart }: { onStart: (size: number) => void }) {
  const [showError, setShowError] = useState(false);

  const [codeLines, setCodeLines] = useState<string[]>([]);

  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}[]<>/\\=+-*_$#@";

    const generateCode = () =>
      Array.from(
        { length: 100 },
        () => chars[Math.floor(Math.random() * chars.length)]
      ).join("");

    setCodeLines(Array.from({ length: 25 }, generateCode));

    const interval = setInterval(() => {
      setCodeLines((prev) => [...prev.slice(1), generateCode()]);
    }, 300);

    return () => clearInterval(interval);
  }, []);

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
      {/* Animated code background */}
      <div
        style={{
          position: "absolute",
          inset: 0,

          overflow: "hidden",

          fontFamily: "Consolas, monospace",

          fontSize: 18,

          color: "#00ff66",

          opacity: 0.25,

          pointerEvents: "none",

          zIndex: 1,
        }}
      >
        {codeLines.map((line, index) => (
          <div
            key={index}
            style={{
              whiteSpace: "nowrap",

              marginTop: 8,

              animation: `codeMove ${8 + (index % 5)}s linear infinite`,

              transform: `translateX(${index % 2 === 0 ? "-200px" : "0px"})`,
            }}
          >
            {line}
          </div>
        ))}
      </div>

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
          <XpButton
            width={24}
            height={24}
            onClick={() => setShowError(true)}
            style={{
              padding: 0,

              color: "white",

              fontSize: 16,
              fontWeight: "bold",
              lineHeight: "20px",

              borderRadius: 4,

              border: "1px solid white",

              background: "linear-gradient(#ff8080,#c00000)",

              boxShadow: "none",

              minWidth: 24,
            }}
          >
            ×
          </XpButton>
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
              marginBottom: 12,
              color: "#003399",
              textShadow: "1px 1px white",
            }}
          >
            Hex 2048
          </h1>

          <img
            src={clipGif}
            alt="Animated"
            style={{
              width: 180,
              height: 180,
              objectFit: "contain",

              imageRendering: "pixelated",

              marginBottom: 20,

              padding: 4,
            }}
          />

          <p
            style={{
              marginTop: 0,
              marginBottom: 18,
              color: "#333",
              fontWeight: "bold",
            }}
          >
            Select field size
          </p>

          <XpButton
            width="100%"
            height={42}
            style={{
              margin: "5px 0px",
            }}
            onClick={() => onStart(1)}
          >
            Very Small (7 tiles)
          </XpButton>

          <XpButton
            width="100%"
            height={42}
            style={{
              margin: "5px 0px",
            }}
            onClick={() => onStart(2)}
          >
            Small (19 tiles)
          </XpButton>

          <XpButton
            width="100%"
            height={42}
            style={{
              margin: "5px 0px",
            }}
            onClick={() => onStart(3)}
          >
            Medium (37 tiles)
          </XpButton>

          <XpButton
            width="100%"
            height={42}
            style={{
              padding: "0 20px",
            }}
            onClick={() => onStart(4)}
          >
            Large (61 tiles)
          </XpButton>
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
