import { useEffect } from "react";

export default function KonamiCode() {
  let keysPressed: string[] = [];
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
  let alreadyPlayed = false;
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.push(e.key);
      if (keysPressed.length > konamiSequence.length) {
        keysPressed.shift();
      }
      if (JSON.stringify(keysPressed) === JSON.stringify(konamiSequence) && !alreadyPlayed) {
        keysPressed = [];
        console.log("Konami Code entered!");
        const audio = new Audio("/cyber_battle_end.ogg");
        audio.play();
        alreadyPlayed = true;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <></>;
}
