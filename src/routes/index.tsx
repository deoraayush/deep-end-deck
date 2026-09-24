import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo, Penguin } from "@/components/brand";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deep End Club — A card game about people." },
      { name: "description", content: "A conversation card game designed to replace small talk with conversations people actually remember." },
      { property: "og:title", content: "Deep End Club" },
      { property: "og:description", content: "A card game about people." },
    ],
  }),
  component: Home,
});

function Home() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();
  const canStart = !!user && !loading;

  return (
    <main className="min-h-screen bg-background">
      {/* top bar */}
      <header className="flex items-center justify-between px-6 py-6 sm:px-12">
        <div className="text-sm font-extrabold tracking-widest text-[color:var(--navy)]">
          DEEP END CLUB
        </div>
        <div>
          {user ? (
            <button onClick={signOut} className="btn btn-ghost text-xs">
              Sign out
            </button>
          ) : (
            <button onClick={signInWithGoogle} className="btn btn-ghost text-xs">
              Sign in
            </button>
          )}
        </div>
      </header>

      {/* hero */}
      <section className="mx-auto max-w-4xl px-6 pt-12 pb-20 text-center sm:pt-20">
        <Logo className="mx-auto h-32 w-auto sm:h-48 md:h-56" />
        <p className="mt-8 font-display text-lg font-bold text-[color:var(--navy)] sm:text-xl">
          A card game about people.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <button
            disabled={!canStart}
            onClick={() => canStart && navigate({ to: "/setup" })}
            className="btn btn-primary"
          >
            Start Game
          </button>
          <button
            disabled={!canStart}
            onClick={() => canStart && navigate({ to: "/room/new" })}
            className="btn btn-orange"
          >
            Start a Team Session (beta)
          </button>
          <Link to="/how" className="btn btn-secondary">
            How It Works
          </Link>
        </div>

        {!user && !loading && (
          <p className="mt-6 text-xs text-[color:var(--muted-foreground)]">
            <button onClick={signInWithGoogle} className="underline underline-offset-4 font-semibold text-[color:var(--navy)]">
              Sign in with Google
            </button>{" "}
            to start a conversation.
          </p>
        )}
      </section>

      {/* two ways to play */}
      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-[color:var(--navy)]/15 p-6 text-[color:var(--navy)]">
          <h2 className="font-display text-xl font-extrabold tracking-wide">SINGLE DEVICE</h2>
          <p className="mt-3 leading-relaxed">
            One phone or laptop, passed around the table. Draw a card, answer it, hand it on.
            The rules and levels below apply exactly as written.
          </p>
        </div>
        <div className="rounded-2xl border-2 border-[color:var(--orange)]/40 p-6 text-[color:var(--navy)]">
          <h2 className="font-display text-xl font-extrabold tracking-wide">TEAM SESSION · BETA</h2>
          <p className="mt-3 leading-relaxed">
            One facilitator runs the deck; everyone follows the same card live on their own phone
            with just a room code — no sign-in needed. The facilitator draws cards and uses Not Yet
            for the group, and at the end can add anonymous reflections to see the themes you shared.
          </p>
        </div>
      </section>

      {/* how it works + rules */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-wide text-[color:var(--navy)]">
            HOW IT WORKS
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-[color:var(--navy)]">
            <p>Deep End Club is played in three levels.</p>
            <p>Each level gets a little more honest than the last.</p>
            <p>
              There are 80 cards in total:<br />
              20 Perception Cards<br />
              20 Connection Cards<br />
              20 Reflection Cards<br />
              20 Action Cards
            </p>
            <p>Action Cards are shuffled throughout the deck and can appear at any time.</p>
            <p>Take turns drawing cards and answering them.</p>
            <p>There are no points. Nobody wins.</p>
            <p className="font-bold">
              The goal is simple:<br />
              Have a conversation worth remembering.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-wide text-[color:var(--navy)]">
            THE RULES
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-[color:var(--navy)]">
            <div>
              <p className="font-bold">1. Say "Not Yet."</p>
              <p>Not "Pass." You're allowed to keep things private. You're allowed to take your time.</p>
            </div>
            <div>
              <p className="font-bold">2. One Skip Per Level.</p>
              <p>Everyone gets one skip per level. Use it wisely.</p>
            </div>
            <div>
              <p className="font-bold">3. No Fixing People.</p>
              <p>No advice. No lectures. No trying to solve someone's answer. Listen first.</p>
            </div>
            <div>
              <p className="font-bold">4. Respect The Silence.</p>
              <p>After a meaningful answer, wait five seconds before speaking. You'd be surprised what happens next.</p>
            </div>
            <div>
              <p className="font-bold">5. What's Said Here Stays Here.</p>
              <p>Stories leave. People don't.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="flex justify-center pb-12">
        <Penguin className="h-12 w-auto opacity-80" />
      </footer>
    </main>
  );
}
