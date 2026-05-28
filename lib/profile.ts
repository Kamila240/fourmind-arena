export type AvatarId = "girl" | "boy";

export type ThemeId = "classic" | "princess" | "wizard" | "arena";

export type ShopItemId = "crown" | "necklace" | "glasses" | "sparkles";

export type Profile = {
  username: string;
  strategyIQ: number;
  isGuest: boolean;
  diamonds: number;
  avatarId: AvatarId;
  ownedThemes: ThemeId[];
  selectedThemeId: ThemeId;
  ownedItems: ShopItemId[];
  equippedItems: ShopItemId[];
};

export const DEFAULT_PROFILE: Profile = {
  username: "Guest Player",
  strategyIQ: 100,
  isGuest: true,
  diamonds: 5,
  avatarId: "girl",
  ownedThemes: ["classic", "princess"],
  selectedThemeId: "princess",
  ownedItems: [],
  equippedItems: [],
};

function isThemeId(value: unknown): value is ThemeId {
  return (
    value === "classic" ||
    value === "princess" ||
    value === "wizard" ||
    value === "arena"
  );
}

function isAvatarId(value: unknown): value is AvatarId {
  return value === "girl" || value === "boy";
}

function normalizeThemeList(value: unknown): ThemeId[] {
  if (!Array.isArray(value)) {
    return ["classic", "princess"];
  }

  const themes = value.filter(isThemeId);

  if (!themes.includes("classic")) {
    themes.unshift("classic");
  }

  if (!themes.includes("princess")) {
    themes.unshift("princess");
  }

  return themes;
}

function normalizeItemList(value: unknown): ShopItemId[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item) =>
      item === "crown" ||
      item === "necklace" ||
      item === "glasses" ||
      item === "sparkles"
  );
}

export function normalizeProfile(profile: Partial<Profile>): Profile {
  const ownedThemes = normalizeThemeList(profile.ownedThemes);

  const selectedThemeId =
    isThemeId(profile.selectedThemeId) &&
    ownedThemes.includes(profile.selectedThemeId)
      ? profile.selectedThemeId
      : "princess";

  return {
    username: profile.username ?? DEFAULT_PROFILE.username,
    strategyIQ: profile.strategyIQ ?? DEFAULT_PROFILE.strategyIQ,
    isGuest: profile.isGuest ?? DEFAULT_PROFILE.isGuest,
    diamonds: profile.diamonds ?? DEFAULT_PROFILE.diamonds,
    avatarId: isAvatarId(profile.avatarId) ? profile.avatarId : "girl",
    ownedThemes,
    selectedThemeId,
    ownedItems: normalizeItemList(profile.ownedItems),
    equippedItems: normalizeItemList(profile.equippedItems),
  };
}

export function loadProfile(): Profile {
  if (typeof window === "undefined") {
    return DEFAULT_PROFILE;
  }

  const storedProfile = localStorage.getItem("fourmind-profile");

  if (!storedProfile) {
    return DEFAULT_PROFILE;
  }

  try {
    return normalizeProfile(JSON.parse(storedProfile));
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: Profile) {
  localStorage.setItem(
    "fourmind-profile",
    JSON.stringify(normalizeProfile(profile))
  );
}

export function getAvatarPath(avatarId: AvatarId): string {
  return `/avatars/${avatarId}.png`;
}