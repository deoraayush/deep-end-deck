import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { PlayingCard } from "@/components/Card";
import { BetaBadge } from "@/components/BetaBadge";
import { LEVEL_LABELS, type GameCard, type Level } from "@/lib/cards";
import {
  buildAllLevels,
  drawNext,
  LEVEL_MESSAGES,
  type LevelState,
  type RoomMode,
} from "@/lib/roomEngine";

export const Route = createFileRoute("/room/$code/host")({
  head: () => ({
    meta: [
      { title: "Host a Team Session — Deep End Club" },
      { name: "description", content: "Control the deck while your group follows along live." },
      { property: "og:title", content: "Host a Team Session — Deep End Club" },
      { property: "og:description", content: "Control the deck while your group follows along live." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Host,
});

interface RoomRow {
  id: string;
  code: string;
  facilitator_id: string;
  mode: string;
  actions_enabled: boolean;
  status: string;
  current_card: GameCard | null;
  current_level: number | null;
  cards_shown: number;
}

function Host() {
  const { code } = useParams({ from: "/room/$code/host" });
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState<RoomRow | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [participants, setParticipants] = useState<{ id: string; display_name: string }[]>([]);
  const [levels, setLevels] = useState<LevelState[]>([]);
  const [levelIdx, setLevelIdx] = useState(0);
  const [current, setCurrent] = useState<GameCard | null>(null);
  const [history, setHistory] = useState<GameCard[]>([]);
  const [transition, setTransition] = useState<Level | null>(null);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/" });
  }, [user, loading, navigate]);

  // load room
  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      const { data } = await supabase.from("rooms").select("*").eq("code", code).maybeSingle();
      if (!active) return;
      if (!data) {
        setNotFound(true);
        return;
      }
      setRoom(data as unknown as RoomRow);
    })();
    return () => {
      active = false;
    };
  }, [code, user]);

  // build deck once the room is loaded
  useEffect(() => {
    if (!room || levels.length > 0) return;
    setLevels(buildAllLevels(room.mode as RoomMode, room.actions_enabled));
  }, [room, levels.length]);

  // participants + realtime
  useEffect(() => {
    if (!room) return;
    const load = async () => {
      const { data } = await supabase
        .from("room_participants")
        .select("id, display_name")
        .eq("room_id", room.id)
        .order("joined_at", { ascending: true });
      setParticipants(data ?? []);
    };
    load();
    const channel = supabase
      .channel(`host-${room.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room_participants", filter: `room_id=eq.${room.id}` },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [room]);

  const pushState = useCallback(
    async (patch: Record<string, unknown>) => {
      if (!room) return;
      await supabase.from("rooms").update(patch).eq("id", room.id);
    },
    [room],
  );

  const applyDraw = useCallback(
    (all: LevelState[], idx: number) => {
      const res = drawNext(all, idx);
      if (res.type === "done") {
        setDone(true);
        setCurrent(null);
        pushState({ status: "finished", current_card: null });
        return;
      }
      if (res.type === "level-complete") {
        setLevels(res.levels);
        setTransition(res.level);
        setCurrent(null);
        return;
      }
      setLevels(res.levels);
      setLevelIdx(res.index);
      setCurrent(res.card);
      setHistory((h) => [...h, res.card]);
      pushState({
        status: "active",
        current_card: res.card as unknown as Record<string, unknown>,
        current_level: res.levels[res.index].level,
        cards_shown: history.length + 1,
      });
    },
    [pushState, history.length],
  );

  // first card
  const started = useRef(false);
  const start = () => {
    if (started.current || levels.length === 0) return;
    started.current = true;
    applyDraw(levels, 0);
  };

  const next = () => {
    if (transition !== null || done || !current) return;
    applyDraw(levels, levelIdx);
  };

  const continueAfterTransition = () => {
    setTransition(null);
    applyDraw(levels, levelIdx + 1);
  };

  const useNotYet = () => {
    if (!current || current.kind !== "level") return;
    const lv = { ...levels[levelIdx] };
    if (lv.notYetUsed) return;
    lv.notYetUsed = true;
    lv.notYetQueue = [...lv.notYetQueue, current];
    const updated = [...levels];
    updated[levelIdx] = lv;
    setLevels(updated);
    applyDraw(updated, levelIdx);
  };

  const stats = useMemo(() => {
    const cardsPlayed = history.length;
    const actionDrawn = history.filter((c) => c.kind === "action").length;
    const levelsCompleted = done ? levels.length : Math.max(0, levelIdx);
    const mins = Math.max(1, Math.round((Date.now() - startedAt.current) / 60000));
    return { cardsPlayed, actionDrawn, levelsCompleted, mins };
  }, [history, done, levels.length, levelIdx]);

  const joinLink =
    typeof window !== "undefined" ? `${window.location.origin}/room/${code}` : `/room/${code}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (loading || !user) return null;

  if (notFound) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center text-[color:var(--navy)]">
        <h1 className="font-display text-2xl font-extrabold">That room doesn't exist.</h1>
        <Link to="/room/new" className="btn btn-primary">Start a new one</Link>
      </main>
    );
  }

  if (!room) return null;

  if (room.facilitator_id !== user.id) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center text-[color:var(--navy)]">
        <h1 className="font-display text-2xl font-extrabold">This room belongs to someone else.</h1>
        <Link to="/room/$code" params={{ code }} className="btn btn-secondary">Join as a player</Link>
      </main>
    );
  }

  const Panel = (
    <aside className="rounded-2xl border-2 border-[color:var(--navy)]/15 p-5 text-[color:var(--navy)]">
      <div className="text-xs font-extrabold uppercase tracking-widest opacity-60">Room Code</div>
      <div className="mt-1 font-display text-4xl font-extrabold tracking-[0.2em]">{room.code}</div>
      <button onClick={copyLink} className="btn btn-secondary mt-4 w-full text-xs">
        {copied ? "Link copied" : "Copy join link"}
      </button>
      <div className="mt-6 text-xs font-extrabold uppercase tracking-widest opacity-60">
        In the room · {participants.length}
      </div>
      <ul className="mt-2 space-y-1 text-sm">
        {participants.length === 0 && <li className="opacity-60">Nobody has joined yet.</li>}
        {participants.map((p) => (
          <li key={p.id}>{p.display_name}</li>
        ))}
      </ul>
    </aside>
  );

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
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/room/new" className="btn btn-primary">New Team Session</Link>
          <Link to="/" className="btn btn-secondary">Return Home</Link>
        </div>
      </main>
    );
  }

  if (transition !== null) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center text-[color:var(--navy)]">
        <p className="text-xs font-extrabold tracking-widest opacity-60">
          LEVEL {transition} COMPLETE
        </p>
        <h1 className="mt-6 font-display text-3xl font-extrabold sm:text-4xl">
          {LEVEL_MESSAGES[transition]}
        </h1>
        <button onClick={continueAfterTransition} className="btn btn-primary mt-12">
          Continue →
        </button>
      </main>
    );
  }

  const lvState = levels[levelIdx];

  return (
    <main className="min-h-screen bg-background">
      <header className="flex items-center justify-between gap-4 px-6 py-5 sm:px-12">
        <Link to="/" className="text-xs font-extrabold tracking-widest text-[color:var(--navy)] opacity-70 hover:opacity-100">
          ← End session
        </Link>
        {lvState && current && (
          <div className="text-center">
            <div className="text-xs font-extrabold tracking-widest text-[color:var(--navy)]">
              {LEVEL_LABELS[lvState.level]}
            </div>
            <div className="mt-1 text-xs text-[color:var(--navy)]/60">
              {lvState.shown} / {lvState.totalCards}
            </div>
          </div>
        )}
        <BetaBadge />
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 md:grid-cols-[1fr_280px]">
        <div className="flex flex-col items-center">
          {current ? (
            <>
              <PlayingCard card={current} animKey={current.id + history.length} />
              <div className="mt-8 flex gap-4">
                {current.kind === "level" && (
                  <button
                    onClick={useNotYet}
                    disabled={lvState?.notYetUsed}
                    className="btn btn-secondary"
                  >
                    Not Yet
                  </button>
                )}
                <button onClick={next} className="btn btn-primary">Next Card</button>
              </div>
              <p className="mt-6 text-[10px] uppercase tracking-widest text-[color:var(--navy)]/40">
                Everyone in the room sees this card live
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center py-16 text-center text-[color:var(--navy)]">
              <h1 className="font-display text-3xl font-extrabold">Waiting in the lobby.</h1>
              <p className="mt-3 max-w-sm text-[color:var(--navy)]/70">
                Share the room code, then begin when everyone is in.
              </p>
              <button onClick={start} className="btn btn-primary mt-10" disabled={levels.length === 0}>
                Begin Session
              </button>
            </div>
          )}
        </div>
        {Panel}
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
