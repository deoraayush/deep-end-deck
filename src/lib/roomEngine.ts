import { buildActionPool, buildLevelDeck, type GameCard, type Level } from "@/lib/cards";

export type RoomMode = "perception" | "perception_connection" | "full";

export interface LevelState {
  level: Level;
  base: GameCard[];
  notYetUsed: boolean;
  notYetQueue: GameCard[];
  actionsRemaining: GameCard[];
  cardsSinceAction: number;
  totalCards: number;
  shown: number;
}

export function levelsForMode(mode: RoomMode): Level[] {
  return mode === "perception" ? [1] : mode === "perception_connection" ? [1, 2] : [1, 2, 3];
}

export function buildLevelState(level: Level, actionPool: GameCard[], useActions: boolean): LevelState {
  const base = buildLevelDeck(level);
  const actionsPerLevel = useActions ? Math.min(7, Math.ceil(actionPool.length / 3)) : 0;
  return {
    level,
    base,
    notYetUsed: false,
    notYetQueue: [],
    actionsRemaining: actionPool.splice(0, actionsPerLevel),
    cardsSinceAction: 0,
    totalCards: base.length,
    shown: 0,
  };
}

export function buildAllLevels(mode: RoomMode, actions: boolean): LevelState[] {
  const pool = actions ? buildActionPool() : [];
  return levelsForMode(mode).map((lv) => buildLevelState(lv, pool, actions));
}

export type DrawResult =
  | { type: "card"; card: GameCard; levels: LevelState[]; index: number }
  | { type: "level-complete"; level: Level; levels: LevelState[]; index: number }
  | { type: "done" };

/** Same draw logic as the single-player game, returned as data instead of state writes. */
export function drawNext(allLevels: LevelState[], idx: number): DrawResult {
  if (idx >= allLevels.length) return { type: "done" };

  const lv = { ...allLevels[idx] };
  const gap = 2 + Math.floor(Math.random() * 4);
  const shouldAction =
    lv.actionsRemaining.length > 0 &&
    lv.cardsSinceAction >= gap &&
    lv.base.length + lv.notYetQueue.length > 0;

  let nextCard: GameCard | null = null;

  if (shouldAction) {
    lv.actionsRemaining = lv.actionsRemaining.slice();
    nextCard = lv.actionsRemaining.shift()!;
    lv.cardsSinceAction = 0;
  } else if (lv.base.length > 0) {
    lv.base = lv.base.slice();
    nextCard = lv.base.shift()!;
    lv.cardsSinceAction++;
    lv.shown++;
  } else if (lv.notYetQueue.length > 0) {
    lv.notYetQueue = lv.notYetQueue.slice();
    nextCard = lv.notYetQueue.shift()!;
    lv.cardsSinceAction++;
    lv.shown++;
  } else {
    const updated = [...allLevels];
    updated[idx] = lv;
    return { type: "level-complete", level: lv.level, levels: updated, index: idx };
  }

  const updated = [...allLevels];
  updated[idx] = lv;
  return { type: "card", card: nextCard, levels: updated, index: idx };
}

export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export const LEVEL_MESSAGES: Record<Level, string> = {
  1: "You know a little more now.",
  2: "The good stuff usually lives beneath the surface.",
  3: "Thanks for showing up honestly.",
};
