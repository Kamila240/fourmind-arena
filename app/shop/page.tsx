"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  loadProfile,
  saveProfile,
  type Profile,
  type ShopItemId,
  type ThemeId,
} from "../../lib/profile";
import { shopItems } from "../../lib/shopItems";
import { getThemeById, themes } from "../../lib/themes";
import {
  loadDatabaseProfile,
  updateDatabaseOwnedItem,
  updateDatabaseOwnedTheme,
  updateDatabaseProfile,
} from "../../lib/database";

export default function ShopPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [status, setStatus] = useState("Loading shop...");

  useEffect(() => {
    async function loadShopData() {
      try {
        const databaseProfile = await loadDatabaseProfile();

        if (databaseProfile) {
          setProfile(databaseProfile);
          saveProfile(databaseProfile);
          setStatus("Shop loaded from Supabase.");
          return;
        }

        const localProfile = loadProfile();
        setProfile(localProfile);
        setStatus("Guest shop loaded locally.");
      } catch (error) {
        console.error("Failed to load shop from Supabase:", error);

        const localProfile = loadProfile();
        setProfile(localProfile);
        setStatus("Supabase failed. Local shop loaded.");
      }
    }

    loadShopData();
  }, []);

  async function updateProfile(nextProfile: Profile) {
    setProfile(nextProfile);
    saveProfile(nextProfile);

    try {
      await updateDatabaseProfile(nextProfile);
      setStatus("Saved to Supabase.");
    } catch (error) {
      console.error("Failed to update Supabase profile:", error);
      setStatus("Saved locally. Supabase update failed.");
    }
  }

  function requestDiamonds() {
  setStatus("give me money");
}

  async function buyTheme(themeId: ThemeId, price: number) {
    if (!profile) return;

    const alreadyOwned = profile.ownedThemes.includes(themeId);

    if (alreadyOwned) {
      const nextProfile: Profile = {
        ...profile,
        selectedThemeId: themeId,
      };

      await updateProfile(nextProfile);
      return;
    }

    if (profile.diamonds < price) {
      setStatus("Not enough diamonds.");
      return;
    }

    const nextProfile: Profile = {
      ...profile,
      diamonds: profile.diamonds - price,
      ownedThemes: [...profile.ownedThemes, themeId],
      selectedThemeId: themeId,
    };

    setProfile(nextProfile);
    saveProfile(nextProfile);

    try {
      await updateDatabaseOwnedTheme(themeId);
      await updateDatabaseProfile(nextProfile);
      setStatus(`${themeId} theme bought and saved.`);
    } catch (error) {
      console.error("Failed to buy theme in Supabase:", error);
      setStatus("Theme bought locally. Supabase update failed.");
    }
  }

  async function buyOrEquipItem(itemId: ShopItemId, price: number) {
    if (!profile) return;

    const alreadyOwned = profile.ownedItems.includes(itemId);
    const alreadyEquipped = profile.equippedItems.includes(itemId);

    if (alreadyOwned) {
      const nextEquippedItems = alreadyEquipped
        ? profile.equippedItems.filter((id) => id !== itemId)
        : [...profile.equippedItems, itemId];

      const nextProfile: Profile = {
        ...profile,
        equippedItems: nextEquippedItems,
      };

      setProfile(nextProfile);
      saveProfile(nextProfile);

      try {
        await updateDatabaseOwnedItem({
          itemId,
          equipped: !alreadyEquipped,
        });

        await updateDatabaseProfile(nextProfile);
        setStatus(alreadyEquipped ? "Item unequipped." : "Item equipped.");
      } catch (error) {
        console.error("Failed to equip item in Supabase:", error);
        setStatus("Item changed locally. Supabase update failed.");
      }

      return;
    }

    if (profile.diamonds < price) {
      setStatus("Not enough diamonds.");
      return;
    }

    const nextProfile: Profile = {
      ...profile,
      diamonds: profile.diamonds - price,
      ownedItems: [...profile.ownedItems, itemId],
      equippedItems: [...profile.equippedItems, itemId],
    };

    setProfile(nextProfile);
    saveProfile(nextProfile);

    try {
      await updateDatabaseOwnedItem({
        itemId,
        equipped: true,
      });

      await updateDatabaseProfile(nextProfile);
      setStatus("Item bought and equipped.");
    } catch (error) {
      console.error("Failed to buy item in Supabase:", error);
      setStatus("Item bought locally. Supabase update failed.");
    }
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">{status}</p>
      </main>
    );
  }

  const selectedTheme = getThemeById(profile.selectedThemeId);

  return (
    <main className={`min-h-screen text-white ${selectedTheme.background}`}>
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <header className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p
              className={`text-sm font-bold uppercase tracking-[0.3em] ${selectedTheme.accent}`}
            >
              FourMind Store
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Diamonds, Themes & Accessories
            </h1>

            <p className="mt-2 text-sm text-slate-300">{status}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-6 py-3 font-black text-cyan-200">
              Diamonds: {profile.diamonds}
            </div>

            <Link
              href="/profile"
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-center font-bold transition hover:bg-white/10"
            >
              Back to Profile
            </Link>

            <Link
              href="/"
              className="rounded-2xl border border-pink-300/20 bg-pink-300/10 px-6 py-3 text-center font-bold transition hover:bg-pink-300/20"
            >
              Change Theme
            </Link>
          </div>
        </header>

        <section className="mb-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
  <h2 className="text-2xl font-black">Get Diamonds</h2>

  <p className="mt-2 text-sm text-slate-400">
    Diamonds are not free anymore. This prototype button simulates a future
    payment system.
  </p>

  <div className="mt-5 grid gap-4 sm:grid-cols-3">
    <button
      onClick={requestDiamonds}
      className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6 text-left transition hover:-translate-y-1 hover:bg-cyan-300/20"
    >
      <p className="text-3xl font-black">10 Diamonds</p>
      <p className="mt-2 text-sm text-slate-300">Starter pack</p>
      <p className="mt-4 rounded-2xl bg-slate-950/70 px-4 py-3 text-center text-sm font-bold">
        Get Diamonds
      </p>
    </button>

    <button
      onClick={requestDiamonds}
      className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6 text-left transition hover:-translate-y-1 hover:bg-cyan-300/20"
    >
      <p className="text-3xl font-black">25 Diamonds</p>
      <p className="mt-2 text-sm text-slate-300">Player pack</p>
      <p className="mt-4 rounded-2xl bg-slate-950/70 px-4 py-3 text-center text-sm font-bold">
        Get Diamonds
      </p>
    </button>

    <button
      onClick={requestDiamonds}
      className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6 text-left transition hover:-translate-y-1 hover:bg-cyan-300/20"
    >
      <p className="text-3xl font-black">50 Diamonds</p>
      <p className="mt-2 text-sm text-slate-300">Premium pack</p>
      <p className="mt-4 rounded-2xl bg-slate-950/70 px-4 py-3 text-center text-sm font-bold">
        Get Diamonds
      </p>
    </button>
  </div>
</section>
        <section className="mb-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-black">Themes</h2>

          <p className="mt-2 text-sm text-slate-400">
            Classic Arena and Princess Realm are free. Locked themes cost
            diamonds.
          </p>

          <div className="mt-5 grid gap-4 lg:grid-cols-4">
            {themes.map((theme) => {
              const owned = profile.ownedThemes.includes(theme.id);
              const selected = profile.selectedThemeId === theme.id;
              const canBuy = profile.diamonds >= theme.price;

              return (
                <button
                  key={theme.id}
                  onClick={() => buyTheme(theme.id, theme.price)}
                  className={`rounded-[2rem] border p-4 text-left transition hover:-translate-y-1 ${
                    selected
                      ? "border-pink-300 bg-pink-300/10 shadow-xl shadow-pink-950/30"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="mb-4 flex h-40 items-center justify-center overflow-hidden rounded-[1.5rem] bg-white">
                    <img
                      src={theme.image}
                      alt={theme.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <p
                    className={`text-xs font-bold uppercase tracking-[0.25em] ${theme.accent}`}
                  >
                    {owned
                      ? "Owned"
                      : canBuy
                      ? `Price: ${theme.price}`
                      : `Need ${theme.price}`}
                  </p>

                  <h3 className="mt-3 text-2xl font-black">{theme.name}</h3>

                  <p className="mt-3 min-h-[96px] text-sm leading-relaxed text-slate-400">
                    {theme.description}
                  </p>

                  <p className="mt-5 rounded-2xl bg-slate-950/70 px-4 py-3 text-center font-bold">
                    {selected
                      ? "Selected"
                      : owned
                      ? "Equip Theme"
                      : canBuy
                      ? `Buy for ${theme.price} Diamonds`
                      : "Not Enough Diamonds"}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
          <h2 className="text-2xl font-black">Accessories</h2>

          <p className="mt-2 text-sm text-slate-400">
            Buy cosmetic items and equip them in your profile.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {shopItems.map((item) => {
              const owned = profile.ownedItems.includes(item.id);
              const equipped = profile.equippedItems.includes(item.id);
              const canBuy = profile.diamonds >= item.price;

              return (
                <button
                  key={item.id}
                  onClick={() => buyOrEquipItem(item.id, item.price)}
                  className={`rounded-[2rem] border p-6 text-left transition hover:-translate-y-1 ${
                    equipped
                      ? "border-yellow-300 bg-yellow-300/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <p className="text-5xl">{item.emoji}</p>

                  <h3 className="mt-4 text-xl font-black">{item.name}</h3>

                  <p className="mt-2 min-h-[64px] text-sm leading-relaxed text-slate-400">
                    {item.description}
                  </p>

                  <p className="mt-4 rounded-2xl bg-slate-950/70 px-4 py-3 text-center text-sm font-bold">
                    {equipped
                      ? "Equipped"
                      : owned
                      ? "Equip"
                      : canBuy
                      ? `Buy for ${item.price} Diamonds`
                      : "Not Enough Diamonds"}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}