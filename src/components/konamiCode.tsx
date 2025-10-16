import { useEffect, useRef } from "react";

const konamiSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function KonamiCode() {
  const keysPressed = useRef<string[]>([]);

  const alreadyPlayed = useRef(false);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.push(e.key);
      if (keysPressed.current.length > konamiSequence.length) {
        keysPressed.current.shift();
      }
      if (
        JSON.stringify(keysPressed.current) ===
          JSON.stringify(konamiSequence) &&
        !alreadyPlayed.current
      ) {
        keysPressed.current = [];
        console.log("Konami Code entered!");
        const audio = new Audio("/cyber_battle_end.ogg");
        audio.play();
        alreadyPlayed.current = true;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <></>;
}
