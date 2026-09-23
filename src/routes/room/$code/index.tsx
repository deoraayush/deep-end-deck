import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PlayingCard } from "@/components/Card";
import { Penguin } from "@/components/brand";
import { LEVEL_LABELS, type GameCard, type Level } from "@/lib/cards";

export const Route = createFileRoute("/room/$code/")({
  head: () => ({
    meta: [
      { title: "Join a Team Session — Deep End Club" },
      { name: "description", content: "Follow along live as your host draws Deep End Club cards." },
      { property: "og:title", content: "Join a Team Session — Deep End Club" },
      { property: "og:description", content: "Follow along live as your host draws Deep End Club cards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: JoinRoom,
});

interface RoomRow {
  id: string;
  code: string;
  status: string;
  mode: string;
  current_card: GameCard | null;
  current_level: number | null;
  cards_shown: number;
}

function JoinRoom() {
  const { code } = useParams({ from: "/room/$code/" });
  const [room, setRoom] = useState<RoomRow | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("rooms")
        .select("id, code, status, mode, current_card, current_level, cards_shown")
        .eq("code", code.toUpperCase())
        .maybeSingle();
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
  }, [code]);

  // realtime room + participants
  useEffect(() => {
    if (!room) return;
    const loadCount = async () => {
      const { count: c } = await supabase
        .from("room_participants")
        .select("id", { count: "exact", head: true })
        .eq("room_id", room.id);
      setCount(c ?? 0);
    };
    loadCount();
    const channel = supabase
      .channel(`room-${room.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "rooms", filter: `id=eq.${room.id}` },
        (payload) => setRoom((r) => (r ? { ...r, ...(payload.new as Partial<RoomRow>) } : r)),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room_participants", filter: `room_id=eq.${room.id}` },
        () => loadCount(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [room?.id]);

  // remember this device already joined
  useEffect(() => {
    if (!room) return;
    if (sessionStorage.getItem(`dec.room.${room.id}`)) setJoined(true);
  }, [room]);

  const join = async () => {
    if (!room || !name.trim()) return;
    setBusy(true);
    const { error } = await supabase
      .from("room_participants")
      .insert({ room_id: room.id, display_name: name.trim().slice(0, 40) });
    setBusy(false);
    if (!error) {
      sessionStorage.setItem(`dec.room.${room.id}`, name.trim());
      setJoined(true);
    }
  };

  if (notFound) {
    return (
      <Shell>
        <h1 className="font-display text-2xl font-extrabold">That room code doesn't exist.</h1>
        <p className="mt-3 text-[color:var(--navy)]/70">Double-check the code with your host.</p>
        <Link to="/" className="btn btn-secondary mt-8">Return Home</Link>
      </Shell>
    );
  }

  if (!room) return null;

  if (room.status === "finished") {
    return (
      <Shell>
        <p className="text-xs font-extrabold tracking-widest opacity-60">SESSION COMPLETE</p>
        <h1 className="mt-6 font-display text-3xl font-extrabold">Thanks for playing.</h1>
        <p className="mt-4 max-w-md text-[color:var(--navy)]/70">
          The goal was never to finish the deck. The goal was to leave knowing people a little better.
        </p>
        <Penguin className="mt-10 h-12 w-auto opacity-80" />
        <Link to="/" className="btn btn-secondary mt-8">Return Home</Link>
      </Shell>
    );
  }

  if (!joined) {
    return (
      <Shell>
        <p className="text-xs font-extrabold tracking-widest opacity-60">ROOM {room.code}</p>
        <h1 className="mt-6 font-display text-3xl font-extrabold">What should we call you?</h1>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && join()}
          placeholder="Your name"
          maxLength={40}
          className="mt-8 w-full max-w-sm rounded-2xl border-2 border-[color:var(--navy)]/20 px-5 py-4 text-center font-display text-lg font-bold text-[color:var(--navy)] outline-none focus:border-[color:var(--navy)]"
        />
        <button onClick={join} disabled={busy || !name.trim()} className="btn btn-primary mt-6">
          {busy ? "Joining…" : "Join Room"}
        </button>
      </Shell>
    );
  }

  if (room.status === "lobby" || !room.current_card) {
    return (
      <Shell>
        <p className="text-xs font-extrabold tracking-widest opacity-60">ROOM {room.code}</p>
        <h1 className="mt-6 font-display text-3xl font-extrabold">You're in.</h1>
        <p className="mt-3 text-[color:var(--navy)]/70">
          Waiting for your host to start · {count} here
        </p>
        <Penguin className="mt-10 h-12 w-auto animate-pulse opacity-80" />
      </Shell>
    );
  }

  const level = room.current_level as Level | null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-10">
      <div className="mb-6 text-center">
        <div className="text-xs font-extrabold tracking-widest text-[color:var(--navy)]">
          {level ? LEVEL_LABELS[level] : "DEEP END CLUB"}
        </div>
        <div className="mt-1 text-xs text-[color:var(--navy)]/60">Room {room.code} · {count} playing</div>
      </div>
      <PlayingCard card={room.current_card} animKey={room.current_card.id + room.cards_shown} />
      <p className="mt-8 text-[10px] uppercase tracking-widest text-[color:var(--navy)]/40">
        Your host controls the deck
      </p>
    </main>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center text-[color:var(--navy)]">
      {children}
    </main>
  );
}
