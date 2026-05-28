"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getOpponentById,
  getOpponentsForTheme,
  type OpponentId,
} from "../../lib/opponents";
import {
  DEFAULT_PROFILE,
  getAvatarPath,
  loadProfile,
  type Profile,
} from "../../lib/profile";
import { getThemeById } from "../../lib/themes";

export default function MenuPage() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [selectedOpponentId, setSelectedOpponentId] =
    useState<OpponentId>("dog");

  useEffect(() => {
    const loadedProfile = loadProfile();
    const opponentsForTheme = getOpponentsForTheme(
      loadedProfile.selectedThemeId
    );

    setProfile(loadedProfile);
    setSelectedOpponentId(opponentsForTheme[0].id);
  }, []);

  const selectedTheme = getThemeById(profile.selectedThemeId);
  const themedOpponents = getOpponentsForTheme(profile.selectedThemeId);
  const selectedOpponent = getOpponentById(
    selectedOpponentId,
    profile.selectedThemeId
  );

  const isPrincess = profile.selectedThemeId === "princess";

  return (
    <main
      className={`min-h-screen overflow-x-hidden text-white ${selectedTheme.background}`}
    >
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 sm:px-6">
        <header className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p
              className={`text-sm font-bold uppercase tracking-[0.3em] ${selectedTheme.accent}`}
            >
              FourMind Arena
            </p>

            <h1 className="mt-2 text-4xl font-black">
              {isPrincess ? "Charming Kingdom" : "Classic Arena"}
            </h1>

            <p className="mt-2 text-sm text-slate-300">
              Current theme: {selectedTheme.name}
            </p>
          </div>

          <Link
            href="/profile"
            className="flex items-center gap-4 rounded-[2rem] border border-yellow-300/30 bg-yellow-300/10 p-4 text-left transition hover:bg-yellow-300/20"
          >
            <div className="flex h-20 w-20 items-end justify-center overflow-hidden rounded-2xl bg-white">
              <img
                src={getAvatarPath(profile.avatarId)}
                alt={profile.avatarId}
                className="h-full w-full object-contain object-bottom p-1"
              />
            </div>

            <div>
              <p className="text-sm font-bold text-yellow-100">
                {profile.username}
              </p>

              <p className="text-3xl font-black text-yellow-300">
                IQ {profile.strategyIQ}
              </p>

              <p className="mt-1 text-xs font-bold text-cyan-200">
                Diamonds: {profile.diamonds}
              </p>
            </div>
          </Link>
        </header>

        <section className="mb-8 rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20">
          <p
            className={`text-sm font-bold uppercase tracking-[0.3em] ${selectedTheme.accent}`}
          >
            Story Mode
          </p>

          <h2 className="mt-3 text-3xl font-black">
            {isPrincess
              ? "Welcome to Charming Kingdom"
              : "Welcome to Classic Arena"}
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-200 sm:text-base">
            {isPrincess
              ? "The palace dog guards the gates, Princess Alice wants to prove herself, Princess Belle reads every pattern like a story, and Queen Angelina rules the kingdom with perfect calculation."
              : "This is the universal arena: Chimp Champ plays chaos, Pirate Captain gambles, Queen Elizabeth defends the crown, Sherlock Holmes reads patterns, and Einstein calculates deeper futures."}
          </p>
        </section>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <Link
            href={`/game?mode=ai&theme=${profile.selectedThemeId}&opponent=${selectedOpponentId}`}
            className={`rounded-[2rem] p-7 text-left font-bold transition ${selectedTheme.button}`}
          >
            <p className="text-3xl">Play vs AI</p>
            <p className="mt-2 text-sm opacity-80">
              Challenge {selectedOpponent.name}
            </p>
          </Link>

          <Link
            href="/game?mode=local"
            className="rounded-[2rem] border border-white/10 bg-white/5 p-7 text-left font-bold transition hover:bg-white/10"
          >
            <p className="text-3xl">Local 2 Players</p>
            <p className="mt-2 text-sm text-slate-300">
              Play on the same screen
            </p>
          </Link>
        </div>

        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black">
            {isPrincess ? "Choose Royal Opponent" : "Choose Classic Opponent"}
          </h2>

          <p className="text-sm text-slate-400">Horizontal carousel</p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-5">
          {themedOpponents.map((opponent) => (
            <button
              key={opponent.id}
              onClick={() => setSelectedOpponentId(opponent.id)}
              className={`min-w-[260px] max-w-[260px] rounded-[2rem] border p-4 text-left transition hover:-translate-y-1 hover:shadow-2xl sm:min-w-[310px] sm:max-w-[310px] ${
                selectedOpponentId === opponent.id
                  ? "border-pink-300 bg-pink-300/10 shadow-pink-950/40"
                  : "border-white/10 bg-white/5 hover:border-white/30"
              }`}
            >
              <div className="mb-4 flex h-52 items-center justify-center overflow-hidden rounded-[1.5rem] bg-white shadow-xl shadow-black/30">
                <img
                  src={opponent.images.idle}
                  alt={opponent.name}
                  className="h-full w-full object-contain p-2"
                />
              </div>

              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold">{opponent.name}</h3>

                <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs font-bold text-cyan-300">
                  IQ {opponent.gameIQ}
                </span>
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {opponent.title}
              </p>

              <p className="mt-3 min-h-[72px] text-sm leading-relaxed text-slate-300">
                {opponent.description}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold">
                <div className="rounded-xl bg-emerald-400/10 px-2 py-2 text-emerald-300">
                  Win +{opponent.winReward}
                </div>

                <div className="rounded-xl bg-red-400/10 px-2 py-2 text-red-300">
                  Lose -{opponent.lossPenalty}
                </div>

                <div className="rounded-xl bg-yellow-400/10 px-2 py-2 text-yellow-300">
                  Draw +{opponent.drawReward}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}