"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_PROFILE,
  loadProfile,
  saveProfile,
  type Profile,
  type ThemeId,
} from "../lib/profile";
import { getThemeById, themes } from "../lib/themes";
import {
  loadDatabaseProfile,
  updateDatabaseProfile,
} from "../lib/database";
import { supabase } from "../lib/supabaseClient";

export default function HomePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [hasProfile, setHasProfile] = useState(false);
  const [previewThemeId, setPreviewThemeId] = useState<ThemeId>("princess");
  const [status, setStatus] = useState("Welcome to FourMind Arena.");

  useEffect(() => {
    async function loadLandingProfile() {
      try {
        const databaseProfile = await loadDatabaseProfile();

        if (databaseProfile) {
          setProfile(databaseProfile);
          saveProfile(databaseProfile);
          setHasProfile(true);
          setPreviewThemeId(databaseProfile.selectedThemeId);
          setStatus(`Signed in as ${databaseProfile.username}.`);
          return;
        }

        const storedProfile = localStorage.getItem("fourmind-profile");

        if (storedProfile) {
          const localProfile = loadProfile();
          setProfile(localProfile);
          setHasProfile(true);
          setPreviewThemeId(localProfile.selectedThemeId);
          setStatus(`Local profile found: ${localProfile.username}.`);
          return;
        }

        setProfile(DEFAULT_PROFILE);
        setHasProfile(false);
        setPreviewThemeId("princess");
        setStatus("Create an account or continue as guest.");
      } catch (error) {
        console.error("Landing profile load failed:", error);

        const storedProfile = localStorage.getItem("fourmind-profile");

        if (storedProfile) {
          const localProfile = loadProfile();
          setProfile(localProfile);
          setHasProfile(true);
          setPreviewThemeId(localProfile.selectedThemeId);
          setStatus("Supabase failed. Local profile loaded.");
          return;
        }

        setProfile(DEFAULT_PROFILE);
        setHasProfile(false);
        setPreviewThemeId("princess");
        setStatus("Create an account or continue as guest.");
      }
    }

    loadLandingProfile();
  }, []);

  const previewTheme = getThemeById(previewThemeId);

  function selectPreviewTheme(themeId: ThemeId) {
    setPreviewThemeId(themeId);
  }

  function isThemeUsable(themeId: ThemeId) {
    return (
      themeId === "classic" ||
      themeId === "princess" ||
      profile.ownedThemes.includes(themeId)
    );
  }

  async function enterSelectedTheme() {
    if (!isThemeUsable(previewThemeId)) {
      router.push("/profile");
      return;
    }

    if (!hasProfile) {
      router.push(`/auth?theme=${previewThemeId}&mode=signup`);
      return;
    }

    const updatedProfile: Profile = {
      ...profile,
      selectedThemeId: previewThemeId,
      ownedThemes: profile.ownedThemes.includes(previewThemeId)
        ? profile.ownedThemes
        : [...profile.ownedThemes, previewThemeId],
    };

    setProfile(updatedProfile);
    saveProfile(updatedProfile);

    try {
      await updateDatabaseProfile(updatedProfile);
    } catch (error) {
      console.error("Failed to save selected theme:", error);
    }

    router.push("/menu");
  }

  function goToSignUp() {
    router.push(`/auth?theme=${previewThemeId}&mode=signup`);
  }

  function goToLogIn() {
    router.push(`/auth?theme=${previewThemeId}&mode=login`);
  }

  function continueAsGuest() {
    const usableTheme =
      previewThemeId === "classic" || previewThemeId === "princess"
        ? previewThemeId
        : "princess";

    const guestProfile: Profile = {
      ...DEFAULT_PROFILE,
      username: "Guest Player",
      isGuest: true,
      diamonds: 5,
      ownedThemes: ["classic", "princess"],
      selectedThemeId: usableTheme,
    };

    saveProfile(guestProfile);
    setProfile(guestProfile);
    setHasProfile(true);

    router.push("/menu");
  }

  async function signOut() {
    await supabase.auth.signOut();

    localStorage.removeItem("fourmind-profile");
    localStorage.removeItem("fourmind-pending-theme");

    setProfile(DEFAULT_PROFILE);
    setHasProfile(false);
    setPreviewThemeId("princess");
    setStatus("Signed out. Create an account or continue as guest.");
  }

  return (
    <main
      className={`min-h-screen overflow-x-hidden text-white ${previewTheme.background}`}
    >
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10">
        <header className="mb-10 flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p
              className={`text-sm font-bold uppercase tracking-[0.35em] ${previewTheme.accent}`}
            >
              FourMind Arena
            </p>

            <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">
              Strategy game with AI opponents, IQ progress, themes, and rewards.
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Play Connect Four against themed AI characters, unlock visual
              worlds, collect accessories, and track your match history through
              your account.
            </p>

            <p className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-3 text-sm text-slate-300">
              {status}
            </p>
          </div>

          {hasProfile && (
            <div className="rounded-[2rem] border border-yellow-300/30 bg-yellow-300/10 p-5 text-left">
              <p className="text-sm font-bold text-yellow-100">
                Current Profile
              </p>

              <p className="mt-2 text-2xl font-black">{profile.username}</p>

              <p className="mt-1 text-3xl font-black text-yellow-300">
                IQ {profile.strategyIQ}
              </p>

              <p className="mt-1 text-sm font-bold text-cyan-200">
                Diamonds: {profile.diamonds}
              </p>

              <button
                onClick={signOut}
                className="mt-4 w-full rounded-2xl border border-red-300/20 bg-red-300/10 px-5 py-3 text-sm font-bold text-red-200 transition hover:bg-red-300/20"
              >
                Sign Out
              </button>
            </div>
          )}
        </header>

        <section className="mb-10 grid gap-4 lg:grid-cols-4">
          <button
            onClick={goToSignUp}
            className={`rounded-[2rem] px-6 py-6 text-left font-bold transition hover:-translate-y-1 ${previewTheme.button}`}
          >
            <p className="text-3xl">Create Account</p>
            <p className="mt-2 text-sm opacity-80">
              Save IQ, diamonds, themes, accessories, and match history.
            </p>
          </button>

          <button
            onClick={goToLogIn}
            className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-6 text-left font-bold transition hover:-translate-y-1 hover:bg-white/10"
          >
            <p className="text-3xl">Log In</p>
            <p className="mt-2 text-sm text-slate-300">
              Continue with an existing Supabase account.
            </p>
          </button>

          <button
            onClick={continueAsGuest}
            className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-6 text-left font-bold transition hover:-translate-y-1 hover:bg-white/10"
          >
            <p className="text-3xl">Guest Mode</p>
            <p className="mt-2 text-sm text-slate-300">
              Play without account. Progress is only local.
            </p>
          </button>

          <button
            onClick={enterSelectedTheme}
            className="rounded-[2rem] border border-yellow-300/30 bg-yellow-300/10 px-6 py-6 text-left font-bold transition hover:-translate-y-1 hover:bg-yellow-300/20"
          >
            <p className="text-3xl">Enter World</p>
            <p className="mt-2 text-sm text-yellow-100">
              Continue with selected theme: {previewTheme.name}
            </p>
          </button>
        </section>

        <section className="mb-10">
          <h2 className="text-3xl font-black">Select Theme</h2>

          <p className="mt-2 text-sm text-slate-400">
            Click a card to preview the world. You enter only after pressing
            Enter World.
          </p>

          <div className="mt-5 grid gap-5 lg:grid-cols-4">
            {themes.map((theme) => {
              const isSelected = previewThemeId === theme.id;
              const isOwned = isThemeUsable(theme.id);

              return (
                <button
                  key={theme.id}
                  onClick={() => selectPreviewTheme(theme.id)}
                  className={`rounded-[2rem] border p-4 text-left transition hover:-translate-y-1 hover:shadow-2xl ${
                    isSelected
                      ? "border-pink-300 bg-pink-300/10 shadow-pink-950/40"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="mb-4 flex h-44 items-center justify-center overflow-hidden rounded-[1.5rem] bg-white shadow-xl shadow-black/30">
                    <img
                      src={theme.image}
                      alt={theme.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <p
                    className={`text-sm font-bold uppercase tracking-[0.3em] ${theme.accent}`}
                  >
                    {isOwned ? "Available" : `Locked · ${theme.price} diamonds`}
                  </p>

                  <h3 className="mt-3 text-2xl font-black">{theme.name}</h3>

                  <p className="mt-3 min-h-[90px] text-sm leading-relaxed text-slate-300">
                    {theme.description}
                  </p>

                  <p className="mt-5 rounded-2xl bg-slate-950/70 px-4 py-3 text-center font-bold">
                    {isSelected ? "Previewing" : "Preview Theme"}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 lg:grid-cols-[360px_1fr]">
          <div className="flex h-80 items-center justify-center overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-black/30">
            <img
              src={previewTheme.image}
              alt={previewTheme.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p
              className={`text-sm font-bold uppercase tracking-[0.3em] ${previewTheme.accent}`}
            >
              Current Preview
            </p>

            <h2 className="mt-3 text-4xl font-black">{previewTheme.name}</h2>

            <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {previewThemeId === "princess"
                ? "You arrive at Charming Kingdom, where strategy decides royal status. The palace dog guards the gates, Princess Alice wants to prove herself, Princess Belle reads every move like a story, and Queen Angelina rules with cold calculation."
                : previewThemeId === "classic"
                ? "You enter the universal arena, where each opponent has a distinct personality, tactical strength, and reward system."
                : "This world is locked. You can preview its visual style, but you need to unlock it from the shop before playing."}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={enterSelectedTheme}
                className={`rounded-2xl px-8 py-4 text-center text-lg font-bold transition ${previewTheme.button}`}
              >
                {isThemeUsable(previewThemeId)
                  ? "Enter World"
                  : "Unlock in Profile"}
              </button>

              {hasProfile && (
                <button
                  onClick={() => router.push("/profile")}
                  className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-center text-lg font-bold transition hover:bg-white/10"
                >
                  Open Profile
                </button>
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}