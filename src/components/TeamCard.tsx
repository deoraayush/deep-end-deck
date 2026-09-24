import { Penguin } from "./brand";
import type { GameCard } from "@/lib/cards";
import { TEAM_LEVEL_LABELS, type TeamLevel } from "@/lib/teamDeck";

/** Same visual as PlayingCard, with the Deep End Club .PDF team-deck labels. */
export function TeamPlayingCard({ card, animKey }: { card: GameCard; animKey: string | number }) {
  const isAction = card.kind === "action";
  const label = isAction ? "ACTION CARD" : TEAM_LEVEL_LABELS[card.level as unknown as TeamLevel];

  return (
    <div className="w-full max-w-[640px]">
      <div
        key={animKey}
        className={`card-anim deepend-card ${isAction ? "deepend-card-action" : ""} relative w-full`}
        style={{ aspectRatio: "7 / 4" }}
      >
        <div className="absolute inset-0 flex items-center justify-center px-8 sm:px-12">
          <p
            className="text-center font-display font-extrabold leading-tight whitespace-pre-line"
            style={{
              color: isAction ? "#ffffff" : "var(--navy)",
              fontSize: "clamp(1.05rem, 2.6vw, 1.6rem)",
              maxWidth: "92%",
            }}
          >
            {card.text}
          </p>
        </div>
        {!isAction && (
          <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-5">
            <Penguin className="h-8 w-auto sm:h-10 opacity-90" />
          </div>
        )}
        <div
          className="absolute bottom-3 right-4 sm:bottom-4 sm:right-5 font-display font-extrabold tracking-widest"
          style={{ color: isAction ? "#ffffff" : "var(--navy)", fontSize: "clamp(0.55rem, 1.1vw, 0.72rem)" }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
