import type { DieValue } from "@/types/die.ts";

export type GameState = {
  totalScoreGoal: number;

  firstPlayerName: string;
  firstPlayerTotalScore: number;

  secondPlayerName: string;
  secondPlayerTotalScore: number;
};

export type RoundState = {
  activePlayer: string;
  isRolling: boolean;
  selectedDice: DieValue[];

  roundScore: number;
  selectedScore: number; // can be calculated
};
