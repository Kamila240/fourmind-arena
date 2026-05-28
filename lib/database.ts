import { supabase } from "./supabaseClient";
import type { AvatarId, Profile, ShopItemId, ThemeId } from "./profile";

type DatabaseProfileRow = {
  id: string;
  username: string;
  strategy_iq: number;
  diamonds: number;
  avatar_id: AvatarId;
  selected_theme_id: ThemeId;
};

type OwnedThemeRow = {
  theme_id: ThemeId;
};

type OwnedItemRow = {
  item_id: ShopItemId;
  equipped: boolean;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown database error.";
  }
}

async function createDefaultDatabaseProfile(params: {
  userId: string;
  email?: string;
  username?: string;
  selectedThemeId?: ThemeId;
}) {
  const username =
    params.username && params.username.trim().length > 0
      ? params.username.trim()
      : params.email
      ? params.email.split("@")[0]
      : "Player";

  const selectedThemeId = params.selectedThemeId ?? "princess";

  const profileResult = await supabase.from("profiles").upsert({
    id: params.userId,
    username,
    strategy_iq: 100,
    diamonds: 5,
    avatar_id: "girl",
    selected_theme_id:
      selectedThemeId === "classic" || selectedThemeId === "princess"
        ? selectedThemeId
        : "princess",
  });

  if (profileResult.error) {
    throw new Error(getErrorMessage(profileResult.error));
  }

  const themesResult = await supabase.from("owned_themes").upsert([
    {
      profile_id: params.userId,
      theme_id: "classic",
    },
    {
      profile_id: params.userId,
      theme_id: "princess",
    },
  ]);

  if (themesResult.error) {
    throw new Error(getErrorMessage(themesResult.error));
  }
}

export async function signUpWithEmailPassword(params: {
  email: string;
  password: string;
  username: string;
  selectedThemeId: ThemeId;
}) {
  const { email, password, username, selectedThemeId } = params;

  const authResult = await supabase.auth.signUp({
    email,
    password,
  });

  if (authResult.error) {
    throw new Error(authResult.error.message);
  }

  const user = authResult.data.user;

  if (!user) {
    throw new Error("No user returned after sign up.");
  }

  await createDefaultDatabaseProfile({
    userId: user.id,
    email,
    username,
    selectedThemeId,
  });

  return user;
}

export async function signInWithEmailPassword(params: {
  email: string;
  password: string;
}) {
  const { email, password } = params;

  const result = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data.user;
}

export async function getCurrentUser() {
  const result = await supabase.auth.getUser();

  if (result.error) {
    return null;
  }

  return result.data.user;
}

export async function loadDatabaseProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  let profileResult = await supabase
    .from("profiles")
    .select("id, username, strategy_iq, diamonds, avatar_id, selected_theme_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileResult.error) {
    throw new Error(getErrorMessage(profileResult.error));
  }

  if (!profileResult.data) {
    await createDefaultDatabaseProfile({
      userId: user.id,
      email: user.email ?? undefined,
      selectedThemeId: "princess",
    });

    profileResult = await supabase
      .from("profiles")
      .select("id, username, strategy_iq, diamonds, avatar_id, selected_theme_id")
      .eq("id", user.id)
      .maybeSingle();

    if (profileResult.error) {
      throw new Error(getErrorMessage(profileResult.error));
    }

    if (!profileResult.data) {
      throw new Error("Profile was not created.");
    }
  }

  const themesResult = await supabase
    .from("owned_themes")
    .select("theme_id")
    .eq("profile_id", user.id);

  if (themesResult.error) {
    throw new Error(getErrorMessage(themesResult.error));
  }

  const itemsResult = await supabase
    .from("owned_items")
    .select("item_id, equipped")
    .eq("profile_id", user.id);

  if (itemsResult.error) {
    throw new Error(getErrorMessage(itemsResult.error));
  }

  const profileRow = profileResult.data as DatabaseProfileRow;
  const themeRows = themesResult.data as OwnedThemeRow[];
  const itemRows = itemsResult.data as OwnedItemRow[];

  const ownedThemes = themeRows.map((row) => row.theme_id);
  const ownedItems = itemRows.map((row) => row.item_id);
  const equippedItems = itemRows
    .filter((row) => row.equipped)
    .map((row) => row.item_id);

  return {
    username: profileRow.username,
    strategyIQ: profileRow.strategy_iq,
    isGuest: false,
    diamonds: profileRow.diamonds,
    avatarId: profileRow.avatar_id,
    selectedThemeId: profileRow.selected_theme_id,
    ownedThemes:
      ownedThemes.length > 0 ? ownedThemes : ["classic", "princess"],
    ownedItems,
    equippedItems,
  };
}

export async function updateDatabaseProfile(profile: Profile) {
  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  const result = await supabase
    .from("profiles")
    .update({
      username: profile.username,
      strategy_iq: profile.strategyIQ,
      diamonds: profile.diamonds,
      avatar_id: profile.avatarId,
      selected_theme_id: profile.selectedThemeId,
    })
    .eq("id", user.id);

  if (result.error) {
    throw new Error(getErrorMessage(result.error));
  }
}

export async function updateDatabaseOwnedItem(params: {
  itemId: ShopItemId;
  equipped: boolean;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  const result = await supabase.from("owned_items").upsert({
    profile_id: user.id,
    item_id: params.itemId,
    equipped: params.equipped,
  });

  if (result.error) {
    throw new Error(getErrorMessage(result.error));
  }
}

export async function updateDatabaseOwnedTheme(themeId: ThemeId) {
  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  const result = await supabase.from("owned_themes").upsert({
    profile_id: user.id,
    theme_id: themeId,
  });

  if (result.error) {
    throw new Error(getErrorMessage(result.error));
  }
}

export async function recordMatch(params: {
  opponentId: string;
  themeId: ThemeId;
  result: "win" | "loss" | "draw";
  iqChange: number;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  const insertResult = await supabase.from("matches").insert({
    profile_id: user.id,
    opponent_id: params.opponentId,
    theme_id: params.themeId,
    result: params.result,
    iq_change: params.iqChange,
  });

  if (insertResult.error) {
    throw new Error(getErrorMessage(insertResult.error));
  }
}