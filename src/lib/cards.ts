export type Level = 1 | 2 | 3 | 4;
export type DeckEdition = "original" | "corporate";
export type CardKind = "level" | "action";

export interface GameCard {
  id: string;
  kind: CardKind;
  level?: Level;
  text: string;
  label?: string;
}

export const LEVEL_LABELS: Record<Level, string> = {
  1: "LEVEL 1  PERCEPTION",
  2: "LEVEL 2  CONNECTION",
  3: "LEVEL 3  REFLECTION",
  4: "LEVEL 4",
};

export const LEVEL_1: string[] = [
  "You okay? Like really okay?",
  "What's something you do that would annoy you if someone else did it?",
  "What's something you strongly believe, even if most people disagree?",
  "What fictional character would understand you immediately?",
  "What's something you've taken as a sign when it was probably just a coincidence?",
  "Is there someone you miss but won't text first?",
  "What's a lesson you had to learn the embarrassing way?",
  "What's the worst advice you've ever given someone?",
  "What's something you secretly judge people for?",
  "What's something you're way more competitive about than you should be?",
  "What's something you want badly enough that failure would actually hurt?",
  "What's something you spend money on that most people would consider a waste?",
  "What's something you think you'd absolutely crush if you actually tried?",
  "Have you ever ended a friendship without telling the other person why?",
  "What's something you thought would be easy as an adult that definitely isn't?",
  "What's something your family does that you thought was normal until you met other people?",
  "What's something you've criticised someone for, then caught yourself doing?",
  "What's the weirdest thing you've ever been jealous of?",
  "What's something everyone seems to enjoy that you absolutely can't stand?",
  "What's something you've done purely because you didn't want to look stupid?",
];

export const LEVEL_2: string[] = [
  "What's something your family never talked about that you had to figure out on your own?",
  "Is there someone you are a little jealous of? What do they have that you want?",
  "Have you ever been completely wrong about someone and ended up really liking them?",
  "Which compliment are you still living off?",
  "What's something you've never forgiven a friend for, even though they probably think you have?",
  "What's something you're embarrassed that you still care about?",
  "What's something someone achieved that made you question your own progress?",
  "Have you ever lost respect for someone instantly? What happened?",
  "Have you ever realised you were nobody's first call?",
  "What's something someone expected from you that you never actually wanted?",
  "What's something people get wrong about you and you've stopped correcting them?",
  "Did you shrink yourself to be easier to love? How did you do it?",
  "What's something you spent years trying to prove and to who?",
  "Have you ever realized someone only kept you around when they needed something? What gave it away?",
  "When your brain gets loud, what's the first thing you reach for?",
  "What's something you've never fully gotten over, even though you act like you have?",
  "What's something you kept pushing through even when every part of you was telling you to stop?",
  "What's something you do purely for yourself that nobody really knows about?",
  "What's something you do today because of someone you'll probably never be close to again?",
  'Text someone:\n"I was just thinking about you."\nNo context.\nThen put your phone away.',
];

export const LEVEL_3: string[] = [
  "What are you actually chasing when you say you're grinding?",
  "What is that one ambitious thing you see yourself doing tomorrow, next week or maybe even next year?",
  "What's something you're slowly building towards that would feel like a quiet win for you?",
  'Text someone you\'ve never properly thanked.\nThe message must contain the words:\n"Thank you."',
  "Point to someone in the room.\nTell them something they've done that they'll probably never get enough credit for.",
  "What's a problem you have today that younger you would've been jealous of?",
  "Everyone writes down something they are grateful for in their notes.\nGive the phone to the person on their right.\nThat person reads it out loud.",
  "What's something you're proud of that you'd never post about?",
  "What's something you've quietly made peace with?",
  "Everyone says one thing they genuinely hope happens in the next year.",
  "Right now, I need more ______ in my life.",
  "What's something you're willing to sacrifice for the life you want and something you're not?",
  "What does your life need less of right now that only you can actually do something about?",
  "When do you feel most like yourself?",
  "What's a version of yourself you had to leave behind to become who you are now?",
  "What's something you're still becoming?",
  "Open your notes app.\nWrite down 3 things you want to achieve in the next year.\nRead one of them out loud.",
  "What's something life changed your mind about?",
  "What surprised you most about the person you've become?",
  "So, where are you now, really? After everything. The highs, the heartbreaks, the healing, the hiding. What's your story after all this? What feels true to you today, in this moment, even if it's unfinished?",
];

export const ACTION_CARDS: string[] = [
  "DRINK WATER",
  "TEN PUSHUPS",
  "Show the last photo you took",
  "Point at someone in the room.\nGive them a compliment that isn't about appearance",
  'Text someone:\n"Hope you\'re doing okay."',
  "Write one thing you've never told someone in this room.\nHand it to them.\nThey read it silently.",
  "Everyone tells one player their first impression of them.\nThe player can't respond until everyone finishes.",
  "Everyone stands.\nStretch.\nMove around.",
  "Send a voice note to someone you care about.\nMinimum 10 seconds.",
  "Choose someone.\nThey get to skip the next question.",
  "You may skip the next question",
  "The group picks someone.\nThat person tells a secret they've never told this group before.",
  "Scroll your camera roll.\nThe person to your left says stop.\nShow the photo.",
  "Everyone describes the person who drew this card in one word.",
  "Open your notes app.\nRead the last note you created.",
  "Everyone writes one anonymous question for the player.\nShuffle them.\nThe player chooses one to answer.",
  "Choose two people in the room.\nThey answer the next question together.",
  "Skip the next card.\nAsk your own question instead to anyone you want.",
  "Open the chat of the last person you had feelings for.\nRead the last message you sent them.",
  "Everyone writes down something they think the player is better at than they realize.\nShuffle them.\nThe player reads them.",
];

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildLevelDeck(level: Level): GameCard[] {
  const source = level === 1 ? LEVEL_1 : level === 2 ? LEVEL_2 : LEVEL_3;
  return shuffle(source).map((text, i) => ({
    id: `L${level}-${i}`,
    kind: "level",
    level,
    text,
  }));
}

export function buildActionPool(): GameCard[] {
  return shuffle(ACTION_CARDS).map((text, i) => ({
    id: `A-${i}`,
    kind: "action",
    text,
  }));
}

/**
 * Interleave action cards through a level deck so they appear naturally,
 * roughly every 2–5 cards, never back-to-back.
 */
export function interleaveActions(
  levelDeck: GameCard[],
  actionPool: GameCard[],
  takeCount: number,
): { sequence: GameCard[]; remaining: GameCard[] } {
  if (takeCount <= 0 || actionPool.length === 0) {
    return { sequence: levelDeck, remaining: actionPool };
  }
  const taken = actionPool.slice(0, Math.min(takeCount, actionPool.length));
  const remaining = actionPool.slice(taken.length);
  const out: GameCard[] = [];
  let actionIdx = 0;
  let untilNext = 2 + Math.floor(Math.random() * 4); // 2..5
  for (let i = 0; i < levelDeck.length; i++) {
    out.push(levelDeck[i]);
    if (
      actionIdx < taken.length &&
      out.length - (out.findIndex((c) => c.kind === "action" && out.indexOf(c) === out.length - 1)) > 0
    ) {
      // simpler: just count cards since last action
    }
    untilNext--;
    if (untilNext <= 0 && actionIdx < taken.length && i < levelDeck.length - 1) {
      out.push(taken[actionIdx++]);
      untilNext = 2 + Math.floor(Math.random() * 4);
    }
  }
  // Any leftover action cards we promised to take but didn't place — drop, keep deck pure.
  return { sequence: out, remaining };
}
