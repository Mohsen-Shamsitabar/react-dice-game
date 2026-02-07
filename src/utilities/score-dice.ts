/**
 * This algorithm will calculate the moves with higher length,
 * thats why we start with checking the straigth combos and finish on singles.
 *
 * This is because we are using a counter, and each time we calculate a socre,
 * we decrement the counter value for that face.
 *
 * switching the orders will cause major bugs!
 */

import type { DieValue } from "@/types/die.ts";

type ScoreResult = number;
type DieValueCounter = Record<DieValue, number>;

type StraightCombo = {
  pattern: DieValue[];
  score: number;
};

const DIE_FACES: DieValue[] = [1, 2, 3, 4, 5, 6] as const;

const PAIRS_SCORE = 1000 as const;
const TRIPLES_SCORE = 1200 as const;
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
  const pairs = DIE_FACES.filter(v => dieValueCounter[v] === 2);
  const triples = DIE_FACES.filter(v => dieValueCounter[v] === 3);

  if (pairs.length === 3) {
    pairs.forEach(v => (dieValueCounter[v]! -= 2));

    totalScore += PAIRS_SCORE;
  } else if (triples.length === 2) {
    triples.forEach(v => (dieValueCounter[v]! -= 3));

    totalScore += TRIPLES_SCORE;
  }

  // ---- 3) Of-a-kind ----
  for (let i = DIE_FACES.length - 1; i >= 0; i--) {
    const value = DIE_FACES[i]!;
    const count = dieValueCounter[value]!;

    if (count >= 3) {
      const score = scoreOfKind(value, count);

      dieValueCounter[value]! -= count;
      totalScore += score;
    }
  }

  // ---- 4) Singles (1 and 5) ----
  for (const value of [1, 5] as DieValue[]) {
    const count = dieValueCounter[value]!;

    if (count > 0) {
      const score =
        (SINGLE_SCORES[value as keyof typeof SINGLE_SCORES] ?? 0) * count;

      dieValueCounter[value]! -= count;
      totalScore += score;
    }
  }

  return totalScore;
};

export default scoreDice;
