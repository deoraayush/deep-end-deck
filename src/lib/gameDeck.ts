import { buildActionPool, buildLevelDeck, LEVEL_LABELS, type DeckEdition, type GameCard, type Level } from "@/lib/cards";
import {
  buildCorporateActionPool,
  buildCorporateLevelDeck,
  CORPORATE_LEVEL_LABELS,
  CORPORATE_LEVEL_MESSAGES,
  type CorporateLevel,
} from "@/lib/corporateDeck";

export type GameDepth = 1 | 2 | 3 | 4;

export const EDITION_NAMES: Record<DeckEdition, string> = {
  original: "Original Edition",
  corporate: "Corporate Edition",
};

export function maxDepth(edition: DeckEdition): GameDepth {
  return edition === "corporate" ? 4 : 3;
}

export function levelsForDepth(edition: DeckEdition, depth: GameDepth): Level[] {
  const count = Math.min(depth, maxDepth(edition));
  return Array.from({ length: count }, (_, index) => (index + 1) as Level);
}

export function levelLabel(edition: DeckEdition, level: Level): string {
  if (edition === "corporate") return CORPORATE_LEVEL_LABELS[level as CorporateLevel];
  return LEVEL_LABELS[level];
}

export function levelMessage(edition: DeckEdition, level: Level): string {
  if (edition === "corporate") return CORPORATE_LEVEL_MESSAGES[level as CorporateLevel];
  return {
    1: "You know a little more now.",
    2: "The good stuff usually lives beneath the surface.",
    3: "Thanks for showing up honestly.",
    4: "Thanks for showing up honestly.",
  }[level];
}

export function buildEditionLevelDeck(edition: DeckEdition, level: Level): GameCard[] {
  return edition === "corporate"
    ? buildCorporateLevelDeck(level as CorporateLevel)
    : buildLevelDeck(level);
}

export function buildEditionActionPool(edition: DeckEdition): GameCard[] {
  return edition === "corporate" ? buildCorporateActionPool() : buildActionPool();
}