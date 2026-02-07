import type { JSX } from "react";

export type Die = {
  rotateLeft: () => void;
  rotateRight: () => void;
  rotateUp: () => void;
  rotateDown: () => void;
  roll: () => void;
  DieCube: JSX.Element;
  isRolling: boolean;
  value: number;
};

export type DieState = {
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
