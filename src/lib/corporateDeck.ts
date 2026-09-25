import { shuffle, type GameCard, type Level } from "@/lib/cards";

/** Deep End Club .PDF — Corporate Edition, transcribed from the supplied 66-page deck. */
export type CorporateLevel = 1 | 2 | 3 | 4;

export const CORPORATE_LEVEL_LABELS: Record<CorporateLevel, string> = {
  1: "LEVEL 1  CONNECT",
  2: "LEVEL 2  COLLABORATE",
  3: "LEVEL 3  CHALLENGE",
  4: "LEVEL 4  CREATE",
};

export const CORPORATE_LEVEL_DESCRIPTIONS: Record<CorporateLevel, string> = {
  1: "Who you are beyond the job title.",
  2: "How you actually work.",
  3: "The friction nobody names out loud.",
  4: "Where you'd take things, given the room.",
};

export const CORPORATE_LEVEL_MESSAGES: Record<CorporateLevel, string> = {
  1: "You know a little more now.",
  2: "The good stuff usually lives beneath the surface.",
  3: "Thanks for showing up honestly.",
  4: "Water gets deeper. So does the conversation.",
};

const CORPORATE_DECK: Record<CorporateLevel, string[]> = {
  1: [
    "What's something you're genuinely good at that has nothing to do with your job?",
    "What's a fictional character whose work ethic you secretly relate to?",
    "What's something you do outside of work that would surprise everyone here?",
    "What's a skill from a past job that turned out way more useful than you expected?",
    "What's something you were into as a kid that still shows up in how you work today?",
    "What's a rule you follow at work that you secretly think is unnecessary?",
    "What's something people usually get wrong about you in the first meeting?",
    "What's a small thing that instantly puts you in a good mood at work?",
    "What's something you're way more competitive about than you'd like to admit?",
    "If your job title didn't exist, what would you want people to call you instead?",
  ],
  2: [
    "What's one thing a teammate can do that makes working with you 10x easier?",
    "What's a type of feedback you actually want more of, but rarely get?",
    "What's something you do before a big meeting that helps you show up better?",
    "What's a working style you used to judge that you've come to respect?",
    "What's something you wish people asked you before assuming they knew the answer?",
    "When do you do your best thinking and does your calendar actually protect that time?",
    "What's a project you're proud of that almost nobody noticed?",
    "What's something a manager did once that changed how you show up at work?",
    "What's a habit of yours that helps the team more than you realize?",
    "What's the most useful thing anyone has ever told you about how you work?",
  ],
  3: [
    "What's a workplace habit that frustrates you more than it probably should?",
    "What's something you wish this team talked about more openly?",
    "What's a piece of feedback you've been sitting on but haven't given?",
    "What's something you've said yes to at work that you actually meant no to?",
    "What's a decision you disagreed with but went along with anyway?",
    "What's something that gets lost between departments that shouldn't?",
    "What's a meeting type you think shouldn't exist?",
    "What's something you needed early in a role that you had to figure out the hard way?",
    "What's a compliment that people usually give in the workspace but don't actually mean?",
    "What's something people avoid saying directly to leadership, but say to each other?",
  ],
  4: [
    "If your team had unlimited budget for one project, what would you build?",
    "What's one thing you'd change about how this team works if you had full authority tomorrow?",
    "What's a completely different career you think you'd have thrived in?",
    "If you could redesign onboarding from scratch, what's the first thing you'd fix?",
    "What's an idea you've had that you never pitched because it felt too ambitious?",
    "If this team had a reputation across the whole company, what would you want it to be?",
    "What's something small this team could start doing tomorrow that would make a real difference?",
    "If you were starting this company today, what's the one thing you'd do differently?",
    "What's a version of your role five years from now that excites you?",
    "What's something you think this industry gets completely wrong?",
  ],
};

export const CORPORATE_ACTION_CARDS: string[] = [
  "Drink water.",
  "Ten pushups. Or ten jumping jacks if you're precious about your blazer.",
  "Everyone stands. Stretch. Shake it out.",
  "Point at someone in the room. Give them a compliment that isn't about their work output.",
  "Text a colleague: \"Appreciate you.\" No context. Send it now.",
  "Choose someone. They get to skip the next question.",
  "Switch seats with someone you don't normally sit near.",
  "You may skip the next question.",
  "Skip the next card. Ask your own question instead, to anyone you want.",
  "The group picks someone. That person shares one thing about themselves this team probably doesn't know.",
  "Everyone writes down one thing they think the player is better at than they realize. Shuffle. The player reads them out loud.",
  "Choose two people in the room. They answer the next question together.",
  "The last person to speak picks the next topic: Connect, Collaborate, Challenge, or Create.",
  "Give the next card to the quietest person in the room. They read it and go first.",
  "High five the person across from you. No explanation needed.",
];

export const CORPORATE_RULES: string[] = [
  "Shuffle the Main Deck and the Action Deck separately.",
  "Most sessions start at Level 1 — Connect and move deeper as the group warms up. You don't have to reach Level 4 — Create to have a good session.",
  "Draw a Question Card. Read it aloud. Everyone answers — starting with whoever drew it.",
  "Action Cards appear naturally through the deck. Complete the Action Card and keep going.",
  "No cross-talk during someone's answer. No \"well actually.\" Just listen.",
  "Any card can be passed — no explanation needed. Just say \"pass\" and draw the next one.",
  "There's no winning. There's just talking to people you thought you already knew.",
];

export function buildCorporateLevelDeck(level: CorporateLevel): GameCard[] {
  return shuffle(CORPORATE_DECK[level]).map((text, i) => ({
    id: `C${level}-${i}`,
    kind: "level",
    level: level as Level,
    text,
    label: CORPORATE_LEVEL_LABELS[level],
  }));
}

export function buildCorporateActionPool(): GameCard[] {
  return shuffle(CORPORATE_ACTION_CARDS).map((text, i) => ({ id: `CA-${i}`, kind: "action", text }));
}
