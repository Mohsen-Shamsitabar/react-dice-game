import type { DieState } from "@/types/die.ts";

export const DICE_SIZE = 128;

export const DOTS_MAP = new Map<number, boolean[]>([
  [1, [false, false, false, false, true, false, false, false, false]],
  [2, [true, false, false, false, false, false, false, false, true]],
  [3, [true, false, false, false, true, false, false, false, true]],
  [4, [true, false, true, false, false, false, true, false, true]],
  [5, [true, false, true, false, true, false, true, false, true]],
  [6, [true, false, true, true, false, true, true, false, true]],
]);

export const MAX_QUEUE_LENGTH = 63;

export const INITIAL_STATE: DieState = {
  front: 1,
  right: 2,
  back: 6,
  left: 5,
  top: 3,
  bottom: 4,
};
