import { createFileRoute, Link } from "@tanstack/react-router";
import { Penguin } from "@/components/brand";

export const Route = createFileRoute("/how")({
  head: () => ({
    meta: [
      { title: "How It Works — Deep End Club" },
      { name: "description", content: "Three levels. Eighty cards. One conversation worth remembering." },
    ],
  }),
  component: How,
});

function How() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      <Link to="/" className="text-xs font-extrabold tracking-widest text-[color:var(--navy)]">
        ← DEEP END CLUB
      </Link>

      <div className="mt-16 space-y-12 text-[color:var(--navy)]">
        <section>
          <h2 className="font-display text-2xl font-extrabold tracking-wide">LEVEL 1  PERCEPTION</h2>
          <p className="mt-2 font-bold">Break the ice.</p>
          <p className="mt-2">Opinions, habits, beliefs, and contradictions.</p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-extrabold tracking-wide">LEVEL 2  CONNECTION</h2>
          <p className="mt-2 font-bold">The people level.</p>
          <p className="mt-2">Friendships, family, rejection, validation, and everything in between.</p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-extrabold tracking-wide">LEVEL 3  REFLECTION</h2>
          <p className="mt-2 font-bold">The growth level.</p>
          <p className="mt-2">Where you've been, where you're going, and what changed along the way.</p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-extrabold tracking-wide">ACTION CARDS</h2>
          <p className="mt-2">Action Cards can appear at any time. When they do, complete the action before continuing.</p>
          <p className="mt-2 font-bold">No skipping.</p>
        </section>

        <section className="border-t pt-10">
          <h2 className="font-display text-2xl font-extrabold tracking-wide">WHO'S IT FOR?</h2>
          <p className="mt-4 leading-relaxed">
            Friends. Strangers. Roommates. Families. People who just met. People who've known each other forever.
          </p>
        </section>
      </div>

      <div className="mt-16 flex flex-col items-center gap-6">
        <Penguin className="h-12 w-auto opacity-80" />
        <Link to="/" className="btn btn-secondary">Back home</Link>
      </div>
    </main>
  );
}
