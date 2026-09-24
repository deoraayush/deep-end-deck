import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { summarizeReflections } from "@/lib/reflections.functions";

export function Reflections() {
  const summarize = useServerFn(summarizeReflections);
  const [draft, setDraft] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const add = () => {
    const t = draft.trim();
    if (!t) return;
    setItems((i) => [...i, t]);
    setDraft("");
  };

  const run = async () => {
    setBusy(true);
    setError(null);
    try {
      const r = await summarize({ data: { reflections: items } });
      setSummary(r.summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-12 w-full rounded-2xl border-2 border-[color:var(--navy)]/15 p-6 text-left text-[color:var(--navy)]">
      <h2 className="font-display text-xl font-extrabold tracking-wide">GROUP REFLECTIONS</h2>
      <p className="mt-2 text-sm opacity-70">
        Add what people shared, without names. We'll gather the themes you had in common.
      </p>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={3}
        maxLength={2000}
        placeholder="e.g. Someone realised they rarely ask for help."
        className="mt-4 w-full rounded-xl border-2 border-[color:var(--navy)]/20 bg-background p-3 text-sm outline-none focus:border-[color:var(--navy)]"
      />
      <div className="mt-3 flex flex-wrap gap-3">
        <button onClick={add} disabled={!draft.trim()} className="btn btn-secondary text-xs">
          Add reflection
        </button>
        <button onClick={run} disabled={items.length === 0 || busy} className="btn btn-primary text-xs">
          {busy ? "Finding themes…" : "Summarize themes"}
        </button>
      </div>
      {items.length > 0 && (
        <ul className="mt-5 space-y-2 text-sm">
          {items.map((it, i) => (
            <li key={i} className="flex items-start justify-between gap-3 rounded-lg bg-[color:var(--navy)]/5 px-3 py-2">
              <span>{it}</span>
              <button
                onClick={() => setItems((a) => a.filter((_, j) => j !== i))}
                className="text-xs font-bold opacity-50 hover:opacity-100"
                aria-label="Remove reflection"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="mt-4 text-sm font-semibold text-[color:var(--orange)]">{error}</p>}
      {summary && (
        <div className="mt-6 whitespace-pre-line rounded-xl border-l-4 border-[color:var(--orange)] bg-[color:var(--navy)]/5 p-4 text-sm leading-relaxed">
          {summary}
        </div>
      )}
    </section>
  );
}
