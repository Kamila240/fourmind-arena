"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAvatarPath,
  loadProfile,
  saveProfile,
  type AvatarId,
  type Profile,
} from "../../lib/profile";
import { shopItems } from "../../lib/shopItems";
import { getThemeById } from "../../lib/themes";
import {
  loadDatabaseProfile,
  updateDatabaseProfile,
} from "../../lib/database";

const avatarOptions: { id: AvatarId; name: string }[] = [
  { id: "girl", name: "Girl Avatar" },
  { id: "boy", name: "Boy Avatar" },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [status, setStatus] = useState("Loading profile...");

  useEffect(() => {
    async function loadProfileData() {
      try {
        const databaseProfile = await loadDatabaseProfile();

        if (databaseProfile) {
          setProfile(databaseProfile);
          saveProfile(databaseProfile);
          setStatus("Profile loaded from Supabase.");
          return;
        }

        const localProfile = loadProfile();
        setProfile(localProfile);
        setStatus("Guest profile loaded locally.");
      } catch (error) {
        console.error("Failed to load Supabase profile:", error);

        const localProfile = loadProfile();
        setProfile(localProfile);
        setStatus("Supabase profile failed. Local profile loaded.");
      }
    }

    loadProfileData();
  }, []);

  async function updateProfile(nextProfile: Profile) {
    setProfile(nextProfile);
    saveProfile(nextProfile);
    setStatus("Saving profile...");

    try {
      await updateDatabaseProfile(nextProfile);
      setStatus("Profile saved to Supabase.");
    } catch (error) {
      console.error("Failed to update database profile:", error);
      setStatus("Saved locally. Supabase update failed.");
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
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <header className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p
              className={`text-sm font-bold uppercase tracking-[0.3em] ${selectedTheme.accent}`}
            >
              FourMind Profile
            </p>

            <h1 className="mt-2 text-4xl font-black">Personal Cabinet</h1>

            <p className="mt-2 text-sm text-slate-300">{status}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="rounded-2xl bg-cyan-300 px-6 py-3 text-center font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              Open Shop
            </Link>

            <Link
              href="/"
              className="rounded-2xl border border-pink-300/20 bg-pink-300/10 px-6 py-3 text-center font-bold transition hover:bg-pink-300/20"
            >
              Change Theme
            </Link>

            <Link
              href="/menu"
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-center font-bold transition hover:bg-white/10"
            >
              Back to Menu
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className={`rounded-[2rem] border p-6 ${selectedTheme.card}`}>
            <div className="flex h-72 items-end justify-center overflow-hidden rounded-[2rem] bg-white">
              <img
                src={getAvatarPath(profile.avatarId)}
                alt={profile.avatarId}
                className="h-full w-full object-contain object-bottom p-4"
              />
            </div>

            <h2 className="mt-6 text-3xl font-black">{profile.username}</h2>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-sm text-slate-400">Strategy IQ</p>
                <p className="text-3xl font-black text-yellow-300">
                  {profile.strategyIQ}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-sm text-slate-400">Diamonds</p>
                <p className="text-3xl font-black text-cyan-300">
                  {profile.diamonds}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">Current Theme</p>
              <p className="mt-1 text-xl font-black">{selectedTheme.name}</p>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">Owned Themes</p>
              <p className="mt-2 text-sm font-bold text-slate-200">
                {profile.ownedThemes.join(", ")}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">Equipped Items</p>
              <p className="mt-2 text-3xl">
                {profile.equippedItems.length === 0
                  ? "—"
                  : profile.equippedItems
                      .map(
                        (itemId) =>
                          shopItems.find((item) => item.id === itemId)?.emoji
                      )
                      .filter(Boolean)
                      .join(" ")}
              </p>
            </div>
          </aside>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black">Choose Avatar</h2>

            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Avatar choice is saved to Supabase for logged-in users and to
              local storage for guests.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() =>
                    updateProfile({
                      ...profile,
                      avatarId: avatar.id,
                    })
                  }
                  className={`rounded-[2rem] border p-4 transition ${
                    profile.avatarId === avatar.id
                      ? "border-cyan-300 bg-cyan-300/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex h-56 items-end justify-center overflow-hidden rounded-[1.5rem] bg-white">
                    <img
                      src={getAvatarPath(avatar.id)}
                      alt={avatar.name}
                      className="h-full w-full object-contain object-bottom p-3"
                    />
                  </div>

                  <p className="mt-3 font-bold">{avatar.name}</p>

                  <p className="mt-2 text-sm text-slate-400">
                    {profile.avatarId === avatar.id ? "Selected" : "Select"}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-[2rem] border border-white/10 bg-slate-950/60 p-5">
              <h3 className="text-xl font-black">Database Status</h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {status}
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}