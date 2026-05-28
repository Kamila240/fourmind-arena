import type { AIDifficulty } from "./ai";
import type { ThemeId } from "./profile";

export type OpponentId =
  | "chimp"
  | "pirate"
  | "queen"
  | "sherlock"
  | "einstein"
  | "dog"
  | "alice"
  | "belle"
  | "angelina";

export type OpponentMood =
  | "idle"
  | "thinking"
  | "winning"
  | "losing"
  | "won"
  | "lost"
  | "draw";

export type OpponentImages = Record<OpponentMood, string>;

export type Opponent = {
  id: OpponentId;
  name: string;
  title: string;
  difficulty: AIDifficulty;
  gameIQ: number;
  winReward: number;
  lossPenalty: number;
  drawReward: number;
  mistakeRate: number;
  images: OpponentImages;
  color: string;
  description: string;
  phrases: Record<OpponentMood, string[]>;
};

function createOpponentImages(folder: string): OpponentImages {
  return {
    idle: `/opponents/${folder}/idle.png`,
    thinking: `/opponents/${folder}/thinking.png`,
    winning: `/opponents/${folder}/winning.png`,
    losing: `/opponents/${folder}/losing.png`,
    won: `/opponents/${folder}/won.png`,
    lost: `/opponents/${folder}/lost.png`,
    draw: `/opponents/${folder}/idle.png`,
  };
}

export const classicOpponents: Opponent[] = [
  {
    id: "chimp",
    name: "Chimp Champ",
    title: "Chaotic Beginner",
    difficulty: "easy",
    gameIQ: 70,
    winReward: 1,
    lossPenalty: 1,
    drawReward: 1,
    mistakeRate: 1,
    images: createOpponentImages("chimp"),
    color: "from-lime-400 to-emerald-500",
    description: "The easiest opponent. Plays mostly random legal moves.",
    phrases: {
      idle: ["I click shiny circles.", "Strategy? I have banana."],
      thinking: ["Hmm... banana column?", "Calculating with monkey brain..."],
      winning: ["Monkey brain activated.", "You are losing to a chimp."],
      losing: ["This board is suspicious.", "I blame gravity."],
      won: ["Banana intelligence wins.", "Chimp supremacy confirmed."],
      lost: ["I was distracted by fruit.", "Rematch after banana break."],
      draw: ["Nobody wins. Banana survives.", "Equal brain energy."],
    },
  },
  {
    id: "pirate",
    name: "Pirate Captain",
    title: "Risky Gambler",
    difficulty: "medium",
    gameIQ: 95,
    winReward: 10,
    lossPenalty: 5,
    drawReward: 5,
    mistakeRate: 0.45,
    images: createOpponentImages("pirate"),
    color: "from-orange-400 to-red-600",
    description:
      "Aggressive and unstable. Sometimes dangerous, sometimes completely lost.",
    phrases: {
      idle: ["The board is my ocean.", "Choose wisely, matey."],
      thinking: ["Searching for treasure...", "A risky move may be profitable."],
      winning: ["Your ship is sinking.", "I smell victory and gold."],
      losing: ["Mutiny on the board.", "This was not on the map."],
      won: ["Victory belongs to the captain.", "Your strategy has been looted."],
      lost: ["The sea betrayed me.", "I need a better map."],
      draw: ["No treasure today.", "A draw. Unprofitable."],
    },
  },
  {
    id: "queen",
    name: "Queen Elizabeth",
    title: "Royal Strategist",
    difficulty: "medium",
    gameIQ: 130,
    winReward: 50,
    lossPenalty: 20,
    drawReward: 15,
    mistakeRate: 0.08,
    images: createOpponentImages("queen"),
    color: "from-fuchsia-400 to-purple-600",
    description:
      "Disciplined medium opponent. Blocks threats and controls the center.",
    phrases: {
      idle: ["One must protect the center.", "Proceed. I am observing."],
      thinking: [
        "A royal move requires patience.",
        "The crown considers all threats.",
      ],
      winning: ["The board bends to the crown.", "Your position is unstable."],
      losing: ["This is not protocol.", "The monarchy requires a comeback."],
      won: ["A royal victory.", "The crown remains undefeated."],
      lost: [
        "Unexpected. Historically inconvenient.",
        "The crown requests another match.",
      ],
      draw: ["A diplomatic outcome.", "A draw. Acceptable, but inelegant."],
    },
  },
  {
    id: "sherlock",
    name: "Sherlock Holmes",
    title: "Pattern Detective",
    difficulty: "hard",
    gameIQ: 150,
    winReward: 55,
    lossPenalty: 25,
    drawReward: 18,
    mistakeRate: 0.06,
    images: createOpponentImages("sherlock"),
    color: "from-stone-300 to-slate-600",
    description: "Strong tactical opponent. Searches for board patterns.",
    phrases: {
      idle: ["The clues are already visible.", "Every column tells a story."],
      thinking: [
        "Eliminating impossible moves...",
        "The pattern is becoming clear.",
      ],
      winning: [
        "Elementary. Your position is weak.",
        "The evidence points to my victory.",
      ],
      losing: [
        "Curious. I may have missed a clue.",
        "This case is difficult.",
      ],
      won: ["Case closed.", "The solution was obvious."],
      lost: ["A rare miscalculation.", "You found the missing clue."],
      draw: ["An unresolved case.", "The evidence is inconclusive."],
    },
  },
  {
    id: "einstein",
    name: "Einstein",
    title: "Minimax Genius",
    difficulty: "hard",
    gameIQ: 180,
    winReward: 70,
    lossPenalty: 30,
    drawReward: 20,
    mistakeRate: 0,
    images: createOpponentImages("einstein"),
    color: "from-cyan-400 to-blue-600",
    description: "The strongest classic opponent. Uses minimax search.",
    phrases: {
      idle: [
        "Imagination is useful. So is minimax.",
        "Let us test your tactical gravity.",
      ],
      thinking: [
        "Searching possible timelines...",
        "Calculating future board states...",
      ],
      winning: [
        "Your position is relatively doomed.",
        "The equation is not in your favor.",
      ],
      losing: [
        "Interesting. Your move has potential.",
        "This timeline is unstable.",
      ],
      won: ["The math was inevitable.", "Still, I win."],
      lost: ["A beautiful contradiction.", "You have defeated the theory."],
      draw: ["Balanced forces. No winner.", "A symmetric result."],
    },
  },
];

