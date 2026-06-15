import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

export type GameMode = "perception" | "perception_connection" | "full";

export interface GameConfig {
  mode: GameMode;
  actions: boolean;
}

export const Route = createFileRoute("/setup")({
  head: () => ({ meta: [{ title: "Setup — Deep End Club" }] }),
  component: Setup,
});

function Setup() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<GameMode>("full");
  const [actions, setActions] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/" });
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  const start = () => {
    const cfg: GameConfig = { mode, actions };
    sessionStorage.setItem("dec.config", JSON.stringify(cfg));
    navigate({ to: "/play" });
  };

  const Opt = ({ value, title, desc }: { value: GameMode; title: string; desc: string }) => (
    <button
      onClick={() => setMode(value)}
      className={`w-full rounded-2xl border-2 p-5 text-left transition ${
        mode === value
          ? "border-[color:var(--navy)] bg-[color:var(--navy)] text-white"
          : "border-[color:var(--navy)]/20 text-[color:var(--navy)] hover:border-[color:var(--navy)]/60"
      }`}
    >
      <div className="font-display font-extrabold tracking-wide">{title}</div>
      <div className="mt-1 text-sm opacity-80">{desc}</div>
    </button>
  );

  return (
    <main className="mx-auto min-h-screen max-w-xl px-6 py-12">
      <Link to="/" className="text-xs font-extrabold tracking-widest text-[color:var(--navy)]">
        ← DEEP END CLUB
      </Link>

      <h1 className="mt-14 font-display text-3xl font-extrabold tracking-wide text-[color:var(--navy)]">
        Choose your depth.
      </h1>
      <p className="mt-2 text-[color:var(--navy)]/70">
        Cards always progress: Level 1 → Level 2 → Level 3.
      </p>

      <div className="mt-10 space-y-3">
        <Opt value="perception" title="Perception Only" desc="Level 1 · Break the ice." />
        <Opt value="perception_connection" title="Perception + Connection" desc="Levels 1 & 2 · Go a little deeper." />
        <Opt value="full" title="Full Game" desc="Levels 1, 2 & 3 · The whole deck." />
      </div>

      <label className="mt-10 flex items-center justify-between rounded-2xl border-2 border-[color:var(--navy)]/20 p-5">
        <div>
          <div className="font-display font-extrabold tracking-wide text-[color:var(--navy)]">
            Action Cards
          </div>
          <div className="text-sm text-[color:var(--navy)]/70">
            Shuffled naturally through the deck.
          </div>
        </div>
        <button
          onClick={() => setActions((v) => !v)}
          className={`relative h-7 w-12 rounded-full transition ${actions ? "bg-[color:var(--orange)]" : "bg-[color:var(--navy)]/20"}`}
          aria-pressed={actions}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${actions ? "left-[22px]" : "left-0.5"}`}
          />
        </button>
      </label>

      <div className="mt-12 flex justify-center">
        <button onClick={start} className="btn btn-primary">Begin</button>
      </div>
    </main>
  );
}
