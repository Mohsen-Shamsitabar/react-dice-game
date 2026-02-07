import { DOTS_MAP } from "@/constants/die-settings.ts";
import cn from "@/utilities/cn.ts";

type DieFaceProps = {
  value: number;
  transform: React.CSSProperties["transform"];
};

const DieFace = (props: DieFaceProps) => {
  const { value, transform } = props;

  const renderDots = () => {
    const currentDots = DOTS_MAP.get(value);

    if (!currentDots) return null;

    return currentDots.map((isFilled, idx) => {
      return (
        <div
          key={idx}
          className={cn(
            isFilled ? "bg-die-dot rounded-full shadow-sm" : undefined,
          )}
        />
      );
    });
  };

  return (
    <div
      className="border-die-border bg-die absolute h-full w-full border-2 shadow-inner transition-all backface-hidden"
      style={{ transform }}
    >
      <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-1 p-2">
        {renderDots()}
      </div>
    </div>
  );
};

export default DieFace;
