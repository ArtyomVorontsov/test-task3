import { useState } from "react";
import { GameScreen } from "./components/game/GameScreen";
import { Menu } from "./components/menu/Menu";

export default function App() {
  const [size, setSize] = useState<number | null>(null);

  if (size === null) {
    return <Menu onStart={(value) => setSize(value)} />;
  }

  return <GameScreen size={size} onExit={() => setSize(null)} />;
}
