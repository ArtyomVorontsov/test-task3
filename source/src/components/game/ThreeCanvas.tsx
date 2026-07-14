import { useEffect, useRef } from "react";
import { Engine } from "../../three/Engine";
import { Game } from "../../logic/Game";

export default function ThreeCanvas({
  radius,
  onGameReady,
}: {
  radius: number;
  onGameReady: (game: Game) => void;
}) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const engine = new Engine(container.current, radius);

    onGameReady(engine.getGame());

    return () => {
      engine.dispose();
    };
  }, [radius]);

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