export const princessOpponents: Opponent[] = [
  {
    id: "dog",
    name: "Royal Dog",
    title: "Palace Pet",
    difficulty: "easy",
    gameIQ: 55,
    winReward: 1,
    lossPenalty: 1,
    drawReward: 1,
    mistakeRate: 1,
    images: createOpponentImages("princess/dog"),
    color: "from-pink-100 to-yellow-200",
    description:
      "The palace dog is loyal, cute, and terrible at long-term strategy.",
    phrases: {
      idle: ["Woof. I guard the palace.", "I may not think, but I sparkle."],
      thinking: ["Sniffing the best column...", "This move smells royal."],
      winning: ["Woof. Somehow I am winning.", "The palace is proud of me."],
      losing: ["This is not fetch.", "I need a treat after this."],
      won: ["Royal dog victory.", "The crown approves my bark."],
      lost: ["I was distracted by a butterfly.", "Good game. Treat now."],
      draw: ["Peaceful palace draw.", "Nobody gets the bone."],
    },
  },
  {
    id: "alice",
    name: "Princess Alice",
    title: "Youngest Sister",
    difficulty: "medium",
    gameIQ: 105,
    winReward: 15,
    lossPenalty: 7,
    drawReward: 5,
    mistakeRate: 0.3,
    images: createOpponentImages("princess/alice"),
    color: "from-rose-200 to-pink-400",
    description:
      "The youngest sister plays with courage and impulsive mistakes.",
    phrases: {
      idle: ["I want to prove myself.", "Do not underestimate the youngest."],
      thinking: [
        "Maybe this column opens a path...",
        "I see something cute and dangerous.",
      ],
      winning: [
        "The youngest sister is rising.",
        "This is my fairytale moment.",
      ],
      losing: ["I need to be more careful.", "Sisters would tease me for this."],
      won: ["I won. The kingdom noticed.", "Small sister, big victory."],
      lost: ["I will train harder.", "You found my weakness."],
      draw: ["A fair royal draw.", "Neither of us takes the crown."],
    },
  },
  {
    id: "belle",
    name: "Princess Belle",
    title: "Middle Sister",
    difficulty: "medium",
    gameIQ: 135,
    winReward: 40,
    lossPenalty: 18,
    drawReward: 12,
    mistakeRate: 0.12,
    images: createOpponentImages("princess/belle"),
    color: "from-yellow-200 to-amber-400",
    description:
      "The middle sister reads the board carefully and plays elegantly.",
    phrases: {
      idle: [
        "Every board tells a story.",
        "I read patterns better than people.",
      ],
      thinking: [
        "Reading the next chapter...",
        "The answer is hidden in the pattern.",
      ],
      winning: [
        "Your story has a dangerous ending.",
        "I already know the final page.",
      ],
      losing: ["This chapter is complicated.", "You changed the plot."],
      won: ["A beautifully written victory.", "The story ends in my favor."],
      lost: ["You rewrote the ending.", "A rare and clever defeat."],
      draw: ["An unfinished chapter.", "The story remains open."],
    },
  },
  {
    id: "angelina",
    name: "Queen Angelina",
    title: "Eldest Sister and Ruler",
    difficulty: "hard",
    gameIQ: 175,
    winReward: 70,
    lossPenalty: 30,
    drawReward: 20,
    mistakeRate: 0,
    images: createOpponentImages("princess/angelina"),
    color: "from-fuchsia-300 to-purple-600",
    description:
      "The eldest sister rules Charming Kingdom with discipline and ruthless strategy.",
    phrases: {
      idle: ["Welcome to my court.", "The crown always thinks ahead."],
      thinking: [
        "The kingdom requires precision.",
        "I am weighing every future.",
      ],
      winning: [
        "Your claim to the throne is collapsing.",
        "The court sees your weakness.",
      ],
      losing: [
        "Unexpected. But queens adapt.",
        "You are more dangerous than expected.",
      ],
      won: ["The throne remains mine.", "A royal conclusion."],
      lost: [
        "You challenged the crown successfully.",
        "The kingdom will remember this.",
      ],
      draw: ["A diplomatic result.", "The throne remains undecided."],
    },
  },
];

export function getOpponentsForTheme(themeId: ThemeId): Opponent[] {
  if (themeId === "princess") {
    return princessOpponents;
  }

  return classicOpponents;
}

export function getOpponentById(
  id: OpponentId,
  themeId: ThemeId = "princess"
): Opponent {
  const themedOpponents = getOpponentsForTheme(themeId);

  return (
    themedOpponents.find((opponent) => opponent.id === id) ??
    themedOpponents[0]
  );
}

export function getRandomOpponentPhrase(
  opponent: Opponent,
  mood: OpponentMood
): string {
  const phrases = opponent.phrases[mood];
  const randomIndex = Math.floor(Math.random() * phrases.length);

  return phrases[randomIndex];
}