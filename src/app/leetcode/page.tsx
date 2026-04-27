import type { Metadata } from "next";
import Header from "@/components/header";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LeetCode",
  description:
    "LeetCode problem-solving stats for Mirzohid Salimov — solved count, difficulty breakdown, global ranking, and recent submissions.",
};

const USERNAME = "MirzohidSalimov";
const PROFILE_URL = `https://leetcode.com/u/${USERNAME}/`;

// ─── Types ────────────────────────────────────────────────────────────────────

type AcCount = { difficulty: string; count: number; submissions: number };
type QCount = { difficulty: string; count: number };
type RecentSub = { id: string; title: string; titleSlug: string; timestamp: string };
type Badge = { id: string; displayName: string; icon: string };

type Profile = {
  ranking: number;
  userAvatar: string;
  realName: string;
  aboutMe: string;
  school: string;
  websites: string[];
  countryName: string;
  company: string;
  jobTitle: string;
  skillTags: string[];
  reputation: number;
  starRating: number;
};

type MatchedUser = {
  username: string;
  githubUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  profile: Profile;
  submitStats: { acSubmissionNum: AcCount[] };
  userCalendar: { streak: number; totalActiveDays: number } | null;
  badges: Badge[];
  activeBadge: Badge | null;
};

type GQLData = {
  matchedUser: MatchedUser | null;
  allQuestionsCount: QCount[];
};

// ─── Fetchers ─────────────────────────────────────────────────────────────────

const GQL_HEADERS = {
  "Content-Type": "application/json",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Referer: "https://leetcode.com",
  Origin: "https://leetcode.com",
};

