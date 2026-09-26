import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { PlayingCard } from "@/components/Card";
import { type DeckEdition, type GameCard, type Level } from "@/lib/cards";
import {
  buildEditionActionPool,
  buildEditionLevelDeck,
  levelLabel,
  levelMessage,
  levelsForDepth,
  maxDepth,
} from "@/lib/gameDeck";
import type { GameConfig } from "./setup";

export const Route = createFileRoute("/play")({
  head: () => ({ meta: [{ title: "Playing — Deep End Club" }] }),
  component: Play,
});

interface LevelState {
  level: Level;
  base: GameCard[]; // remaining questions in order
  notYetUsed: boolean;
  notYetQueue: GameCard[]; // returned cards
  actionsRemaining: GameCard[];
  cardsSinceAction: number;
  totalCards: number;
  shown: number;
}

function buildLevelState(edition: DeckEdition, level: Level, actionPool: GameCard[], actionsPerLevel: number): LevelState {
  const base = buildEditionLevelDeck(edition, level);
  return {
    level,
    base,
    notYetUsed: false,
    notYetQueue: [],
    actionsRemaining: actionPool.splice(0, actionsPerLevel),
    cardsSinceAction: 0,
    totalCards: base.length,
    shown: 0,
  };
}

function Play() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [config, setConfig] = useState<GameConfig | null>(null);
  const [levels, setLevels] = useState<LevelState[]>([]);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [current, setCurrent] = useState<GameCard | null>(null);
  const [history, setHistory] = useState<GameCard[]>([]);
  const [showTransition, setShowTransition] = useState<Level | null>(null);
  const [done, setDone] = useState(false);
  const [silenceOn, setSilenceOn] = useState(false);
  const [silenceLeft, setSilenceLeft] = useState(5);
  const startedAt = useRef<number>(Date.now());

  // init
  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/" });
      return;
    }
    const raw = sessionStorage.getItem("dec.config");
    const parsed = raw ? JSON.parse(raw) : {};
    const edition: DeckEdition = parsed.edition === "corporate" ? "corporate" : "original";
    const cfg: GameConfig = {
      edition,
      depth: parsed.depth ?? maxDepth(edition),
      actions: parsed.actions ?? true,
    };
    setConfig(cfg);

    const wanted = levelsForDepth(cfg.edition, cfg.depth);
    const pool = cfg.actions ? buildEditionActionPool(cfg.edition) : [];
    const perLevel = cfg.actions ? Math.ceil(pool.length / maxDepth(cfg.edition)) : 0;
    const states = wanted.map((lv) => buildLevelState(cfg.edition, lv, pool, perLevel));
    setLevels(states);
    drawNext(states, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  function drawNext(allLevels: LevelState[], idx: number) {
    if (idx >= allLevels.length) {
      setDone(true);
      setCurrent(null);
      return;
    }
    const lv = { ...allLevels[idx] };
    const gap = 2 + Math.floor(Math.random() * 4);
    const shouldAction =
      lv.actionsRemaining.length > 0 &&
      lv.cardsSinceAction >= gap &&
      lv.base.length + lv.notYetQueue.length > 0; // never end on action

    let nextCard: GameCard | null = null;

    if (shouldAction) {
      nextCard = lv.actionsRemaining.shift()!;
      lv.cardsSinceAction = 0;
    } else if (lv.base.length > 0) {
      nextCard = lv.base.shift()!;
      lv.cardsSinceAction++;
      lv.shown++;
    } else if (lv.notYetQueue.length > 0) {
      nextCard = lv.notYetQueue.shift()!;
      lv.cardsSinceAction++;
      lv.shown++;
    } else {
      // level finished
      const updated = [...allLevels];
      updated[idx] = lv;
      setLevels(updated);
      setShowTransition(lv.level);
      setCurrent(null);
      return;
    }

    const updated = [...allLevels];
    updated[idx] = lv;
    setLevels(updated);
    setCurrentLevelIdx(idx);
    setCurrent(nextCard);
    setHistory((h) => [...h, nextCard!]);
    setSilenceOn(false);
    setSilenceLeft(5);
  }

  const next = useCallback(() => {
    if (showTransition !== null || done || !current) return;
    drawNext(levels, currentLevelIdx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levels, currentLevelIdx, showTransition, done, current]);

  const continueAfterTransition = () => {
    setShowTransition(null);
    drawNext(levels, currentLevelIdx + 1);
  };

  const useNotYet = () => {
    if (!current || current.kind !== "level") return;
    const lv = { ...levels[currentLevelIdx] };
    if (lv.notYetUsed) return;
    lv.notYetUsed = true;
    lv.notYetQueue.push(current);
    const updated = [...levels];
    updated[currentLevelIdx] = lv;
    setLevels(updated);
    drawNext(updated, currentLevelIdx);
  };

  // silence timer
  useEffect(() => {
    if (!silenceOn) return;
    if (silenceLeft <= 0) {
      setSilenceOn(false);
      return;
    }
    const t = setTimeout(() => setSilenceLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [silenceOn, silenceLeft]);

  // keyboard nav
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowRight") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [next]);

  // swipe
  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (touchStart.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (dx < -50) next();
    touchStart.current = null;
  };

  const lvState = levels[currentLevelIdx];

  const stats = useMemo(() => {
    const cardsPlayed = history.length;
    const actionDrawn = history.filter((c) => c.kind === "action").length;
    const levelsCompleted =
      done ? levels.length : Math.max(0, currentLevelIdx);
    const ms = Date.now() - startedAt.current;
    const mins = Math.max(1, Math.round(ms / 60000));
    return { cardsPlayed, actionDrawn, levelsCompleted, mins };
  }, [history, done, levels.length, currentLevelIdx]);

  if (loading || !config) return null;

  // END
  if (done) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-12 text-center text-[color:var(--navy)]">
        <p className="text-xs font-extrabold tracking-widest opacity-60">CONVERSATION COMPLETE</p>
        <h1 className="mt-6 font-display text-3xl font-extrabold sm:text-4xl">
          Thanks for showing up honestly.
        </h1>
        <div className="mt-10 grid w-full grid-cols-2 gap-6 text-left sm:grid-cols-4">
          <Stat label="Cards Played" value={stats.cardsPlayed} />
          <Stat label="Action Cards" value={stats.actionDrawn} />
          <Stat label="Levels Done" value={stats.levelsCompleted} />
          <Stat label="Minutes" value={stats.mins} />
        </div>
        <p className="mt-12 max-w-md italic">
          The goal was never to finish the deck. The goal was to leave knowing people a little better.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button onClick={() => navigate({ to: "/setup" })} className="btn btn-primary">
            Play Again
          </button>
          <Link to="/" className="btn btn-secondary">Return Home</Link>
        </div>
      </main>
    );
  }

  // LEVEL TRANSITION
  if (showTransition !== null) {
        return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center text-[color:var(--navy)]">
        <p className="text-xs font-extrabold tracking-widest opacity-60">
          LEVEL {showTransition} COMPLETE
        </p>
        <h1 className="mt-6 font-display text-3xl font-extrabold sm:text-4xl">
          {levelMessage(config.edition, showTransition)}
        </h1>
        <button onClick={continueAfterTransition} className="btn btn-primary mt-12">
          Continue →
        </button>
      </main>
    );
  }

  if (!current || !lvState) return null;

  return (
    <main className="min-h-screen bg-background">
      {/* top status */}
      <header className="flex items-center justify-between px-6 py-5 sm:px-12">
        <Link to="/" className="text-xs font-extrabold tracking-widest text-[color:var(--navy)] opacity-70 hover:opacity-100">
          ← End game
        </Link>
        <div className="text-center">
          <div className="text-xs font-extrabold tracking-widest text-[color:var(--navy)]">
            {levelLabel(config.edition, lvState.level)}
          </div>
          <div className="mt-1 text-xs text-[color:var(--navy)]/60">
            {lvState.shown} / {lvState.totalCards}
          </div>
        </div>
        <div className="text-xs font-bold text-[color:var(--navy)]/70">
          Not Yet: {lvState.notYetUsed ? 0 : 1}
        </div>
      </header>

      <div className="h-1 w-full bg-[color:var(--navy)]/10">
        <div
          className="h-full bg-[color:var(--navy)] transition-all"
          style={{ width: `${(lvState.shown / lvState.totalCards) * 100}%` }}
        />
      </div>

      {/* card */}
      <section
        className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:py-16"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          onClick={next}
          className="block w-full max-w-[640px] cursor-pointer focus:outline-none"
          aria-label="Next card"
        >
          <PlayingCard card={current} animKey={current.id + history.length} />
        </button>

        {/* silence */}
        <div className="mt-8 h-12">
          {silenceOn ? (
            <div className="text-sm text-[color:var(--navy)]/70">
              Sit with it. {silenceLeft}s
            </div>
          ) : (
            <button
              onClick={() => {
                setSilenceLeft(5);
                setSilenceOn(true);
              }}
              className="text-xs font-bold tracking-widest text-[color:var(--navy)]/60 hover:text-[color:var(--navy)]"
            >
              · SIT WITH IT ·
            </button>
          )}
        </div>

        {/* actions */}
        <div className="mt-2 flex gap-4">
          {current.kind === "level" && (
            <button
              onClick={useNotYet}
              disabled={lvState.notYetUsed}
              className="btn btn-secondary"
            >
              Not Yet
            </button>
          )}
          <button onClick={next} className="btn btn-primary">
            Next Card
          </button>
        </div>

        <p className="mt-8 text-[10px] uppercase tracking-widest text-[color:var(--navy)]/40">
          Tap card · Swipe · Space · →
        </p>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="font-display text-3xl font-extrabold">{value}</div>
      <div className="text-xs font-bold uppercase tracking-widest opacity-60">{label}</div>
    </div>
  );
}
