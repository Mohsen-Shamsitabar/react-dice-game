import DiceFace from "@/components/DiceFace.tsx";
import { DICE_SIZE } from "@/constants/dice-settings.ts";
import type { Dice, DiceState, Move, Rotation } from "@/types/dice.ts";
import assertNever from "@/utilities/assert-never.ts";
import cn from "@/utilities/cn.ts";
import { useMemo, useReducer, useRef, useState } from "react";

const INITIAL_STATE: DiceState = {
  front: 1,
  right: 2,
  back: 6,
  left: 5,
  top: 3,
  bottom: 4,
};

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

export const useDice = (): Dice => {
  const [faces, updateFacesByMove] = useReducer(getFacesByMove, INITIAL_STATE);

  const [rotation, setRotation] = useState<Rotation>({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  const moveQueue = useRef<Move[]>([]);
  const activeMove = useRef<Move | null>(null);
  const maxQueueLength = useRef<number>(64);

  const playNext = () => {
    if (moveQueue.current.length <= 0) {
      setIsRolling(false);
      return;
    }

    const next = moveQueue.current.shift();

    if (!next) {
      setIsRolling(false);
      return;
    }

    activeMove.current = next;
    setIsAnimating(true);

    switch (next) {
      case "LEFT":
        setRotation({ x: 0, y: -90 });
        return;
      case "RIGHT":
        setRotation({ x: 0, y: 90 });
        return;
      case "UP":
        setRotation({ x: 90, y: 0 });
        return;
      case "DOWN":
        setRotation({ x: -90, y: 0 });
        return;
      default:
        assertNever(next);
    }
  };

  const handleTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>,
  ) => {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "transform") return;

    const move = activeMove.current;

    activeMove.current = null;

    if (!move) return;

    setIsAnimating(false);
    updateFacesByMove(move);
    setRotation({ x: 0, y: 0 });

    setTimeout(() => {
      playNext();
    }, 50);
  };

  const addMoveToQueue = (move: Move) => {
    if (moveQueue.current.length >= maxQueueLength.current) return;

    moveQueue.current.push(move);

    if (isRolling) return;
    playNext();
    setIsRolling(true);
  };

  const roll = () => {
    if (moveQueue.current.length >= maxQueueLength.current) return;

    const MOVE_COUNT = 10;

    for (let i = 0; i < MOVE_COUNT; i++) {
      const rngNum = Math.random() * 3;

      if (rngNum >= 2.25) {
        moveQueue.current.push("DOWN");
        continue;
      }

      if (rngNum < 2.25 && rngNum >= 1.5) {
        moveQueue.current.push("LEFT");
        continue;
      }

      if (rngNum < 1.5 && rngNum >= 0.75) {
        moveQueue.current.push("RIGHT");
        continue;
      }

      moveQueue.current.push("UP");
    }

    if (isRolling) return;
    playNext();
    setIsRolling(true);
  };

  const DiceCube = useMemo(() => {
    const halfSize = DICE_SIZE / 2;

    return (
      <div className="perspective-1000 relative">
        <div
          className={cn(
            "transform-style-3d relative aspect-square size-full",
            isAnimating
              ? "transition-transform duration-200 ease-in-out"
              : "transition-none",
          )}
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            width: `${DICE_SIZE}px`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          <DiceFace
            value={faces.front}
            transform={`translateZ(${halfSize}px)`}
          />
          <DiceFace
            value={faces.back}
            transform={`rotateY(180deg) translateZ(${halfSize}px)`}
          />
          <DiceFace
            value={faces.right}
            transform={`rotateY(90deg) translateZ(${halfSize}px)`}
          />
          <DiceFace
            value={faces.left}
            transform={`rotateY(-90deg) translateZ(${halfSize}px)`}
          />
          <DiceFace
            value={faces.top}
            transform={`rotateX(90deg) translateZ(${halfSize}px)`}
          />
          <DiceFace
            value={faces.bottom}
            transform={`rotateX(-90deg) translateZ(${halfSize}px)`}
          />
        </div>
      </div>
    );
  }, [faces, rotation, handleTransitionEnd]);

  return {
    rotateLeft: () => addMoveToQueue("LEFT"),
    rotateRight: () => addMoveToQueue("RIGHT"),
    rotateUp: () => addMoveToQueue("UP"),
    rotateDown: () => addMoveToQueue("DOWN"),
    roll,
    isRolling,
    value: faces.front,
    DiceCube,
  };
};
