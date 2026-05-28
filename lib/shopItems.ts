import type { ShopItemId } from "./profile";

export type ShopItem = {
  id: ShopItemId;
  name: string;
  price: number;
  emoji: string;
  description: string;
};

export const shopItems: ShopItem[] = [
  {
    id: "crown",
    name: "Royal Crown",
    price: 4,
    emoji: "👑",
    description: "A crown for players who want full royal energy.",
  },
  {
    id: "necklace",
    name: "Diamond Necklace",
    price: 3,
    emoji: "💎",
    description: "A shiny accessory for a more expensive profile look.",
  },
  {
    id: "glasses",
    name: "Genius Glasses",
    price: 3,
    emoji: "🤓",
    description: "For tactical thinkers and minimax survivors.",
  },
  {
    id: "sparkles",
    name: "Victory Sparkles",
    price: 2,
    emoji: "✨",
    description: "A small cosmetic boost for your avatar card.",
  },
];