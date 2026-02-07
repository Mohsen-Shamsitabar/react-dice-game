import { useDice } from "@/hooks/useDice.tsx";
import type { Die } from "@/types/die.ts";
import { useEffect, useMemo } from "react";

const DiceRoll = () => {
  const dice1 = useDice();
  const dice2 = useDice();
  const dice3 = useDice();
  const dice4 = useDice();
  const dice5 = useDice();
  const dice6 = useDice();

  const allDice = useMemo<Die[]>(
    () => [dice1, dice2, dice3, dice4, dice5, dice6],
    [dice1, dice2, dice3, dice4, dice5, dice6],
  );

  const renderAllDice = () => {
    return allDice.map((dice, idx) => (
      <div key={`${dice.value}-${idx}`}>{dice.DieCube}</div>
    ));
  };

  const renderAllValues = () => {
    return allDice.map((dice, idx) => (
      <span
        className="text-center"
        key={`${dice.value}-${idx}`}
      >
        {dice.value}
      </span>
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
  }, []);

  return (
    <section className="flex size-full flex-col items-center justify-center">
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-3 grid-rows-2 gap-8">
          {renderAllDice()}
        </div>

        <div className="grid grid-cols-3 grid-rows-2 gap-8">
          {renderAllValues()}
        </div>
      </div>
    </section>
  );
};

export default DiceRoll;
