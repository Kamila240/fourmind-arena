import type { ThemeId } from "./profile";

export type BoardTheme = {
  frame: string;
  emptyCell: string;
  redPiece: string;
  yellowPiece: string;
  winningCell: string;
};

export type GameTheme = {
  id: ThemeId;
  name: string;
  subtitle: string;
  price: number;
  available: boolean;
  description: string;
  image: string;
  background: string;
  card: string;
  accent: string;
  button: string;
  board: BoardTheme;
};

export const themes: GameTheme[] = [
  {
    id: "classic",
    name: "Classic Arena",
    subtitle: "Unlocked",
    price: 0,
    available: true,
    description:
      "A universal arena with Chimp Champ, Pirate Captain, Queen Elizabeth, Sherlock Holmes, and Einstein.",
    image: "/themes/classic.png",
    background:
      "bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.22),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(99,102,241,0.18),_transparent_35%)] bg-slate-950",
    card: "border-cyan-300/20 bg-cyan-300/10",
    accent: "text-cyan-300",
    button: "bg-cyan-300 text-slate-950 hover:bg-cyan-200",
    board: {
      frame:
        "rounded-[2rem] border border-blue-400/30 bg-blue-700 p-4 shadow-2xl shadow-blue-950/60 sm:p-6",
      emptyCell: "border-blue-300/40 bg-blue-950/70 hover:bg-blue-900",
      redPiece: "bg-red-500 shadow-inner shadow-red-900",
      yellowPiece: "bg-yellow-300 shadow-inner shadow-yellow-700",
      winningCell:
        "border-white bg-emerald-300 shadow-lg shadow-emerald-300/50",
    },
  },
  {
    id: "princess",
    name: "Princess Realm",
    subtitle: "Unlocked",
    price: 0,
    available: true,
    description:
      "A royal pastel arena with the palace dog, three royal sisters, and the ruling queen of Charming Kingdom.",
    image: "/themes/princess.png",
    background:
      "bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.30),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.24),_transparent_38%)] bg-slate-950",
    card: "border-pink-300/20 bg-pink-300/10",
    accent: "text-pink-300",
    button: "bg-pink-300 text-slate-950 hover:bg-pink-200",
    board: {
      frame:
        "rounded-[2rem] border border-pink-200/40 bg-gradient-to-br from-pink-300 via-fuchsia-300 to-purple-400 p-4 shadow-2xl shadow-pink-950/50 sm:p-6",
      emptyCell: "border-pink-100/60 bg-white/85 hover:bg-pink-50",
      redPiece: "bg-pink-500 shadow-inner shadow-pink-900",
      yellowPiece: "bg-violet-400 shadow-inner shadow-violet-900",
      winningCell:
        "border-white bg-yellow-200 shadow-lg shadow-yellow-200/60",
    },
  },
  {
    id: "wizard",
    name: "Wizard Academy",
    subtitle: "Locked",
    price: 10,
    available: false,
    description:
      "A magical academy-style theme with spell energy, deep blues, and glowing strategy cards.",
    image: "/themes/wizard.png",
    background:
      "bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.24),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(147,51,234,0.20),_transparent_35%)] bg-slate-950",
    card: "border-blue-300/20 bg-blue-300/10",
    accent: "text-blue-300",
    button: "bg-blue-300 text-slate-950 hover:bg-blue-200",
    board: {
      frame:
        "rounded-[2rem] border border-blue-300/30 bg-blue-700 p-4 shadow-2xl shadow-blue-950/60 sm:p-6",
      emptyCell: "border-blue-300/40 bg-blue-950/70 hover:bg-blue-900",
      redPiece: "bg-red-500 shadow-inner shadow-red-900",
      yellowPiece: "bg-yellow-300 shadow-inner shadow-yellow-700",
      winningCell:
        "border-white bg-emerald-300 shadow-lg shadow-emerald-300/50",
    },
  },
  {
    id: "arena",
    name: "Arena Rebellion",
    subtitle: "Locked",
    price: 10,
    available: false,
    description:
      "A dystopian arena theme with fire, steel, survival energy, and high-risk matches.",
    image: "/themes/arena.png",
    background:
      "bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.24),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(251,146,60,0.18),_transparent_35%)] bg-slate-950",
    card: "border-orange-300/20 bg-orange-300/10",
    accent: "text-orange-300",
    button: "bg-orange-300 text-slate-950 hover:bg-orange-200",
    board: {
      frame:
        "rounded-[2rem] border border-orange-300/30 bg-orange-700 p-4 shadow-2xl shadow-orange-950/60 sm:p-6",
      emptyCell: "border-orange-300/40 bg-slate-950/80 hover:bg-slate-900",
      redPiece: "bg-red-500 shadow-inner shadow-red-950",
      yellowPiece: "bg-amber-300 shadow-inner shadow-amber-800",
      winningCell: "border-white bg-lime-300 shadow-lg shadow-lime-300/50",
    },
  },
];

export function getThemeById(themeId: ThemeId): GameTheme {
  return themes.find((theme) => theme.id === themeId) ?? themes[0];
}