/** Scrape the LeetCode profile HTML to extract __NEXT_DATA__ */
async function scrapeNextData(): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(PROFILE_URL, {
      headers: {
        "User-Agent": GQL_HEADERS["User-Agent"],
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(
      /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/
    );
    if (!match?.[1]) return null;
    return JSON.parse(match[1]) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Full profile query — fetches everything the LeetCode profile page shows */
async function fetchProfile(): Promise<GQLData | null> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: GQL_HEADERS,
      body: JSON.stringify({
        query: `
          query fullProfile($username: String!) {
            matchedUser(username: $username) {
              username
              githubUrl
              twitterUrl
              linkedinUrl
              profile {
                ranking
                userAvatar
                realName
                aboutMe
                school
                websites
                countryName
                company
                jobTitle
                skillTags
                reputation
                starRating
              }
              submitStats: submitStatsGlobal {
                acSubmissionNum { difficulty count submissions }
              }
              userCalendar { streak totalActiveDays }
              badges { id displayName icon }
              activeBadge { id displayName icon }
            }
            allQuestionsCount { difficulty count }
          }
        `,
        variables: { username: USERNAME },
      }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data as GQLData) ?? null;
  } catch {
    return null;
  }
}

/** Recent accepted submissions */
async function fetchRecent(): Promise<RecentSub[]> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: GQL_HEADERS,
      body: JSON.stringify({
        query: `
          query recent($username: String!) {
            recentAcSubmissionList(username: $username, limit: 10) {
              id title titleSlug timestamp
            }
          }
        `,
        variables: { username: USERNAME },
      }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data?.recentAcSubmissionList as RecentSub[]) ?? [];
  } catch {
    return [];
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(ts: string) {
  return new Date(parseInt(ts) * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const diffConfig = {
  Easy: {
    bar: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  Medium: {
    bar: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  Hard: {
    bar: "bg-red-500",
    badge: "bg-red-50 text-red-700 border-red-200",
  },
} as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function LeetCodePage() {
  const [gql, recent] = await Promise.all([
    fetchProfile(),
    fetchRecent(),
    scrapeNextData(), // fires in parallel; result logged/unused but warms the HTML cache
  ]);

  const user = gql?.matchedUser ?? null;
  const profile = user?.profile;
  const ac = user?.submitStats.acSubmissionNum ?? [];
  const all = gql?.allQuestionsCount ?? [];

  const totalSolved = ac.find((d) => d.difficulty === "All")?.count ?? 0;
  const totalQuestions = all.find((d) => d.difficulty === "All")?.count ?? 0;
  const ranking = profile?.ranking ?? null;
  const streak = user?.userCalendar?.streak ?? null;
  const activeDays = user?.userCalendar?.totalActiveDays ?? null;

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-3xl mx-auto">

          {!user ? (
            /* ── Error state ── */
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto mb-4 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v4M12 17h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                    stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-slate-600 font-medium mb-1">Could not reach LeetCode</p>
              <p className="text-slate-400 text-sm mb-5">The API may be temporarily unavailable.</p>
              <Link href={PROFILE_URL} target="_blank"
                className="text-sm font-semibold text-indigo-600 hover:underline">
                View profile on LeetCode →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-5">

              {/* ── Profile card ── */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-start gap-5 flex-wrap">
                  {profile?.userAvatar && (
                    <Image
                      src={profile.userAvatar}
                      width={72}
                      height={72}
                      alt={user.username}
                      className="rounded-full ring-2 ring-slate-100 shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-0.5">
                      <h1 className="text-xl font-bold text-slate-900">
                        {profile?.realName || user.username}
                      </h1>
                      {user.activeBadge && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: "#FFA11620", color: "#FFA116" }}>
                          {user.activeBadge.displayName}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-2">@{user.username}</p>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-3">
                      {profile?.countryName && <span>{profile.countryName}</span>}
                      {profile?.company && <span>{profile.company}</span>}
                      {profile?.jobTitle && <span>{profile.jobTitle}</span>}
                      {profile?.school && <span>{profile.school}</span>}
                    </div>

                    {/* About */}
                    {profile?.aboutMe && (
                      <p className="text-sm text-slate-600 leading-relaxed mb-3 max-w-lg">
                        {profile.aboutMe}
                      </p>
                    )}

                    {/* Social links */}
                    <div className="flex gap-3 flex-wrap">
                      <Link href={PROFILE_URL} target="_blank"
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-colors"
                        style={{ backgroundColor: "#FFA116" }}>
                        LeetCode Profile
                      </Link>
                      {user.githubUrl && (
                        <Link href={user.githubUrl} target="_blank"
                          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                          GitHub
                        </Link>
                      )}
                      {user.linkedinUrl && (
                        <Link href={user.linkedinUrl} target="_blank"
                          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                          LinkedIn
                        </Link>
                      )}
                      {profile?.websites?.map((url) => (
                        <Link key={url} href={url} target="_blank"
                          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                          Website
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skill tags */}
                {profile?.skillTags && profile.skillTags.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-slate-100">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                      Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skillTags.map((tag) => (
                        <span key={tag}
                          className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-0.5 rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Stats row ── */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <StatCard
                  label="Solved"
                  value={totalSolved}
                  sub={totalQuestions > 0 ? `/ ${totalQuestions} total` : undefined}
                />
                {ranking !== null && (
                  <StatCard
                    label="Global Rank"
                    value={`#${ranking.toLocaleString()}`}
                  />
                )}
                {activeDays !== null && (
                  <div className="col-span-2 sm:col-span-1 bg-white border border-slate-200 rounded-xl p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
                      Active Days
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{activeDays}</p>
                    {streak !== null && streak > 0 && (
                      <p className="text-xs text-amber-500 font-semibold mt-1">
                        {streak}-day streak
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* ── Difficulty breakdown ── */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">
                  Difficulty Breakdown
                </h2>
                <div className="flex flex-col gap-5">
                  {(["Easy", "Medium", "Hard"] as const).map((diff) => {
                    const solved = ac.find((d) => d.difficulty === diff)?.count ?? 0;
                    const total = all.find((d) => d.difficulty === diff)?.count ?? 0;
                    const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
                    const cfg = diffConfig[diff];
                    return (
                      <div key={diff}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cfg.badge}`}>
                            {diff}
                          </span>
                          <span className="text-sm text-slate-500">
                            <span className="font-bold text-slate-800">{solved}</span>
                            {" / "}
                            {total}
                            <span className="text-xs text-slate-400 ml-1.5">({pct}%)</span>
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${cfg.bar} rounded-full`}
                            style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Badges ── */}
              {user.badges.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                    Badges
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {user.badges.map((badge) => (
                      <div key={badge.id}
                        className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                        {badge.icon && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={badge.icon.startsWith("http") ? badge.icon : `https://leetcode.com${badge.icon}`}
                            width={24}
                            height={24}
                            alt={badge.displayName}
                            className="object-contain"
                          />
                        )}
                        <span className="text-xs font-medium text-slate-700">
                          {badge.displayName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Recent AC submissions ── */}
              {recent.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                    Recently Solved
                  </h2>
                  <div className="divide-y divide-slate-100">
                    {recent.map((sub) => (
                      <a key={sub.id}
                        href={`https://leetcode.com/problems/${sub.titleSlug}/`}
                        target="_blank"
                        className="flex items-center justify-between py-3 group">
                        <span className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {sub.title}
                        </span>
                        <span className="text-xs text-slate-400 shrink-0 ml-6">
                          {formatDate(sub.timestamp)}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}
