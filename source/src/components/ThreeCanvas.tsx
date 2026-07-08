import { useEffect, useRef } from "react";
import { Engine } from "../three/Engine";

export default function ThreeCanvas() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) {
      return;
    }

    const engine = new Engine(container.current);

    return () => {
      engine.dispose();
    };
  }, []);

  return (
    <div
      ref={container}
      style={{
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
