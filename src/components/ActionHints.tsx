type ActionHintProps = {
  title: string;
  hotkey: string;
};

const ActionHint = (props: ActionHintProps) => {
  const { title, hotkey } = props;

  return (
    <li className="flex flex-row items-center justify-end gap-x-2">
      <span>{title}</span>

      <span className="flex aspect-square w-6 items-center justify-center rounded-full border border-slate-400 bg-slate-200 text-sm font-medium">
        {hotkey}
      </span>
    </li>
  );
};

const ActionHints = () => {
  return (
    <ol className="flex flex-col gap-y-2">
      <ActionHint
        title="Help"
        hotkey="H"
      />
      <ActionHint
        title="Score & continue"
        hotkey="Q"
      />
      <ActionHint
        title="Score & pass"
        hotkey="E"
      />
      <ActionHint
        title="Give up"
        hotkey="G"
      />
    </ol>
  );
};

export default ActionHints;
