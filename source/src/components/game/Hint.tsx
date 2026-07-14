import { useEffect, useState } from "react";
import XpWindow from "../common/XpWindow";

export default function Hint() {
  const [visible, setVisible] = useState(true);

  const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;

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

        zIndex: 999999,
      }}
    >
      <XpWindow
        title="💡 Controls"
        width={420}
        contentStyle={{
          padding: 16,

          lineHeight: 1.6,

          color: "#222",

          fontSize: 14,
        }}
        onClose={() => setVisible(false)}
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
      </XpWindow>
    </div>
  );
}
