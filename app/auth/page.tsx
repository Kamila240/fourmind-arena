"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_PROFILE,
  saveProfile,
  type ThemeId,
} from "../../lib/profile";
import { getThemeById } from "../../lib/themes";
import {
  loadDatabaseProfile,
  signInWithEmailPassword,
  signUpWithEmailPassword,
} from "../../lib/database";

function getErrorMessage(error: unknown): string {
  console.error("AUTH ERROR:", error);

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown error.";
  }
} 
function getThemeFromUrl(): ThemeId {
  if (typeof window === "undefined") {
    return "princess";
  }

  const params = new URLSearchParams(window.location.search);
  const theme = params.get("theme");

  if (
    theme === "classic" ||
    theme === "princess" ||
    theme === "wizard" ||
    theme === "arena"
  ) {
    return theme;
  }

  return "princess";
}

export default function AuthPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mode, setMode] = useState<"signup" | "login">(getModeFromUrl);
  const [status, setStatus] = useState("");

  const selectedThemeId = getThemeFromUrl();
  const selectedTheme = getThemeById(selectedThemeId);

  async function createProfile() {
    try {
      setStatus("Creating account...");

      const cleanUsername = username.trim();
      const cleanEmail = email.trim();

      if (!cleanEmail) {
        setStatus("Enter email.");
        return;
      }

      if (password.length < 6) {
        setStatus("Password must be at least 6 characters.");
        return;
      }

      const usableTheme =
        selectedThemeId === "classic" || selectedThemeId === "princess"
          ? selectedThemeId
          : "princess";

      await signUpWithEmailPassword({
        email: cleanEmail,
        password,
        username: cleanUsername.length > 0 ? cleanUsername : "Player",
        selectedThemeId: usableTheme,
      });

      const databaseProfile = await loadDatabaseProfile();

      if (databaseProfile) {
        saveProfile(databaseProfile);
      }

      setStatus("Account created.");
      router.push("/menu");
    } catch (error) {
      setStatus(getErrorMessage(error));
    }
  }

  async function loginProfile() {
    try {
      setStatus("Logging in...");

      const cleanEmail = email.trim();

      if (!cleanEmail) {
        setStatus("Enter email.");
        return;
      }

      await signInWithEmailPassword({
        email: cleanEmail,
        password,
      });

      const databaseProfile = await loadDatabaseProfile();

      if (databaseProfile) {
        saveProfile(databaseProfile);
      }

      setStatus("Logged in.");
      router.push("/menu");
    } catch (error) {
      setStatus(getErrorMessage(error));
    }
  }

  function getModeFromUrl(): "signup" | "login" {
  if (typeof window === "undefined") {
    return "signup";
  }

  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");

  return mode === "login" ? "login" : "signup";
}
  function continueAsGuest() {
    const usableTheme =
      selectedThemeId === "classic" || selectedThemeId === "princess"
        ? selectedThemeId
        : "princess";

    saveProfile({
      ...DEFAULT_PROFILE,
      username: "Guest Player",
      isGuest: true,
      diamonds: 5,
      ownedThemes: ["classic", "princess"],
      selectedThemeId: usableTheme,
    });

    router.push("/menu");
  }

  return (
    <main className={`min-h-screen text-white ${selectedTheme.background}`}>
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30">
          <p
            className={`mb-3 text-sm font-bold uppercase tracking-[0.3em] ${selectedTheme.accent}`}
          >
            FourMind Arena
          </p>

          <h1 className="text-4xl font-black">
            {mode === "signup" ? "Create your account" : "Log in"}
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Your profile, diamonds, themes, and match history will be saved in
            Supabase.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode("signup")}
              className={`rounded-2xl px-4 py-3 font-bold transition ${
                mode === "signup"
                  ? selectedTheme.button
                  : "border border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              Sign Up
            </button>

            <button
              onClick={() => setMode("login")}
              className={`rounded-2xl px-4 py-3 font-bold transition ${
                mode === "login"
                  ? selectedTheme.button
                  : "border border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              Log In
            </button>
          </div>

          {mode === "signup" && (
            <>
              <label className="mt-6 block text-sm font-semibold text-slate-300">
                Username
              </label>

              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter your name"
                className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-pink-300"
              />
            </>
          )}

          <label className="mt-6 block text-sm font-semibold text-slate-300">
            Email
          </label>

          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-pink-300"
          />

          <label className="mt-6 block text-sm font-semibold text-slate-300">
            Password
          </label>

          <input
            value={password}
            type="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-pink-300"
          />

          <button
            onClick={mode === "signup" ? createProfile : loginProfile}
            className={`mt-6 w-full rounded-2xl px-6 py-4 font-bold transition ${selectedTheme.button}`}
          >
            {mode === "signup" ? "Create Account" : "Log In"}
          </button>

          <button
            onClick={continueAsGuest}
            className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition hover:bg-white/10"
          >
            Continue as Guest
          </button>

          {status && (
            <p className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
              {status}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}