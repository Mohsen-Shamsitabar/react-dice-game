import type { JSX } from "react";

export type Dice = {
  rotateLeft: () => void;
  rotateRight: () => void;
  rotateUp: () => void;
  rotateDown: () => void;
  roll: () => void;
  DiceCube: JSX.Element;
  isRolling: boolean;
  value: number;
};

export type DiceState = {
  front: number;
  back: number;
  right: number;
  left: number;
  top: number;
  bottom: number;
};

export type Move = "LEFT" | "RIGHT" | "UP" | "DOWN";

export type Rotation = {
  x: number;
  y: number;
};
