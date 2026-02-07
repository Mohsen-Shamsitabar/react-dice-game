import DieFace from "@/components/DieFace.tsx";
import {
  DIE_SIZE,
  INITIAL_STATE,
  MAX_QUEUE_LENGTH,
} from "@/constants/die-settings.ts";
import type { Die, Move, Rotation } from "@/types/die.ts";
import assertNever from "@/utilities/assert-never.ts";
import cn from "@/utilities/cn.ts";
import getFacesByMove from "@/utilities/get-faces-by-move.ts";
import { useMemo, useReducer, useRef, useState } from "react";

export const useDie = (): Die => {
  const [faces, updateFacesByMove] = useReducer(getFacesByMove, INITIAL_STATE);

  const [rotation, setRotation] = useState<Rotation>({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  const moveQueue = useRef<Move[]>([]);
  const activeMove = useRef<Move | null>(null);
  const maxQueueLength = useRef<number>(MAX_QUEUE_LENGTH);

  const playNextMove = () => {
    if (moveQueue.current.length <= 0) {
      setIsRolling(false);
      return;
    }

    const nextMove = moveQueue.current.shift();

    if (!nextMove) {
      setIsRolling(false);
      return;
    }

    activeMove.current = nextMove;
    setIsAnimating(true);

    switch (nextMove) {
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
        assertNever(nextMove);
    }
  };

  const handleTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>,
  ) => {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "transform") return;

    const finishedMove = activeMove.current;

    activeMove.current = null;

    if (!finishedMove) return;

    setIsAnimating(false);
    updateFacesByMove(finishedMove);
    setRotation({ x: 0, y: 0 });

    setTimeout(() => {
      playNextMove();
    }, 50);
  };

  const addMoveToQueue = (move: Move) => {
    if (moveQueue.current.length >= maxQueueLength.current) return;

    moveQueue.current.push(move);

    if (isRolling) return;
    playNextMove();
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
    playNextMove();
    setIsRolling(true);
  };

  const DieCube = useMemo(() => {
    const halfSize = DIE_SIZE / 2;

    return (
      <div className="perspective-1000 relative select-none">
        <div
          className={cn(
            "transform-style-3d relative aspect-square size-full",
            isAnimating
              ? "transition-transform duration-200 ease-in-out"
              : "transition-none",
          )}
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            width: `${DIE_SIZE}px`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          <DieFace
            value={faces.front}
            transform={`translateZ(${halfSize}px)`}
          />
          <DieFace
            value={faces.back}
            transform={`rotateY(180deg) translateZ(${halfSize}px)`}
          />
          <DieFace
            value={faces.right}
            transform={`rotateY(90deg) translateZ(${halfSize}px)`}
          />
          <DieFace
            value={faces.left}
            transform={`rotateY(-90deg) translateZ(${halfSize}px)`}
          />
          <DieFace
            value={faces.top}
            transform={`rotateX(90deg) translateZ(${halfSize}px)`}
          />
          <DieFace
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
    DieCube,
  };
};
