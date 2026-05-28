"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GameBoard from "../../components/GameBoard";
import type { Board, Player, Position } from "../../lib/types";
import {
  COLUMNS,
  createEmptyBoard,
  findAvailableRow,
  getWinningCells,
  isBoardFull,
  switchPlayer,
} from "../../lib/gameLogic";
import { getAIMove, getRandomAIMove } from "../../lib/ai";
import { getCoachFeedback } from "../../lib/coach";
import {
  getOpponentById,
  getOpponentsForTheme,
  getRandomOpponentPhrase,
  type OpponentId,
  type OpponentMood,
} from "../../lib/opponents";
import {
  DEFAULT_PROFILE,
  loadProfile,
  saveProfile,
  type Profile,
  type ThemeId,
} from "../../lib/profile";
import { getThemeById } from "../../lib/themes";
import {
  loadDatabaseProfile,
  recordMatch,
  updateDatabaseProfile,
} from "../../lib/database";

type GameMode = "local" | "ai";

const HUMAN_PLAYER: Player = "red";
const AI_PLAYER: Player = "yellow";

export default function GamePage() {
  const router = useRouter();

  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(HUMAN_PLAYER);
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningCells, setWinningCells] = useState<Position[]>([]);
  const [isDraw, setIsDraw] = useState(false);

  const [gameMode, setGameMode] = useState<GameMode>("ai");
  const [selectedOpponentId, setSelectedOpponentId] =
    useState<OpponentId>("dog");
  const [selectedThemeId, setSelectedThemeId] =
    useState<ThemeId>("princess");

  const [isAIThinking, setIsAIThinking] = useState(false);
  const [coachMessages, setCoachMessages] = useState<string[]>([]);
  const [playerIQ, setPlayerIQ] = useState(100);
  const [username, setUsername] = useState("Guest Player");

  const [iqAlreadyUpdated, setIqAlreadyUpdated] = useState(false);
  const [opponentMood, setOpponentMood] = useState<OpponentMood>("idle");
  const [opponentPhrase, setOpponentPhrase] = useState("");
  const [hasLoadedSettings, setHasLoadedSettings] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Loading game profile...");

  const selectedTheme = getThemeById(selectedThemeId);
  const selectedOpponent = getOpponentById(
    selectedOpponentId,
    selectedThemeId
  );

  useEffect(() => {
    async function loadSettings() {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get("mode");
      const opponentParam = params.get("opponent") as OpponentId | null;
      const themeParam = params.get("theme") as ThemeId | null;

      let activeProfile: Profile;

      try {
        const databaseProfile = await loadDatabaseProfile();

        if (databaseProfile) {
          activeProfile = databaseProfile;
          saveProfile(databaseProfile);
          setSaveStatus("Game profile loaded from Supabase.");
        } else {
          activeProfile = loadProfile();
          setSaveStatus("Guest game profile loaded locally.");
        }
      } catch (error) {
        console.error("Failed to load database profile in game:", error);
        activeProfile = loadProfile();
        setSaveStatus("Supabase failed. Local profile loaded.");
      }

      const requestedThemeId: ThemeId =
  themeParam === "classic" ||
  themeParam === "princess" ||
  themeParam === "wizard" ||
  themeParam === "arena"
    ? themeParam
    : activeProfile.selectedThemeId;

const opponentsForTheme = getOpponentsForTheme(requestedThemeId);

      setGameMode(modeParam === "local" ? "local" : "ai");
      setSelectedThemeId(requestedThemeId);
      setUsername(activeProfile.username);
      setPlayerIQ(activeProfile.strategyIQ);

      if (
        opponentParam &&
        opponentsForTheme.some((opponent) => opponent.id === opponentParam)
      ) {
        setSelectedOpponentId(opponentParam);
      } else {
        setSelectedOpponentId(opponentsForTheme[0].id);
      }

      setHasLoadedSettings(true);
    }

    loadSettings();
  }, []);

  useEffect(() => {
    setOpponentPhrase(getRandomOpponentPhrase(selectedOpponent, opponentMood));
  }, [selectedOpponentId, opponentMood, selectedThemeId]);

  function addCoachMessage(message: string) {
    setCoachMessages((previousMessages) => [
      message,
      ...previousMessages.slice(0, 4),
    ]);
  }

  function hasImmediateWinningMove(boardToCheck: Board, player: Player) {
    for (let column = 0; column < COLUMNS; column++) {
      const row = findAvailableRow(boardToCheck, column);

      if (row === null) {
        continue;
      }

      const simulatedBoard = boardToCheck.map((boardRow) => [...boardRow]);
      simulatedBoard[row][column] = player;

      const winningLine = getWinningCells(
        simulatedBoard,
        row,
        column,
        player
      );

      if (winningLine.length >= 4) {
        return true;
      }
    }

    return false;
  }

  function updateOpponentMood(newBoard: Board, nextPlayer: Player) {
    if (gameMode !== "ai") {
      setOpponentMood("idle");
      return;
    }

    const humanThreat = hasImmediateWinningMove(newBoard, HUMAN_PLAYER);
    const aiThreat = hasImmediateWinningMove(newBoard, AI_PLAYER);

    if (aiThreat) {
      setOpponentMood("winning");
      return;
    }

    if (humanThreat) {
      setOpponentMood("losing");
      return;
    }

    if (nextPlayer === AI_PLAYER) {
      setOpponentMood("thinking");
      return;
    }

    setOpponentMood("idle");
  }

  function makeMove(column: number) {
    if (winner || isDraw) {
      return;
    }

    const availableRow = findAvailableRow(board, column);

    if (availableRow === null) {
      return;
    }

    const previousBoard = board.map((row) => [...row]);
    const newBoard = board.map((row) => [...row]);
    newBoard[availableRow][column] = currentPlayer;

    const winningLine = getWinningCells(
      newBoard,
      availableRow,
      column,
      currentPlayer
    );

    const opponent = switchPlayer(currentPlayer);

    const feedback = getCoachFeedback(
      previousBoard,
      newBoard,
      column,
      currentPlayer,
      opponent
    );

    if (gameMode === "ai") {
      if (currentPlayer === HUMAN_PLAYER) {
        addCoachMessage(`Your move: ${feedback}`);
      } else {
        addCoachMessage(`${selectedOpponent.name}: ${feedback}`);
      }
    } else {
      addCoachMessage(
        `${currentPlayer === "red" ? "Pink" : "Purple"} move: ${feedback}`
      );
    }

    setBoard(newBoard);

    if (winningLine.length >= 4) {
      setWinner(currentPlayer);
      setWinningCells(winningLine);

      if (gameMode === "ai") {
        setOpponentMood(currentPlayer === AI_PLAYER ? "won" : "lost");
      }

      return;
    }

    if (isBoardFull(newBoard)) {
      setIsDraw(true);

      if (gameMode === "ai") {
        setOpponentMood("draw");
      }

      return;
    }

    setCurrentPlayer(opponent);
    updateOpponentMood(newBoard, opponent);
  }

  function handleColumnClick(column: number) {
    if (gameMode === "ai" && currentPlayer === AI_PLAYER) {
      return;
    }

    if (isAIThinking) {
      return;
    }

    makeMove(column);
  }

  useEffect(() => {
    if (gameMode !== "ai") {
      return;
    }

    if (currentPlayer !== AI_PLAYER) {
      return;
    }

    if (winner || isDraw) {
      return;
    }

    setIsAIThinking(true);
    setOpponentMood("thinking");

    const timer = setTimeout(() => {
      const shouldMakeMistake = Math.random() < selectedOpponent.mistakeRate;

      const aiMove = shouldMakeMistake
        ? getRandomAIMove(board)
        : getAIMove(
            board,
            selectedOpponent.difficulty,
            AI_PLAYER,
            HUMAN_PLAYER
          );

      if (aiMove !== null) {
        makeMove(aiMove);
      }

      setIsAIThinking(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [
    board,
    currentPlayer,
    gameMode,
    winner,
    isDraw,
    selectedOpponentId,
    selectedThemeId,
  ]);

  async function saveGameResult(params: {
    result: "win" | "loss" | "draw";
    iqChange: number;
  }) {
    const nextIQ = Math.max(0, playerIQ + params.iqChange);

    setPlayerIQ(nextIQ);
    setSaveStatus("Saving game result...");

    const currentProfile = loadProfile();

    const updatedProfile: Profile = {
      ...DEFAULT_PROFILE,
      ...currentProfile,
      username,
      strategyIQ: nextIQ,
      selectedThemeId,
    };

    saveProfile(updatedProfile);

    try {
      await updateDatabaseProfile(updatedProfile);

      await recordMatch({
        opponentId: selectedOpponent.id,
        themeId: selectedThemeId,
        result: params.result,
        iqChange: params.iqChange,
      });

      setSaveStatus("Game result saved to Supabase.");
    } catch (error) {
      console.error("Failed to save game result:", error);
      setSaveStatus("Game result saved locally. Supabase update failed.");
    }
  }

  useEffect(() => {
    if (!hasLoadedSettings) {
      return;
    }

    if (gameMode !== "ai") {
      return;
    }

    if (iqAlreadyUpdated) {
      return;
    }

    if (winner === HUMAN_PLAYER) {
      setIqAlreadyUpdated(true);

      saveGameResult({
        result: "win",
        iqChange: selectedOpponent.winReward,
      });

      return;
    }

    if (winner === AI_PLAYER) {
      setIqAlreadyUpdated(true);

      saveGameResult({
        result: "loss",
        iqChange: -selectedOpponent.lossPenalty,
      });

      return;
    }

    if (isDraw) {
      setIqAlreadyUpdated(true);

      saveGameResult({
        result: "draw",
        iqChange: selectedOpponent.drawReward,
      });
    }
  }, [
    winner,
    isDraw,
    gameMode,
    iqAlreadyUpdated,
    selectedOpponentId,
    selectedThemeId,
    hasLoadedSettings,
  ]);

  function resetBoardOnly() {
    setBoard(createEmptyBoard());
    setCurrentPlayer(HUMAN_PLAYER);
    setWinner(null);
    setWinningCells([]);
    setIsDraw(false);
    setIsAIThinking(false);
    setCoachMessages([]);
    setIqAlreadyUpdated(false);
    setOpponentMood("idle");
    setSaveStatus("New round started.");
  }

  function getStatusText() {
    if (winner) {
      if (gameMode === "ai") {
        return winner === HUMAN_PLAYER
          ? `You defeated ${selectedOpponent.name}`
          : `${selectedOpponent.name} wins`;
      }

      return `${winner === "red" ? "Pink" : "Purple"} wins`;
    }

    if (isDraw) {
      return "Draw";
    }

    if (gameMode === "ai" && currentPlayer === AI_PLAYER) {
      return isAIThinking
        ? `${selectedOpponent.name} is thinking...`
        : "AI turn";
    }

    if (gameMode === "ai" && currentPlayer === HUMAN_PLAYER) {
      return "Your turn";
    }

    return `${currentPlayer === "red" ? "Pink" : "Purple"} player's turn`;
  }

  return (
    <main
      className={`min-h-screen overflow-x-hidden text-white ${selectedTheme.background}`}
    >
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center px-4 py-8 sm:px-6">
        <header className="mb-6 flex w-full flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p
              className={`text-sm font-bold uppercase tracking-[0.3em] ${selectedTheme.accent}`}
            >
              FourMind Arena
            </p>

            <h1 className="mt-2 text-3xl font-black">Game Arena</h1>

            <p className="mt-2 text-sm text-slate-300">{saveStatus}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-3 font-semibold">
              {getStatusText()}
            </div>

            <div className="rounded-2xl border border-yellow-300/30 bg-yellow-300/10 px-5 py-3 font-bold text-yellow-200">
              {username}: IQ {playerIQ}
            </div>

            <button
              onClick={resetBoardOnly}
              className={`rounded-2xl px-5 py-3 font-bold transition ${selectedTheme.button}`}
            >
              Restart
            </button>

            <button
              onClick={() => router.push("/menu")}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-bold transition hover:bg-white/10"
            >
              Back to Menu
            </button>
          </div>
        </header>

        <div className="grid w-full max-w-7xl gap-6 lg:grid-cols-[300px_auto_1fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
            <p
              className={`text-sm font-semibold uppercase tracking-[0.25em] ${selectedTheme.accent}`}
            >
              Opponent
            </p>

            <div className="mt-4 flex h-64 items-center justify-center overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-black/30">
              {gameMode === "ai" ? (
                <img
                  src={selectedOpponent.images[opponentMood]}
                  alt={`${selectedOpponent.name} ${opponentMood}`}
                  className="h-full w-full object-contain p-3 transition duration-300"
                />
              ) : (
                <span className="text-5xl font-black text-slate-900">
                  Local
                </span>
              )}
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              {gameMode === "ai" ? selectedOpponent.name : "Local Mode"}
            </h2>

            <p className="mt-1 text-sm uppercase tracking-[0.2em] text-slate-300">
              {gameMode === "ai" ? selectedOpponent.title : "Two players"}
            </p>

            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-400">Game IQ</p>

              <p className="mt-1 text-3xl font-black text-yellow-300">
                {gameMode === "ai" ? selectedOpponent.gameIQ : "—"}
              </p>
            </div>

            {gameMode === "ai" && (
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold">
                <div className="rounded-xl bg-emerald-400/10 px-2 py-2 text-emerald-300">
                  Win +{selectedOpponent.winReward}
                </div>

                <div className="rounded-xl bg-red-400/10 px-2 py-2 text-red-300">
                  Lose -{selectedOpponent.lossPenalty}
                </div>

                <div className="rounded-xl bg-yellow-400/10 px-2 py-2 text-yellow-300">
                  Draw +{selectedOpponent.drawReward}
                </div>
              </div>
            )}

            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-relaxed text-slate-200">
              {gameMode === "ai"
                ? opponentPhrase
                : "Local mode has no AI opponent."}
            </div>
          </aside>

          <div className="flex justify-center">
            <GameBoard
              board={board}
              winningCells={winningCells}
              onColumnClick={handleColumnClick}
              theme={selectedTheme.board}
            />
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
            <div className="mb-4">
              <p
                className={`text-sm font-semibold uppercase tracking-[0.25em] ${selectedTheme.accent}`}
              >
                AI Coach
              </p>

              <h2 className="mt-2 text-2xl font-bold">Strategy Feedback</h2>

              <p className="mt-2 text-sm text-slate-300">
                The coach explains threats, missed wins, blocks, and center
                control after each move.
              </p>
            </div>

            <div className="space-y-3">
              {coachMessages.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-400">
                  Make a move to receive strategic feedback.
                </div>
              ) : (
                coachMessages.map((message, index) => (
                  <div
                    key={`${message}-${index}`}
                    className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-relaxed text-slate-200"
                  >
                    {message}
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}