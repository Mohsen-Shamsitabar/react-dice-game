import { Separator } from "@/components/ui/separator.tsx";
import cn from "@/utilities/cn.ts";

const Divider = () => {
  return (
    <Separator
      className="h-24 rounded-2xl bg-black"
      orientation="vertical"
    />
  );
};

type InfoDisplayerProps = {
  contents: [string, string, string, string];
  className?: string;
};

const InfoDisplayer = (props: InfoDisplayerProps) => {
  const { contents, className } = props;

  return (
    <ol className={cn("flex flex-col items-center", className)}>
      <li className="font-medium">{contents[0]}</li>
      <li className="text-lg font-bold">{contents[1]}</li>
      <li className="text-slate-500">{contents[2]}</li>
      <li className="text-slate-500">{contents[3]}</li>
    </ol>
  );
};

const ScoreSheet = () => {
  return (
    <div className="flex flex-row items-center gap-x-2">
      <InfoDisplayer
        className="items-end! [&>:nth-child(2)]:text-blue-600"
        contents={["Player1", "0", "0", "0"]}
      />

      <Divider />

      <InfoDisplayer contents={["Goal", "8000", "Round", "Selected"]} />

      <Divider />

      <InfoDisplayer
        className="items-start! [&>:nth-child(2)]:text-red-600"
        contents={["Player2", "0", "0", "0"]}
      />
    </div>
  );
};

export default ScoreSheet;
