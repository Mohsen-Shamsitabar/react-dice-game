import { useDie } from "@/hooks/useDie.tsx";
import type { Die } from "@/types/die.ts";
import { useEffect, useMemo } from "react";

const DiceRoll = () => {
  const dice1 = useDie();
  const dice2 = useDie();
  const dice3 = useDie();
  const dice4 = useDie();
  const dice5 = useDie();
  const dice6 = useDie();

  const allDice = useMemo<Die[]>(
    () => [dice1, dice2, dice3, dice4, dice5, dice6],
    [dice1, dice2, dice3, dice4, dice5, dice6],
  );

  const renderAllDice = () => {
    return allDice.map((dice, idx) => (
      <div key={`${dice.value}-${idx}`}>{dice.DieCube}</div>
    ));
  };

  const rollAllDice = () => {
    allDice.forEach(dice => dice.roll());
  };

  useEffect(() => {
    const handleKeypress = (event: KeyboardEvent) => {
      const key = event.key;

      if (key === " ") {
        rollAllDice();
      }
    };

    window.addEventListener("keypress", handleKeypress);

    return () => {
      window.removeEventListener("keypress", handleKeypress);
    };
  }, [rollAllDice]);

  return (
    <section className="flex size-full flex-col items-center justify-center">
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-3 grid-rows-2 gap-4">
          {renderAllDice()}
        </div>
      </div>
    </section>
  );
};

export default DiceRoll;
