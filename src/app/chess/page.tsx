import type { Metadata } from "next";
import Header from "@/components/header";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chess",
  description:
    "Chess.com profile and ratings for Mirzohid Salimov — Rapid, Blitz, Bullet, and Tactics stats.",
};

const USERNAME = "device_22";
const PROFILE_URL = `https://www.chess.com/member/${USERNAME}`;
const API = `https://api.chess.com/pub/player/${USERNAME}`;
const HEADERS = {
  "User-Agent": "MirzohidPortfolio/1.0 (mirzohidsalimov22@gmail.com)",
};

// ─── Types ────────────────────────────────────────────────────────────────────

type GameRecord = { win: number; loss: number; draw: number };
type RatingInfo = {
  last: { rating: number; date: number };
  best: { rating: number; date: number };
  record: GameRecord;
};

type ChessStats = {
  chess_rapid?: RatingInfo;
  chess_blitz?: RatingInfo;
  chess_bullet?: RatingInfo;
  chess_daily?: RatingInfo;
  tactics?: { highest: { rating: number }; lowest: { rating: number } };
  puzzle_rush?: { best: { total_attempts: number; score: number } };
};

type ChessProfile = {
  username: string;
  name?: string;
  avatar?: string;
  url: string;
  followers: number;
  joined: number;
  last_online: number;
  country?: string;
  title?: string;
};

// ─── Fetchers ─────────────────────────────────────────────────────────────────

async function fetchProfile(): Promise<ChessProfile | null> {
  try {
    const res = await fetch(API, {
      headers: HEADERS,
      next: { revalidate: 1000 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function fetchStats(): Promise<ChessStats | null> {
  try {
    const res = await fetch(`${API}/stats`, {
      headers: HEADERS,
      next: { revalidate: 1000 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function countryCode(url?: string) {
  if (!url) return null;
  return url.split("/").pop() ?? null;
}

const GAME_MODES = [
  { key: "chess_rapid" as const, label: "Rapid", time: "10–30 min" },
  { key: "chess_blitz" as const, label: "Blitz", time: "3–5 min" },
  { key: "chess_bullet" as const, label: "Bullet", time: "< 3 min" },
  { key: "chess_daily" as const, label: "Daily", time: "Online" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ChessPage() {
  const [profile, stats] = await Promise.all([fetchProfile(), fetchStats()]);

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-3xl mx-auto">
          {!profile ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
              <p className="text-slate-600 font-medium mb-1">
                Could not reach Chess.com
              </p>
              <p className="text-slate-400 text-sm mb-5">
                The API may be temporarily unavailable.
              </p>
              <Link
                href={PROFILE_URL}
                target="_blank"
                className="text-sm font-semibold text-emerald-600 hover:underline"
              >
                View profile on Chess.com →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* ── Profile card ── */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  {profile.avatar ? (
                    <Image
                      src={profile.avatar}
                      width={64}
                      height={64}
                      alt={profile.username}
                      className="rounded-full ring-2 ring-slate-100 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-3xl">
                      ♞
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h1 className="text-lg font-bold text-slate-900">
                        {profile.name || profile.username}
                      </h1>
                      {profile.title && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          {profile.title}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-3">
                      @{profile.username}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-4">
                      {countryCode(profile.country) && (
                        <span>{countryCode(profile.country)}</span>
                      )}
                      <span>
                        {profile.followers.toLocaleString()} followers
                      </span>
                      <span>Joined {formatDate(profile.joined)}</span>
                      <span>Last seen {formatDate(profile.last_online)}</span>
                    </div>

                    <Link
                      href={PROFILE_URL}
                      target="_blank"
                      className="inline-block px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "#7fa650" }}
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              </div>

              {/* ── Game mode ratings ── */}
              {stats && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {GAME_MODES.map(({ key, label, time }) => {
                      const data = stats[key];
                      if (!data) return null;
                      const { win, loss, draw } = data.record;
                      const total = win + loss + draw;
                      const winPct = total > 0 ? (win / total) * 100 : 0;
                      const drawPct = total > 0 ? (draw / total) * 100 : 0;
                      const lossPct = total > 0 ? (loss / total) * 100 : 0;
                      return (
                        <div
                          key={key}
                          className="bg-white border border-slate-200 rounded-xl p-5"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                {label}
                              </p>
                              <p className="text-xs text-slate-400">{time}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-bold text-slate-900">
                                {data.last.rating}
                              </p>
                              <p className="text-xs text-slate-400">
                                Best:{" "}
                                <span className="font-semibold text-slate-600">
                                  {data.best.rating}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* W/D/L stacked bar */}
                          <div className="h-1.5 rounded-full overflow-hidden flex mb-2">
                            <div
                              className="bg-emerald-500 h-full"
                              style={{ width: `${winPct}%` }}
                            />
                            <div
                              className="bg-slate-300 h-full"
                              style={{ width: `${drawPct}%` }}
                            />
                            <div
                              className="bg-red-400 h-full"
                              style={{ width: `${lossPct}%` }}
                            />
                          </div>
                          <div className="flex gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                              {win}W
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
                              {draw}D
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                              {loss}L
                            </span>
                            <span className="ml-auto text-slate-400">
                              {total} games
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ── Tactics + Puzzle Rush ── */}
                  {(stats.tactics || stats.puzzle_rush) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {stats.tactics && (
                        <div className="bg-white border border-slate-200 rounded-xl p-5">
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
                            Tactics
                          </p>
                          <p className="text-3xl font-bold text-slate-900 mb-1">
                            {stats.tactics.highest.rating}
                          </p>
                          <p className="text-xs text-slate-400">
                            Lowest: {stats.tactics.lowest.rating}
                          </p>
                        </div>
                      )}
                      {stats.puzzle_rush?.best && (
                        <div className="bg-white border border-slate-200 rounded-xl p-5">
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
                            Puzzle Rush
                          </p>
                          <p className="text-3xl font-bold text-slate-900 mb-1">
                            {stats.puzzle_rush.best.score}
                          </p>
                          <p className="text-xs text-slate-400">
                            Best score · {stats.puzzle_rush.best.total_attempts}{" "}
                            attempts
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
