import { DOTS_MAP } from "@/constants/dice-settings.ts";
import cn from "@/utilities/cn.ts";

type DiceFaceProps = {
  value: number;
  transform: React.CSSProperties["transform"];
};

const DiceFace = (props: DiceFaceProps) => {
  const { value, transform } = props;

  const renderDots = () => {
    const currentDots = DOTS_MAP.get(value);

    if (!currentDots) return null;

    return currentDots.map((isFilled, idx) => {
      return (
        <div
          key={idx}
          className={cn(
            isFilled ? "bg-dice-dot rounded-full shadow-sm" : undefined,
          )}
        />
      );
    });
  };

  return (
    <div
      className="border-dice-border bg-dice absolute h-full w-full border-2 shadow-inner transition-all backface-hidden"
      style={{ transform }}
    >
      <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-1 p-4">
        {renderDots()}
      </div>
    </div>
  );
};

export default DiceFace;
