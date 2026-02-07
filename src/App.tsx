import ActionHints from "@/components/ActionHints.tsx";
import ActivePlayerDisplay from "@/components/ActivePlayerDisplay.tsx";
import ScoreSheet from "@/components/ScoreSheet.tsx";

const App = () => {
  return (
    <main className="flex size-full flex-col items-center justify-between px-8 py-16">
      <header className="select-none">
        <ActivePlayerDisplay />
      </header>

      <section className="flex flex-row items-center justify-center gap-x-16">
        <div>Dice Container 1</div>

        <div>Dice Container 2</div>
      </section>

      <footer className="flex w-full flex-row items-end justify-between">
        <section className="select-none">
          <ScoreSheet />
        </section>

        <section className="select-none">
          <ActionHints />
        </section>
      </footer>
    </main>
  );
};

export default App;
