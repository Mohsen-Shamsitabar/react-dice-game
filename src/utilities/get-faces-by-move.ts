import type { DiceState, Move } from "@/types/dice.ts";
import assertNever from "@/utilities/assert-never.ts";

const getFacesByMove = (state: DiceState, move: Move): DiceState => {
  switch (move) {
    case "LEFT":
      return {
        ...state,
        front: state.right,
        left: state.front,
        back: state.left,
        right: state.back,
      };

    case "RIGHT":
      return {
        ...state,
        front: state.left,
        right: state.front,
        back: state.right,
        left: state.back,
      };

    case "UP":
      return {
        ...state,
        front: state.bottom,
        top: state.front,
        back: state.top,
        bottom: state.back,
      };

    case "DOWN":
      return {
        ...state,
        front: state.top,
        bottom: state.front,
        back: state.bottom,
        top: state.back,
      };

    default:
      return assertNever(move);
  }
};

export default getFacesByMove;
