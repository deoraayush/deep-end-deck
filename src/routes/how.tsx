import { createFileRoute, Link } from "@tanstack/react-router";
import { Penguin } from "@/components/brand";

export const Route = createFileRoute("/how")({
  head: () => ({
    meta: [
      { title: "How to Play — Deep End Club" },
      { name: "description", content: "Rules for the Original Edition and Corporate Edition of Deep End Club." },
      { property: "og:title", content: "How to Play — Deep End Club" },
      { property: "og:description", content: "Original Edition and Corporate Edition rules, clearly separated." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: How,
});

const originalLevels = [
  ["LEVEL 1 · PERCEPTION", "Break the ice.", "Opinions, habits, beliefs, and contradictions."],
  ["LEVEL 2 · CONNECTION", "The people level.", "Friendships, family, rejection, validation, and everything in between."],
  ["LEVEL 3 · REFLECTION", "The growth level.", "Where you've been, where you're going, and what changed along the way."],
];
const corporateLevels = [
  ["LEVEL 1 · CONNECT", "Break the ice.", "Who you are beyond the job title."],
  ["LEVEL 2 · COLLABORATE", "The working level.", "Habits, feedback, working styles, and how people actually operate."],
  ["LEVEL 3 · CHALLENGE", "The friction level.", "The things that slow teams down but rarely get said out loud."],
  ["LEVEL 4 · CREATE", "The ambition level.", "Where you'd take things, what you'd build, and what you'd change."],
];

function LevelList({ levels }: { levels: string[][] }) {
  return <div className="mt-8 grid gap-8 sm:grid-cols-2">{levels.map(([title, lead, text]) => <div key={title}><h3 className="font-display text-lg font-extrabold">{title}</h3><p className="mt-2 font-bold">{lead}</p><p className="mt-1 leading-relaxed opacity-80">{text}</p></div>)}</div>;
}

function How() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-14 text-[color:var(--navy)]">
      <Link to="/" className="text-xs font-extrabold tracking-widest">← DEEP END CLUB</Link>
      <h1 className="mt-14 font-display text-4xl font-extrabold">Two decks. Two kinds of conversation.</h1>

      <section className="mt-16 border-t-2 border-[color:var(--navy)] pt-10">
        <p className="text-xs font-extrabold uppercase tracking-widest opacity-60">Friends, families, and people</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold">Original Edition</h2>
        <p className="mt-4 max-w-2xl leading-relaxed">Played in three levels. There are 80 cards: 20 Perception, 20 Connection, 20 Reflection, and 20 Action Cards. Take turns drawing and answering. There are no points. Nobody wins.</p>
        <p className="mt-4 font-bold">The goal: Have a conversation worth remembering.</p>
        <LevelList levels={originalLevels} />
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div><h3 className="font-display text-xl font-extrabold">WHO IT'S FOR</h3><p className="mt-3 leading-relaxed">Friends. Strangers. Roommates. Families. People who just met. People who've known each other forever.</p></div>
          <div><h3 className="font-display text-xl font-extrabold">THE RULES</h3><ol className="mt-3 list-decimal space-y-3 pl-5 leading-relaxed"><li><strong>Say “Not Yet.”</strong> Not “Pass.” You're allowed to keep things private and take your time.</li><li><strong>One Skip Per Level.</strong> Everyone gets one skip per level. Use it wisely.</li><li><strong>No Fixing People.</strong> No advice, lectures, or trying to solve someone's answer. Listen first.</li><li><strong>Respect The Silence.</strong> After a meaningful answer, wait five seconds before speaking.</li><li><strong>What's Said Here Stays Here.</strong> Stories leave. People don't.</li></ol></div>
        </div>
      </section>

      <section className="mt-20 border-t-2 border-[color:var(--orange)] pt-10">
        <p className="text-xs font-extrabold uppercase tracking-widest text-[color:var(--orange)]">Teams and workplaces</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold">Corporate Edition · .PDF</h2>
        <p className="mt-4 max-w-2xl leading-relaxed">Played in four levels. There are 55 cards: 10 Connect, 10 Collaborate, 10 Challenge, 10 Create, and 15 Action Cards. Not therapy. Not a trust fall. Just better conversations at work.</p>
        <p className="mt-4 font-bold">The goal: Build a team worth working with.</p>
        <LevelList levels={corporateLevels} />
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div><h3 className="font-display text-xl font-extrabold">WHO IT'S FOR</h3><p className="mt-3 leading-relaxed">Teams who talk about deadlines every day and almost nothing else. New hires finding their footing. Managers who want honest feedback. Long-standing teams who still don't really know each other. Anyone tired of icebreakers that feel like homework.</p></div>
          <div><h3 className="font-display text-xl font-extrabold">THE RULES</h3><ol className="mt-3 list-decimal space-y-3 pl-5 leading-relaxed"><li>Start at <strong>Connect</strong> and move deeper as the group warms up. You don't have to reach Create.</li><li>Draw a question, read it aloud, and everyone answers—starting with whoever drew it.</li><li>Action frequency depends on group size: every 4 questions for 2–4 players, every 3 for 5–7, and every 2 for 8+.</li><li>No cross-talk during someone's answer. No “well actually.” Just listen.</li><li>Any card can be passed with no explanation. Say “pass” and draw the next one.</li><li>There's no winning—just talking to people you thought you already knew.</li></ol></div>
        </div>
      </section>

      <div className="mt-20 flex flex-col items-center gap-6"><Penguin className="h-12 w-auto opacity-80" /><Link to="/setup" className="btn btn-primary">Choose a deck</Link></div>
    </main>
  );
}
