import type { Metadata } from "next";
import Header from "@/components/header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Interactive tools, visual explainers, and experiments by Mirzohid Salimov.",
};

const tools = [
  {
    href: "/playground/sudoku",
    title: "Sudoku",
    description:
      "Classic Sudoku with three difficulty levels. Keyboard navigation, error checking, and a running timer.",
    tags: ["Game", "Puzzle", "Interactive"],
    icon: (
      <svg
        className="w-6 h-6 text-rose-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="15" y1="3" x2="15" y2="21" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
      </svg>
    ),
    status: "ready" as const,
  },
  {
    href: "/playground/event-loop",
    title: "Event Loop Visualizer",
    description:
      "Step through how JavaScript processes code — call stack, web APIs, microtasks, and macrotasks, one step at a time.",
    tags: ["JavaScript", "Interactive", "Education"],
    icon: (
      <svg
        className="w-6 h-6 text-indigo-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 11-9-9" />
        <path d="M21 3v9h-9" />
      </svg>
    ),
    status: "ready" as const,
  },
  {
    href: "#",
    title: "Big-O Visualizer",
    description:
      "Compare algorithm complexity curves — O(1), O(log n), O(n), O(n²) — with live input size controls.",
    tags: ["Algorithms", "Math", "Education"],
    icon: (
      <svg
        className="w-6 h-6 text-emerald-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    status: "soon" as const,
  },
  {
    href: "#",
    title: "CSS Grid Builder",
    description:
      "Visually construct CSS grid layouts by dragging and resizing — get the generated CSS instantly.",
    tags: ["CSS", "Interactive", "Design"],
    icon: (
      <svg
        className="w-6 h-6 text-violet-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
    status: "soon" as const,
  },
  {
    href: "#",
    title: "Regex Playground",
    description:
      "Test and debug regular expressions live with match highlighting, group capture, and common pattern snippets.",
    tags: ["JavaScript", "Tooling"],
    icon: (
      <svg
        className="w-6 h-6 text-amber-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    status: "soon" as const,
  },
];

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-4xl mx-auto">

          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Playground
            </h1>
            <p className="text-slate-500 text-lg max-w-xl">
              Interactive tools and visual explainers I built to understand
              things better — and hopefully make them easier for others too.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <div
                key={tool.title}
                className={`bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3 ${
                  tool.status === "ready"
                    ? "hover:border-indigo-300 hover:shadow-sm transition-all cursor-default"
                    : "opacity-60"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {tool.icon}
                  </div>
                  {tool.status === "soon" && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
                      Coming soon
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="font-bold text-slate-900 mb-1">{tool.title}</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {tool.status === "ready" && (
                  <Link
                    href={tool.href}
                    className="mt-1 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors text-center"
                  >
                    Try it →
                  </Link>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}
