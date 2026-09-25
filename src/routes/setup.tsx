import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import type { DeckEdition } from "@/lib/cards";
import type { GameDepth } from "@/lib/gameDeck";

export interface GameConfig {
  edition: DeckEdition;
  depth: GameDepth;
  actions: boolean;
}

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Choose Your Deck — Deep End Club" },
      { name: "description", content: "Choose the Original Edition or Corporate Edition, then choose how deep to go." },
      { property: "og:title", content: "Choose Your Deck — Deep End Club" },
      { property: "og:description", content: "Original and Corporate editions of Deep End Club." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Setup,
});

const EDITIONS: Array<{ value: DeckEdition; title: string; audience: string; detail: string }> = [
  { value: "original", title: "Original Edition", audience: "Friends, families, and people", detail: "80 cards · 3 levels" },
  { value: "corporate", title: "Corporate Edition · .PDF", audience: "Teams and workplaces", detail: "55 cards · 4 levels" },
];

const ORIGINAL_DEPTHS: Array<{ depth: GameDepth; title: string; desc: string }> = [
  { depth: 1, title: "Perception Only", desc: "Level 1 · Break the ice." },
  { depth: 2, title: "Perception + Connection", desc: "Levels 1 & 2 · Go a little deeper." },
  { depth: 3, title: "Full Original Deck", desc: "Levels 1, 2 & 3 · The whole deck." },
];

const CORPORATE_DEPTHS: Array<{ depth: GameDepth; title: string; desc: string }> = [
  { depth: 1, title: "Connect", desc: "Level 1 · Beyond the job title." },
  { depth: 2, title: "Connect + Collaborate", desc: "Levels 1 & 2 · How you actually work." },
  { depth: 3, title: "Through Challenge", desc: "Levels 1–3 · Name the friction." },
  { depth: 4, title: "Full Corporate Deck", desc: "Levels 1–4 · Connect through Create." },
];

function Setup() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [edition, setEdition] = useState<DeckEdition>("original");
  const [depth, setDepth] = useState<GameDepth>(3);
  const [actions, setActions] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/" });
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  const selectEdition = (value: DeckEdition) => {
    setEdition(value);
    setDepth(value === "corporate" ? 4 : 3);
  };

  const start = () => {
    sessionStorage.setItem("dec.config", JSON.stringify({ edition, depth, actions } satisfies GameConfig));
    navigate({ to: "/play" });
  };

  const depths = edition === "corporate" ? CORPORATE_DEPTHS : ORIGINAL_DEPTHS;

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12 text-[color:var(--navy)]">
      <Link to="/" className="text-xs font-extrabold tracking-widest">← DEEP END CLUB</Link>
      <h1 className="mt-14 font-display text-3xl font-extrabold">Choose your deck.</h1>
      <p className="mt-2 opacity-70">One device, passed around. Free to play.</p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {EDITIONS.map((item) => (
          <button
            key={item.value}
            onClick={() => selectEdition(item.value)}
            className={`min-h-36 rounded-lg border-2 p-5 text-left transition ${edition === item.value ? "border-[color:var(--navy)] bg-[color:var(--navy)] text-[color:var(--paper)]" : "border-[color:var(--navy)]/20 hover:border-[color:var(--navy)]/60"}`}
          >
            <span className="font-display font-extrabold">{item.title}</span>
            <span className="mt-3 block text-sm opacity-80">{item.audience}</span>
            <span className="mt-1 block text-xs font-bold uppercase tracking-widest opacity-60">{item.detail}</span>
          </button>
        ))}
      </div>

      <h2 className="mt-12 font-display text-xl font-extrabold">Choose your depth.</h2>
      <div className="mt-4 space-y-3">
        {depths.map((item) => (
          <button
            key={item.depth}
            onClick={() => setDepth(item.depth)}
            className={`w-full rounded-lg border-2 p-5 text-left transition ${depth === item.depth ? "border-[color:var(--navy)] bg-[color:var(--navy)] text-[color:var(--paper)]" : "border-[color:var(--navy)]/20 hover:border-[color:var(--navy)]/60"}`}
          >
            <span className="font-display font-extrabold">{item.title}</span>
            <span className="mt-1 block text-sm opacity-80">{item.desc}</span>
          </button>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between rounded-lg border-2 border-[color:var(--navy)]/20 p-5">
        <div>
          <div className="font-display font-extrabold">Action Cards</div>
          <div className="text-sm opacity-70">Shuffled naturally through the deck.</div>
        </div>
        <button
          type="button"
          onClick={() => setActions((value) => !value)}
          className={`relative h-7 w-12 rounded-full transition ${actions ? "bg-[color:var(--orange)]" : "bg-[color:var(--navy)]/20"}`}
          aria-label="Toggle Action Cards"
          aria-pressed={actions}
        >
          <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-[color:var(--paper)] shadow transition ${actions ? "left-[22px]" : "left-0.5"}`} />
        </button>
      </div>

      <div className="mt-12 flex justify-center">
        <button onClick={start} className="btn btn-primary">Begin</button>
      </div>
    </main>
  );
}
