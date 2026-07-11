import { useEffect, useState } from "react";
import "./Keyboard.css";

function pressKey(code: string) {
  window.dispatchEvent(
    new KeyboardEvent("keydown", {
      code,
      bubbles: true,
    })
  );
}

type KeyProps = {
  label: string;
  code: string;
};

function Key({ label, code }: KeyProps) {
  return (
    <button
      className="xp-key"
      onPointerDown={(e) => {
        e.preventDefault();
        pressKey(code);
      }}
    >
      {label}
    </button>
  );
}

export default function Keyboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");

    const update = () => {
      setIsMobile(media.matches);
      if (media.matches) {
        setVisible(true);
      }
    };

    update();

    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <>
      {!isMobile && !visible && (
        <button className="xp-show-keyboard" onClick={() => setVisible(true)}>
          Show Keyboard
        </button>
      )}

      {visible && (
        <div className="xp-keyboard">
          {!isMobile && (
            <div className="xp-titlebar">
              <span className="xp-title">Keyboard</span>

              <button className="xp-close" onClick={() => setVisible(false)}>
                ×
              </button>
            </div>
          )}

          <div className="xp-body">
            <div className="xp-row">
              <Key label="Q" code="KeyQ" />
              <Key label="W" code="KeyW" />
              <Key label="E" code="KeyE" />
            </div>

            <div className="xp-row">
              <Key label="A" code="KeyA" />
              <Key label="S" code="KeyS" />
              <Key label="D" code="KeyD" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
