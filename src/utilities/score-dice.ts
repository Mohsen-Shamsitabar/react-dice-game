import type { Die } from "@/types/die.ts";

type DieValue = Die["value"];
type ScoreResult = number;
type DieValueCounter = Record<DieValue, number>;

type StraightCombo = {
  pattern: DieValue[];
  score: number;
};

const DICE_FACES: DieValue[] = [1, 2, 3, 4, 5, 6] as const;

const SINGLE_SCORES = {
  1: 100,
  5: 50,
} as const;

/**
 * ***longer/higher values MUST COME first!***
 */
const STRAIGHT_COMBOS: StraightCombo[] = [
  {
    pattern: [1, 2, 3, 4, 5, 6],
    score: 1500,
  },
  {
    pattern: [2, 3, 4, 5, 6],
    score: 750,
  },
  {
    pattern: [1, 2, 3, 4, 5],
    score: 500,
  },
] as const;

const makeCounter = (dieValues: DieValue[]): DieValueCounter => {
  const counts: DieValueCounter = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

  for (const dieValue of dieValues) counts[dieValue]!++;

  return counts;
};

const scoreOfKind = (value: DieValue, count: number): number => {
  if (count < 3) return 0;

  const base = value === 1 ? 1000 : value * 100;

  let multiplier = 1;

  if (count === 4) multiplier = 2;
  else if (count === 5) multiplier = 4;
  else if (count === 6) multiplier = 8;

  return base * multiplier;
};

const scoreDice = (dice: DieValue[]): ScoreResult => {
  const dieValueCounter = makeCounter(dice);

  let totalScore = 0;

  const take = (value: DieValue, n: number, score: number): boolean => {
    if (dieValueCounter[value]! < n) return false;

    dieValueCounter[value]! -= n;
    totalScore += score;

    return true;
  };

  // ---- 1) Straights ----
  for (const straightCombo of STRAIGHT_COMBOS) {
    const { pattern, score } = straightCombo;

    const canTake = pattern.every(v => dieValueCounter[v]! >= 1);

    if (!canTake) continue;

    // consume dice
    for (const v of pattern) {
      dieValueCounter[v]!--;
    }

    totalScore += score;
    break;
  }

  // ---- 2) Special set combos ----
  const pairs = DICE_FACES.filter(v => dieValueCounter[v] === 2);
  const triples = DICE_FACES.filter(v => dieValueCounter[v] === 3);

  if (pairs.length === 3) {
    pairs.forEach(v => (dieValueCounter[v]! -= 2));

    totalScore += 1000;
  } else if (triples.length === 2) {
    triples.forEach(v => (dieValueCounter[v]! -= 3));

    totalScore += 1200;
  }

  // ---- 3) Of-a-kind ----
  for (let i = DICE_FACES.length - 1; i >= 0; i--) {
    const value = DICE_FACES[i]!;
    const count = dieValueCounter[value]!;

    if (count >= 3) {
      const score = scoreOfKind(value, count);

      take(value, count, score);
    }
  }

  // ---- 4) Singles (1 and 5) ----
  for (const v of [1, 5] as DieValue[]) {
    const count = dieValueCounter[v]!;

    if (count > 0) {
      const score =
        (SINGLE_SCORES[v as keyof typeof SINGLE_SCORES] ?? 0) * count;

      take(v, count, score);
    }
  }

  return totalScore;
};

export default scoreDice;
