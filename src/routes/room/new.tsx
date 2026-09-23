import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { generateRoomCode, type RoomMode } from "@/lib/roomEngine";
import { BetaBadge } from "@/components/BetaBadge";

export const Route = createFileRoute("/room/new")({
  head: () => ({
    meta: [
      { title: "Start a Team Session — Deep End Club" },
      { name: "description", content: "Host a live Deep End Club session your group follows on their own phones." },
      { property: "og:title", content: "Start a Team Session — Deep End Club" },
      { property: "og:description", content: "Host a live Deep End Club session for your group." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewRoom,
});

function NewRoom() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<RoomMode>("full");
  const [actions, setActions] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/" });
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  const create = async () => {
    setBusy(true);
    setError(null);
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateRoomCode();
      const { error: err } = await supabase.from("rooms").insert({
        code,
        facilitator_id: user.id,
        mode,
        actions_enabled: actions,
        status: "lobby",
      });
      if (!err) {
        navigate({ to: "/room/$code/host", params: { code } });
        return;
      }
      if (!err.message.includes("duplicate")) {
        setError("Could not create the room. Please try again.");
        break;
      }
    }
    setBusy(false);
  };

  const Opt = ({ value, title, desc }: { value: RoomMode; title: string; desc: string }) => (
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
      <div className="flex items-center justify-between">
        <Link to="/" className="text-xs font-extrabold tracking-widest text-[color:var(--navy)]">
          ← DEEP END CLUB
        </Link>
        <BetaBadge />
      </div>

      <h1 className="mt-14 font-display text-3xl font-extrabold tracking-wide text-[color:var(--navy)]">
        Start a team session.
      </h1>
      <p className="mt-2 text-[color:var(--navy)]/70">
        You host. Everyone else follows along on their own phone.
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

      {error && <p className="mt-6 text-center text-sm text-[color:var(--orange)]">{error}</p>}

      <div className="mt-12 flex justify-center">
        <button onClick={create} disabled={busy} className="btn btn-primary">
          {busy ? "Creating…" : "Create Room"}
        </button>
      </div>
    </main>
  );
}
