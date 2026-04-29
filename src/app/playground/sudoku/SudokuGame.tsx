"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type Difficulty = "easy" | "medium" | "hard";
type Board = number[][];
type Notes = Set<number>[][];
type Cell = [number, number] | null;

const MAX_MISTAKES = 3;

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

function emptyNotes(): Notes {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => new Set<number>())
  );
}

function cloneNotes(notes: Notes): Notes {
  return notes.map((row) => row.map((s) => new Set(s)));
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

// Returns a map of "r-c" → animationDelay(ms) for every cell in a newly completed group.
// Delay starts at BASE so the gold cascade begins after the green flash ends.
const COMPLETION_BASE = 480;
const COMPLETION_STEP = 55;

function detectCompletions(board: Board, sol: Board, r: number, c: number): Map<string, number> {
  const map = new Map<string, number>();
  const set = (key: string, delay: number) => {
    if (!map.has(key) || map.get(key)! > delay) map.set(key, delay);
  };

  const full = (vals: number[], ref: number[]) =>
    vals.every((v, i) => v !== 0 && v === ref[i]);

  if (full(board[r], sol[r])) {
    for (let col = 0; col < 9; col++)
      set(`${r}-${col}`, COMPLETION_BASE + col * COMPLETION_STEP);
  }

  if (full(board.map((row) => row[c]), sol.map((row) => row[c]))) {
    for (let row = 0; row < 9; row++)
      set(`${row}-${c}`, COMPLETION_BASE + row * COMPLETION_STEP);
  }

  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  const boxVals = [0,1,2].flatMap((dr) => [0,1,2].map((dc) => board[br+dr][bc+dc]));
  const boxRef  = [0,1,2].flatMap((dr) => [0,1,2].map((dc) => sol[br+dr][bc+dc]));
  if (full(boxVals, boxRef)) {
    let seq = 0;
    for (let dr = 0; dr < 3; dr++)
      for (let dc = 0; dc < 3; dc++)
        set(`${br+dr}-${bc+dc}`, COMPLETION_BASE + seq++ * COMPLETION_STEP);
  }

  return map;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function PenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
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
  const [notes, setNotes] = useState<Notes>(emptyNotes);
  const [pencilMode, setPencilMode] = useState(false);
  const [selected, setSelected] = useState<Cell>(null);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [solved, setSolved] = useState(false);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  // cells in the flash sweep; key = "r-c"
  const [flashSet, setFlashSet] = useState<Set<string>>(new Set());
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // completion cascade: cell key → animation delay (ms)
  const [completionMap, setCompletionMap] = useState<Map<string, number>>(new Map());
  const completionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerFlash = useCallback((r: number, c: number) => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
    const cells = new Set<string>();
    for (let i = 0; i < 9; i++) {
      cells.add(`${r}-${i}`);
      cells.add(`${i}-${c}`);
    }
    setFlashSet(cells);
    flashTimer.current = setTimeout(() => setFlashSet(new Set()), 450);
  }, []);

  const triggerCompletion = useCallback((map: Map<string, number>) => {
    if (map.size === 0) return;
    if (completionTimer.current) clearTimeout(completionTimer.current);
    setCompletionMap(map);
    const maxDelay = Math.max(...Array.from(map.values()));
    completionTimer.current = setTimeout(
      () => setCompletionMap(new Map()),
      maxDelay + 700
    );
  }, []);

  const startGame = useCallback((diff: Difficulty) => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
    if (completionTimer.current) clearTimeout(completionTimer.current);
    const { puzzle: p, solution: s } = createPuzzle(diff);
    setPuzzle(p);
    setSolution(s);
    setUserBoard(cloneBoard(p));
    setNotes(emptyNotes());
    setSelected(null);
    setMistakes(0);
    setGameOver(false);
    setSolved(false);
    setTimer(0);
    setRunning(true);
    setPencilMode(false);
    setFlashSet(new Set());
    setCompletionMap(new Map());
  }, []);

  useEffect(() => {
    startGame("medium");
    return () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
      if (completionTimer.current) clearTimeout(completionTimer.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const inputNum = useCallback(
    (num: number) => {
      if (!selected || solved || gameOver) return;
      const [r, c] = selected;
      if (puzzle[r][c] !== 0) return;

      // ── Pencil / notes mode ──────────────────────────────────────────────
      if (pencilMode) {
        if (userBoard[r][c] !== 0) return;
        const nextNotes = cloneNotes(notes);
        if (nextNotes[r][c].has(num)) {
          nextNotes[r][c].delete(num);
        } else {
          nextNotes[r][c].add(num);
        }
        setNotes(nextNotes);
        return;
      }

      // No-op if tapping the digit already displayed in this cell
      if (userBoard[r][c] === num) return;

      const next = cloneBoard(userBoard);
      next[r][c] = num;
      setUserBoard(next);

      // ── Wrong digit → immediate error + mistake count ────────────────────
      if (num !== solution[r][c]) {
        const newMistakes = mistakes + 1;
        setMistakes(newMistakes);
        if (newMistakes >= MAX_MISTAKES) {
          setGameOver(true);
          setRunning(false);
        }
        return;
      }

      // ── Correct digit → sweep row & col, clean notes, celebrate groups ──
      triggerFlash(r, c);
      triggerCompletion(detectCompletions(next, solution, r, c));

      const nextNotes = cloneNotes(notes);
      nextNotes[r][c].clear();
      const br = Math.floor(r / 3) * 3;
      const bc = Math.floor(c / 3) * 3;
      for (let i = 0; i < 9; i++) {
        nextNotes[r][i].delete(num);
        nextNotes[i][c].delete(num);
      }
      for (let row = br; row < br + 3; row++) {
        for (let col = bc; col < bc + 3; col++) {
          nextNotes[row][col].delete(num);
        }
      }
      setNotes(nextNotes);

      if (isComplete(next, solution)) {
        setSolved(true);
        setRunning(false);
      }
    },
    [selected, solved, gameOver, puzzle, userBoard, solution, pencilMode, notes, mistakes, triggerFlash, triggerCompletion]
  );

  const eraseCell = useCallback(() => {
    if (!selected || solved || gameOver) return;
    const [r, c] = selected;
    if (puzzle[r][c] !== 0) return;
    const next = cloneBoard(userBoard);
    next[r][c] = 0;
    setUserBoard(next);
    const nextNotes = cloneNotes(notes);
    nextNotes[r][c].clear();
    setNotes(nextNotes);
  }, [selected, solved, gameOver, puzzle, userBoard, notes]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "p" || e.key === "P") { setPencilMode((m) => !m); return; }
      if (e.key >= "1" && e.key <= "9") { inputNum(parseInt(e.key)); return; }
      if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") { eraseCell(); return; }
      if (!selected) return;
      const [r, c] = selected;
      if (e.key === "ArrowUp")    { e.preventDefault(); setSelected([Math.max(0, r - 1), c]); }
      if (e.key === "ArrowDown")  { e.preventDefault(); setSelected([Math.min(8, r + 1), c]); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); setSelected([r, Math.max(0, c - 1)]); }
      if (e.key === "ArrowRight") { e.preventDefault(); setSelected([r, Math.min(8, c + 1)]); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, inputNum, eraseCell]);

  const handleDifficulty = (d: Difficulty) => { setDifficulty(d); startGame(d); };

  const handleReveal = () => {
    setUserBoard(cloneBoard(solution));
    setNotes(emptyNotes());
    setSolved(true);
    setRunning(false);
    setSelected(null);
  };

  // ── Cell styling ────────────────────────────────────────────────────────────

  const cellClass = (r: number, c: number): string => {
    const isFixed  = puzzle[r][c] !== 0;
    const val      = userBoard[r][c];
    const selVal   = selected ? userBoard[selected[0]][selected[1]] : 0;
    const isSelected = selected?.[0] === r && selected?.[1] === c;
    // Errors shown immediately — no showErrors gate
    const isError  = !isFixed && val !== 0 && val !== solution[r][c];
    const isSameNum = selVal !== 0 && val === selVal && !isSelected;
    const isRelated =
      selected &&
      (selected[0] === r ||
        selected[1] === c ||
        (Math.floor(selected[0] / 3) === Math.floor(r / 3) &&
          Math.floor(selected[1] / 3) === Math.floor(c / 3)));
    const isFlash = flashSet.has(`${r}-${c}`) && !isSelected && !isError;

    let bg = "bg-white";
    if (isFlash)         bg = "bg-emerald-100";
    else if (isSelected) bg = "bg-indigo-100";
    else if (isSameNum)  bg = "bg-indigo-50";
    else if (isRelated)  bg = "bg-slate-50";
    if (isError)         bg = "bg-red-50";

    const textColor = isError  ? "text-red-500"
                    : isFixed  ? "text-slate-800"
                    :            "text-indigo-600";

    const borderR = c === 2 || c === 5 ? "border-r-2 border-r-slate-400" : "border-r border-r-slate-200";
    const borderB = r === 2 || r === 5 ? "border-b-2 border-b-slate-400" : "border-b border-b-slate-200";

    return [
      bg, textColor,
      isFixed ? "font-semibold" : "font-medium",
      borderR, borderB,
      "relative flex items-center justify-center aspect-square",
      "cursor-pointer select-none transition-colors duration-150",
      "text-sm sm:text-base md:text-lg",
      !isSelected && !isError ? "hover:bg-indigo-50" : "",
    ].join(" ");
  };

  const counts = Array.from({ length: 10 }, (_, n) =>
    n === 0 ? 0 : userBoard.flat().filter((v) => v === n).length
  );
  const highlightNote = selected ? userBoard[selected[0]][selected[1]] : 0;
  const livesLeft = MAX_MISTAKES - mistakes;
  const inactive = solved || gameOver;

  return (
    <>
    <style>{`
      @keyframes sdc {
        0%   { background-color: transparent; }
        20%  { background-color: #fef08a; }
        55%  { background-color: #fde047; }
        80%  { background-color: #fef08a; }
        100% { background-color: transparent; }
      }
      .sdc { animation: sdc 0.65s ease-in-out both; }
    `}</style>
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-md mx-auto">

        {/* Header */}
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
              <p className="text-slate-500 text-sm">Fill every row, column, and 3×3 box with digits 1–9.</p>
            </div>
            <div className="text-right shrink-0">
              <div className="font-mono text-xl font-bold text-slate-700 tabular-nums">
                {formatTime(timer)}
              </div>
              {/* Lives */}
              <div className="flex items-center justify-end gap-1 mt-1.5" title={`${livesLeft} mistakes remaining`}>
                {Array.from({ length: MAX_MISTAKES }, (_, i) => (
                  <span
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                      i < livesLeft ? "bg-red-400" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              {solved && <div className="text-xs font-semibold text-emerald-600 mt-0.5">Solved!</div>}
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
            Array.from({ length: 9 }, (_, c) => {
              const cellNotes = notes[r][c];
              const hasValue  = userBoard[r][c] !== 0;
              const hasNotes  = !hasValue && cellNotes.size > 0;
              const completionDelay = completionMap.get(`${r}-${c}`);
              return (
                <div
                  key={`${r}-${c}`}
                  className={`${cellClass(r, c)}${completionDelay !== undefined ? " sdc" : ""}`}
                  style={completionDelay !== undefined ? { animationDelay: `${completionDelay}ms` } : undefined}
                  onClick={() => !inactive && setSelected([r, c])}
                >
                  {hasValue ? (
                    userBoard[r][c]
                  ) : hasNotes ? (
                    <div className="grid grid-cols-3 w-full h-full p-[1px]">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                        const active = cellNotes.has(n);
                        return (
                          <span
                            key={n}
                            className={`flex items-center justify-center text-[7px] sm:text-[9px] leading-none font-medium transition-colors ${
                              active && highlightNote === n
                                ? "text-indigo-500 font-bold"
                                : active
                                ? "text-slate-400"
                                : "text-transparent"
                            }`}
                          >
                            {n}
                          </span>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setPencilMode(false)}
            disabled={inactive}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 ${
              !pencilMode
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            <PenIcon className="w-3.5 h-3.5" />
            Normal
          </button>
          <button
            onClick={() => setPencilMode(true)}
            disabled={inactive}
            title="Pencil mode — jot candidate digits (P)"
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 ${
              pencilMode
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            <PencilIcon className="w-3.5 h-3.5" />
            Notes
          </button>
        </div>

        {/* Number pad */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => inputNum(n)}
              disabled={inactive || (!pencilMode && counts[n] >= 9)}
              className={`relative aspect-square border rounded-xl text-lg font-semibold transition-colors
                disabled:opacity-30 disabled:cursor-not-allowed ${
                pencilMode
                  ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700"
              }`}
            >
              {n}
              {!pencilMode && counts[n] > 0 && counts[n] < 9 && (
                <span className="absolute bottom-1 right-1 text-[9px] text-slate-400 leading-none">
                  {9 - counts[n]}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={eraseCell}
            disabled={inactive}
            className="aspect-square bg-white border border-slate-200 rounded-xl text-base font-semibold text-slate-400
              hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Erase (Backspace)"
          >
            ✕
          </button>
        </div>

        {/* Reveal */}
        <button
          onClick={handleReveal}
          disabled={inactive}
          className="w-full py-2 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition-colors"
        >
          Reveal solution
        </button>

        {/* Game-over banner */}
        {gameOver && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-center">
            <p className="text-red-700 font-semibold text-sm">3 mistakes — Game Over!</p>
            <button
              onClick={() => startGame(difficulty)}
              className="mt-1.5 text-sm text-red-600 underline hover:text-red-800 transition-colors"
            >
              Try again →
            </button>
          </div>
        )}

        {/* Solved banner */}
        {solved && !gameOver && (
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

        <p className="mt-4 text-xs text-slate-400 text-center">
          Click a cell then type, or use the pad. Arrow keys to navigate.
          <br />
          Press <kbd className="font-mono bg-slate-100 px-1 rounded text-slate-500">P</kbd> to toggle Notes mode.
          Wrong digits count as a mistake — 3 and it&apos;s over.
        </p>

      </div>
    </div>
    </>
  );
}
