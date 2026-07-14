import { useEffect, useState } from "react";
import "./Keyboard.css";

import XpButton from "../common/XpButton";
import XpWindow from "../common/XpWindow";

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

  const keyboard = (
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
  );

  return (
    <>
      {!isMobile && !visible && (
        <XpButton
          onClick={() => setVisible(true)}
          width={150}
          height={40}
          style={{
            position: "fixed",
            right: 20,
            bottom: 20,
            zIndex: 99999,
          }}
        >
          Show Keyboard
        </XpButton>
      )}

      {visible &&
        (isMobile ? (
          <div className="xp-keyboard">{keyboard}</div>
        ) : (
          <div
            style={{
              position: "fixed",
              right: 20,
              bottom: 20,
              zIndex: 99999,
            }}
          >
            <XpWindow
              title="Keyboard"
              width={260}
              onClose={() => setVisible(false)}
              contentStyle={{
                padding: 12,
              }}
            >
              {keyboard}
            </XpWindow>
          </div>
        ))}
    </>
  );
}
