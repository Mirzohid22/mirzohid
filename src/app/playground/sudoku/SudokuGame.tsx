"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type Difficulty = "easy" | "medium" | "hard";
type Board = number[][];
type Cell = [number, number] | null;

// ─── Sudoku logic ─────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function canPlace(board: Board, row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

function fillBoard(board: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (const num of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
          if (canPlace(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

function createPuzzle(difficulty: Difficulty): { puzzle: Board; solution: Board } {
  const solution: Board = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillBoard(solution);

  const puzzle = cloneBoard(solution);
  const removes = difficulty === "easy" ? 36 : difficulty === "medium" ? 46 : 52;
  const positions = shuffle(Array.from({ length: 81 }, (_, i) => i));

  for (let i = 0; i < removes; i++) {
    const pos = positions[i];
    puzzle[Math.floor(pos / 9)][pos % 9] = 0;
  }

  return { puzzle, solution };
}

function isComplete(user: Board, solution: Board): boolean {
  return user.every((row, r) => row.every((v, c) => v === solution[r][c]));
}

function formatTime(s: number): string {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export default function SudokuGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [puzzle, setPuzzle] = useState<Board>(() =>
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );
  const [solution, setSolution] = useState<Board>(() =>
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );
  const [userBoard, setUserBoard] = useState<Board>(() =>
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );
  const [selected, setSelected] = useState<Cell>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [solved, setSolved] = useState(false);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);

  const startGame = useCallback((diff: Difficulty) => {
    const { puzzle: p, solution: s } = createPuzzle(diff);
    setPuzzle(p);
    setSolution(s);
    setUserBoard(cloneBoard(p));
    setSelected(null);
    setShowErrors(false);
    setSolved(false);
    setTimer(0);
    setRunning(true);
  }, []);

  // Start on mount
  useEffect(() => {
    startGame("medium");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const inputNum = useCallback(
    (num: number) => {
      if (!selected || solved) return;
      const [r, c] = selected;
      if (puzzle[r][c] !== 0) return;
      const next = cloneBoard(userBoard);
      next[r][c] = num;
      setUserBoard(next);
      setShowErrors(false);
      if (isComplete(next, solution)) {
        setSolved(true);
        setRunning(false);
      }
    },
    [selected, solved, puzzle, userBoard, solution]
  );

  const eraseCell = useCallback(() => {
    if (!selected || solved) return;
    const [r, c] = selected;
    if (puzzle[r][c] !== 0) return;
    const next = cloneBoard(userBoard);
    next[r][c] = 0;
    setUserBoard(next);
    setShowErrors(false);
  }, [selected, solved, puzzle, userBoard]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= "1" && e.key <= "9") {
        inputNum(parseInt(e.key));
        return;
      }
      if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
        eraseCell();
        return;
      }
      if (!selected) return;
      const [r, c] = selected;
      if (e.key === "ArrowUp") { e.preventDefault(); setSelected([Math.max(0, r - 1), c]); }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected([Math.min(8, r + 1), c]); }
      if (e.key === "ArrowLeft") { e.preventDefault(); setSelected([r, Math.max(0, c - 1)]); }
      if (e.key === "ArrowRight") { e.preventDefault(); setSelected([r, Math.min(8, c + 1)]); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, inputNum, eraseCell]);

  const handleDifficulty = (d: Difficulty) => {
    setDifficulty(d);
    startGame(d);
  };

  const handleReveal = () => {
    setUserBoard(cloneBoard(solution));
    setSolved(true);
    setRunning(false);
    setSelected(null);
    setShowErrors(false);
  };

  // ── Cell styling ────────────────────────────────────────────────────────────

  const cellStyle = (r: number, c: number): string => {
    const isFixed = puzzle[r][c] !== 0;
    const val = userBoard[r][c];
    const selVal = selected ? userBoard[selected[0]][selected[1]] : 0;
    const isSelected = selected?.[0] === r && selected?.[1] === c;
    const isError = showErrors && !isFixed && val !== 0 && val !== solution[r][c];
    const isSameNum = selVal !== 0 && val === selVal && !isSelected;
    const isRelated =
      selected &&
      (selected[0] === r ||
        selected[1] === c ||
        (Math.floor(selected[0] / 3) === Math.floor(r / 3) &&
          Math.floor(selected[1] / 3) === Math.floor(c / 3)));

    let bg = "bg-white";
    if (isSelected) bg = "bg-indigo-100";
    else if (isSameNum) bg = "bg-indigo-50";
    else if (isRelated) bg = "bg-slate-50";
    if (isError) bg = "bg-red-50";

    const textColor = isError
      ? "text-red-500"
      : isFixed
      ? "text-slate-800"
      : "text-indigo-600";

    const weight = isFixed ? "font-semibold" : "font-medium";

    const borderR =
      c === 2 || c === 5
        ? "border-r-2 border-r-slate-400"
        : "border-r border-r-slate-200";
    const borderB =
      r === 2 || r === 5
        ? "border-b-2 border-b-slate-400"
        : "border-b border-b-slate-200";

    return [
      bg,
      textColor,
      weight,
      borderR,
      borderB,
      "flex items-center justify-center aspect-square",
      "cursor-pointer select-none transition-colors duration-100",
      "text-sm sm:text-base md:text-lg",
      !isSelected && !isError ? "hover:bg-indigo-50" : "",
    ].join(" ");
  };

  // How many of each number have been placed
  const counts = Array.from({ length: 10 }, (_, n) =>
    n === 0
      ? 0
      : userBoard.flat().filter((v) => v === n).length
  );

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-md mx-auto">

        {/* Page header */}
        <div className="mb-6">
          <Link
            href="/playground"
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors mb-3 inline-block"
          >
            ← Back to Playground
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Sudoku</h1>
              <p className="text-slate-500 text-sm">
                Fill every row, column, and 3×3 box with digits 1–9.
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="font-mono text-xl font-bold text-slate-700 tabular-nums">
                {formatTime(timer)}
              </div>
              {solved && (
                <div className="text-xs font-semibold text-emerald-600 mt-0.5">Solved!</div>
              )}
            </div>
          </div>
        </div>

        {/* Difficulty + New Game */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => handleDifficulty(d)}
              className={`capitalize px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                difficulty === d
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => startGame(difficulty)}
            className="ml-auto px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            New Game
          </button>
        </div>

        {/* Grid */}
        <div className="w-full border-2 border-slate-400 rounded-xl overflow-hidden grid grid-cols-9 mb-4">
          {Array.from({ length: 9 }, (_, r) =>
            Array.from({ length: 9 }, (_, c) => (
              <div
                key={`${r}-${c}`}
                className={cellStyle(r, c)}
                onClick={() => !solved && setSelected([r, c])}
              >
                {userBoard[r][c] !== 0 ? userBoard[r][c] : ""}
              </div>
            ))
          )}
        </div>

        {/* Number pad */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => inputNum(n)}
              disabled={counts[n] >= 9}
              className="relative aspect-square bg-white border border-slate-200 rounded-xl text-lg font-semibold text-slate-700
                hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-colors"
            >
              {n}
              {counts[n] > 0 && counts[n] < 9 && (
                <span className="absolute bottom-1 right-1 text-[9px] text-slate-400 leading-none">
                  {9 - counts[n]}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={eraseCell}
            className="aspect-square bg-white border border-slate-200 rounded-xl text-base font-semibold text-slate-400
              hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors"
            title="Erase (Backspace)"
          >
            ✕
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowErrors(true)}
            disabled={solved}
            className="flex-1 py-2 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            Check
          </button>
          <button
            onClick={handleReveal}
            disabled={solved}
            className="flex-1 py-2 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            Reveal
          </button>
        </div>

        {/* Solved banner */}
        {solved && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-center">
            <p className="text-emerald-700 font-semibold text-sm">
              Solved in {formatTime(timer)}!
            </p>
            <button
              onClick={() => startGame(difficulty)}
              className="mt-1.5 text-sm text-emerald-600 underline hover:text-emerald-800 transition-colors"
            >
              Play again →
            </button>
          </div>
        )}

        {/* Hint */}
        <p className="mt-4 text-xs text-slate-400 text-center">
          Click a cell then type, or use the pad. Arrow keys to navigate.
          <br />
          Small numbers in pad corners show remaining placements.
        </p>

      </div>
    </div>
  );
}
