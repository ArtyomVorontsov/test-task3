import { useEffect, useState } from "react";

export default function Hint() {
  const [visible, setVisible] = useState(true);

  const isMobile =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 7000);

    return () => clearTimeout(timeout);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",

        width: 420,
        maxWidth: "calc(100vw - 32px)",

        background: "#ece9d8",

        border: "2px solid #245edb",

        boxShadow: "4px 4px 12px rgba(0,0,0,.35)",

        fontFamily: "Tahoma, Arial, sans-serif",

        zIndex: 999999,
      }}
    >
      {/* XP Title Bar */}
      <div
        style={{
          height: 30,

          display: "flex",
          alignItems: "center",

          paddingLeft: 10,

          color: "white",

          fontWeight: "bold",

          background: "linear-gradient(#4ca2ff,#0054e3)",

          textShadow: "1px 1px #003399",
        }}
      >
        💡 Controls
      </div>

      {/* Content */}
      <div
        style={{
          padding: 16,

          lineHeight: 1.6,

          color: "#222",

          fontSize: 14,
        }}
      >
        {isMobile ? (
          <>
            <div>👆 Drag with one finger to rotate the board.</div>

            <div>🤏 Pinch with two fingers to zoom.</div>

            <div>🎮 Use the on-screen keyboard to move the tiles.</div>
          </>
        ) : (
          <>
            <div>🖱️ Hold the left mouse button and drag to rotate.</div>

            <div>🖱️ Use the mouse wheel to zoom.</div>

            <div>⌨️ Move tiles with Q W E A S D.</div>
          </>
        )}
      </div>
    </div>
  );
}