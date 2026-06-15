import { Penguin } from "./brand";
import type { GameCard } from "@/lib/cards";
import { LEVEL_LABELS } from "@/lib/cards";

/**
 * Visual reproduction of the physical Deep End Club cards.
 * Aspect ratio matches the PDF (252 x 144 ≈ 7:4 landscape "business card").
 */
export function PlayingCard({ card, animKey }: { card: GameCard; animKey: string | number }) {
  const isAction = card.kind === "action";
  const label = isAction ? "ACTION CARD" : LEVEL_LABELS[card.level!];

  return (
    <div className="w-full max-w-[640px]">
      <div
        key={animKey}
        className={`card-anim deepend-card ${isAction ? "deepend-card-action" : ""} relative w-full`}
        style={{ aspectRatio: "7 / 4" }}
      >
        {/* text block — centered */}
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

        {/* bottom-left penguin (level cards only) */}
        {!isAction && (
          <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-5">
            <Penguin className="h-8 w-auto sm:h-10 opacity-90" />
          </div>
        )}

        {/* bottom-right label */}
        <div
          className="absolute bottom-3 right-4 sm:bottom-4 sm:right-5 font-display font-extrabold tracking-widest"
          style={{
            color: isAction ? "#ffffff" : "var(--navy)",
            fontSize: "clamp(0.55rem, 1.1vw, 0.72rem)",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
