"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type ItemColor = "blue" | "amber" | "violet" | "emerald";
type Zone = "callStack" | "webApis" | "microQueue" | "macroQueue" | "eventLoop";

interface VisItem {
  id: string;
  label: string;
  color?: ItemColor;
}

interface Step {
  description: string;
  callStack: VisItem[];
  webApis: VisItem[];
  microQueue: VisItem[];
  macroQueue: VisItem[];
  output: string[];
  highlight: Zone | null;
  activeLine?: number;
}

interface Example {
  name: string;
  code: string;
  steps: Step[];
}

// ─── Example data ─────────────────────────────────────────────────────────────

const EXAMPLES: Example[] = [
  {
    name: "setTimeout basics",
    code: `console.log('start')

setTimeout(() => {
  console.log('timeout')
}, 0)

console.log('end')`,
    steps: [
      {
        description: "Script starts executing — it is pushed onto the Call Stack as the main frame.",
        callStack: [{ id: "main", label: "(main script)" }],
        webApis: [],
        microQueue: [],
        macroQueue: [],
        output: [],
        highlight: "callStack",
      },
      {
        description: "console.log('start') is called and pushed onto the Call Stack.",
        callStack: [
          { id: "main", label: "(main script)" },
          { id: "cl1", label: "console.log('start')" },
        ],
        webApis: [],
        microQueue: [],
        macroQueue: [],
        output: [],
        highlight: "callStack",
        activeLine: 1,
      },
      {
        description: "'start' is printed. console.log returns and is popped off the stack.",
        callStack: [{ id: "main", label: "(main script)" }],
        webApis: [],
        microQueue: [],
        macroQueue: [],
        output: ["start"],
        highlight: null,
        activeLine: 1,
      },
      {
        description: "setTimeout() is called. It hands the callback off to the Browser's Web APIs and starts a 0 ms timer. setTimeout itself is then popped.",
        callStack: [{ id: "main", label: "(main script)" }],
        webApis: [{ id: "timer", label: "Timer (0 ms)", color: "amber" }],
        microQueue: [],
        macroQueue: [],
        output: ["start"],
        highlight: "webApis",
        activeLine: 3,
      },
      {
        description: "console.log('end') is pushed onto the Call Stack and executes.",
        callStack: [
          { id: "main", label: "(main script)" },
          { id: "cl2", label: "console.log('end')" },
        ],
        webApis: [{ id: "timer", label: "Timer (0 ms)", color: "amber" }],
        microQueue: [],
        macroQueue: [],
        output: ["start"],
        highlight: "callStack",
        activeLine: 7,
      },
      {
        description: "'end' is printed. The main script finishes — Call Stack is now completely empty.",
        callStack: [],
        webApis: [{ id: "timer", label: "Timer (0 ms)", color: "amber" }],
        microQueue: [],
        macroQueue: [],
        output: ["start", "end"],
        highlight: null,
        activeLine: 7,
      },
      {
        description: "The timer fires! The callback is moved from Web APIs into the Macro Task Queue.",
        callStack: [],
        webApis: [],
        microQueue: [],
        macroQueue: [{ id: "tcb", label: "setTimeout callback", color: "emerald" }],
        output: ["start", "end"],
        highlight: "macroQueue",
      },
      {
        description: "Event Loop: Call Stack is empty ✓  Microtask Queue is empty ✓  — picking up the next task from the Macro Queue.",
        callStack: [],
        webApis: [],
        microQueue: [],
        macroQueue: [{ id: "tcb", label: "setTimeout callback", color: "emerald" }],
        output: ["start", "end"],
        highlight: "eventLoop",
      },
      {
        description: "The callback is moved from the Macro Queue to the Call Stack and starts running.",
        callStack: [{ id: "tcb", label: "setTimeout callback", color: "emerald" }],
        webApis: [],
        microQueue: [],
        macroQueue: [],
        output: ["start", "end"],
        highlight: "callStack",
      },
      {
        description: "Inside the callback, console.log('timeout') is called.",
        callStack: [
          { id: "tcb", label: "setTimeout callback" },
          { id: "cl3", label: "console.log('timeout')" },
        ],
        webApis: [],
        microQueue: [],
        macroQueue: [],
        output: ["start", "end"],
        highlight: null,
        activeLine: 4,
      },
      {
        description: "Done! 'timeout' is printed. The queue is empty — execution is complete. Output order: start → end → timeout.",
        callStack: [],
        webApis: [],
        microQueue: [],
        macroQueue: [],
        output: ["start", "end", "timeout"],
        highlight: null,
      },
    ],
  },
  {
    name: "Promise vs setTimeout",
    code: `console.log('start')

setTimeout(() => {
  console.log('timeout')
}, 0)

Promise.resolve().then(() => {
  console.log('promise')
})

console.log('end')`,
    steps: [
      {
        description: "Script starts. Both setTimeout and Promise.resolve() will be called synchronously, but their callbacks go to different queues.",
        callStack: [{ id: "main", label: "(main script)" }],
        webApis: [],
        microQueue: [],
        macroQueue: [],
        output: [],
        highlight: "callStack",
      },
      {
        description: "console.log('start') executes and is popped.",
        callStack: [{ id: "main", label: "(main script)" }],
        webApis: [],
        microQueue: [],
        macroQueue: [],
        output: ["start"],
        highlight: null,
        activeLine: 1,
      },
      {
        description: "setTimeout(cb, 0) is called — callback is handed to Web APIs, timer starts.",
        callStack: [{ id: "main", label: "(main script)" }],
        webApis: [{ id: "timer", label: "Timer (0 ms)", color: "amber" }],
        microQueue: [],
        macroQueue: [],
        output: ["start"],
        highlight: "webApis",
        activeLine: 3,
      },
      {
        description: "Promise.resolve() is already resolved — .then(cb) schedules the callback directly into the Microtask Queue (no waiting needed).",
        callStack: [{ id: "main", label: "(main script)" }],
        webApis: [{ id: "timer", label: "Timer (0 ms)", color: "amber" }],
        microQueue: [{ id: "pcb", label: "Promise.then callback", color: "violet" }],
        macroQueue: [],
        output: ["start"],
        highlight: "microQueue",
        activeLine: 7,
      },
      {
        description: "console.log('end') executes. Main script finishes — Call Stack is now empty.",
        callStack: [],
        webApis: [{ id: "timer", label: "Timer (0 ms)", color: "amber" }],
        microQueue: [{ id: "pcb", label: "Promise.then callback", color: "violet" }],
        macroQueue: [],
        output: ["start", "end"],
        highlight: null,
        activeLine: 11,
      },
      {
        description: "Timer fires — setTimeout callback enters the Macro Queue. Both queues now have items.",
        callStack: [],
        webApis: [],
        microQueue: [{ id: "pcb", label: "Promise.then callback", color: "violet" }],
        macroQueue: [{ id: "tcb", label: "setTimeout callback", color: "emerald" }],
        output: ["start", "end"],
        highlight: "macroQueue",
      },
      {
        description: "Event Loop: Call Stack is empty ✓ — it always drains the Microtask Queue before taking a Macro Task!",
        callStack: [],
        webApis: [],
        microQueue: [{ id: "pcb", label: "Promise.then callback", color: "violet" }],
        macroQueue: [{ id: "tcb", label: "setTimeout callback", color: "emerald" }],
        output: ["start", "end"],
        highlight: "eventLoop",
      },
      {
        description: "Promise callback runs first — 'promise' is printed. Microtask Queue is now empty.",
        callStack: [{ id: "pcb", label: "Promise.then callback", color: "violet" }],
        webApis: [],
        microQueue: [],
        macroQueue: [{ id: "tcb", label: "setTimeout callback", color: "emerald" }],
        output: ["start", "end", "promise"],
        highlight: "callStack",
        activeLine: 8,
      },
      {
        description: "Microtask Queue is empty. Event Loop now picks the next Macro Task.",
        callStack: [],
        webApis: [],
        microQueue: [],
        macroQueue: [{ id: "tcb", label: "setTimeout callback", color: "emerald" }],
        output: ["start", "end", "promise"],
        highlight: "eventLoop",
      },
      {
        description: "Done! setTimeout callback runs — 'timeout' is printed. Key insight: microtasks always run before the next macro task.",
        callStack: [],
        webApis: [],
        microQueue: [],
        macroQueue: [],
        output: ["start", "end", "promise", "timeout"],
        highlight: null,
        activeLine: 4,
      },
    ],
  },
  {
    name: "async / await",
    code: `async function getData() {
  console.log('fetching...')
  const data = await Promise.resolve('result')
  console.log(data)
}

console.log('start')
getData()
console.log('end')`,
    steps: [
      {
        description: "Script starts. getData is defined as an async function. Synchronous execution begins.",
        callStack: [{ id: "main", label: "(main script)" }],
        webApis: [],
        microQueue: [],
        macroQueue: [],
        output: [],
        highlight: "callStack",
      },
      {
        description: "console.log('start') executes.",
        callStack: [{ id: "main", label: "(main script)" }],
        webApis: [],
        microQueue: [],
        macroQueue: [],
        output: ["start"],
        highlight: null,
        activeLine: 7,
      },
      {
        description: "getData() is called — we enter the async function.",
        callStack: [
          { id: "main", label: "(main script)" },
          { id: "gd", label: "getData()" },
        ],
        webApis: [],
        microQueue: [],
        macroQueue: [],
        output: ["start"],
        highlight: "callStack",
        activeLine: 8,
      },
      {
        description: "Inside getData(), console.log('fetching...') runs synchronously.",
        callStack: [
          { id: "main", label: "(main script)" },
          { id: "gd", label: "getData()" },
          { id: "cl1", label: "console.log('fetching...')" },
        ],
        webApis: [],
        microQueue: [],
        macroQueue: [],
        output: ["start", "fetching..."],
        highlight: null,
        activeLine: 2,
      },
      {
        description: "await pauses getData(). Promise.resolve() is already settled — the code after await is queued as a Microtask. Execution immediately returns to the caller.",
        callStack: [{ id: "main", label: "(main script)" }],
        webApis: [],
        microQueue: [{ id: "cont", label: "getData() (after await)", color: "violet" }],
        macroQueue: [],
        output: ["start", "fetching..."],
        highlight: "microQueue",
        activeLine: 3,
      },
      {
        description: "Synchronous execution continues. console.log('end') runs back in the outer script. Main script finishes — Call Stack is empty.",
        callStack: [],
        webApis: [],
        microQueue: [{ id: "cont", label: "getData() (after await)", color: "violet" }],
        macroQueue: [],
        output: ["start", "fetching...", "end"],
        highlight: null,
        activeLine: 9,
      },
      {
        description: "Event Loop: Call Stack is empty ✓ — Microtask Queue has getData()'s continuation. Running it now.",
        callStack: [],
        webApis: [],
        microQueue: [{ id: "cont", label: "getData() (after await)", color: "violet" }],
        macroQueue: [],
        output: ["start", "fetching...", "end"],
        highlight: "eventLoop",
      },
      {
        description: "getData() resumes from the line after await. data = 'result'. console.log(data) executes.",
        callStack: [
          { id: "gd", label: "getData() resumed" },
          { id: "cl2", label: "console.log(data)" },
        ],
        webApis: [],
        microQueue: [],
        macroQueue: [],
        output: ["start", "fetching...", "end", "result"],
        highlight: null,
        activeLine: 4,
      },
      {
        description: "All done! Output: start → fetching... → end → result. Notice 'end' printed before 'result' — that's await in action.",
        callStack: [],
        webApis: [],
        microQueue: [],
        macroQueue: [],
        output: ["start", "fetching...", "end", "result"],
        highlight: null,
      },
    ],
  },
];

// ─── Style helpers ─────────────────────────────────────────────────────────────

const ITEM_COLORS: Record<ItemColor, string> = {
  blue: "bg-blue-50 border-blue-200 text-blue-800",
  amber: "bg-amber-50 border-amber-200 text-amber-800",
  violet: "bg-violet-50 border-violet-200 text-violet-800",
  emerald: "bg-emerald-50 border-emerald-200 text-emerald-800",
};

function itemCls(color?: ItemColor) {
  return `px-3 py-2 rounded-lg border text-xs font-medium text-center ${
    color ? ITEM_COLORS[color] : "bg-slate-50 border-slate-200 text-slate-700"
  }`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function CodePanel({ code, activeLine }: { code: string; activeLine?: number }) {
  const lines = code.split("\n");
  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-700/60 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="text-slate-500 text-xs ml-1 font-mono">script.js</span>
      </div>
      <div className="p-4 font-mono text-sm">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`flex gap-3 rounded px-1 py-0.5 transition-colors duration-200 ${
              activeLine === i + 1 ? "bg-indigo-500/20" : ""
            }`}
          >
            <span className="text-slate-600 select-none w-4 text-right shrink-0 text-xs pt-px">
              {i + 1}
            </span>
            <span
              className={`whitespace-pre ${
                activeLine === i + 1 ? "text-indigo-200" : "text-slate-300"
              }`}
            >
              {line || " "}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VisZone({
  title,
  items,
  direction,
  highlighted,
  emptyLabel,
  titleColor,
}: {
  title: string;
  items: VisItem[];
  direction: "stack" | "queue";
  highlighted: boolean;
  emptyLabel: string;
  titleColor: string;
}) {
  return (
    <div
      className={`bg-white border rounded-xl p-3 flex flex-col gap-2 min-h-[130px] transition-all duration-300 ${
        highlighted
          ? "ring-2 ring-indigo-400 ring-offset-1 border-indigo-300"
          : "border-slate-200"
      }`}
    >
      <div className={`text-xs font-semibold uppercase tracking-widest ${titleColor}`}>
        {title}
      </div>
      <div
        className={`flex-1 flex gap-2 ${
          direction === "stack" ? "flex-col-reverse" : "flex-col"
        }`}
      >
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-300 italic">
            {emptyLabel}
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className={itemCls(item.color)}>
              {item.label}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function EventLoopVisualizer() {
  const [exampleIdx, setExampleIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  const example = EXAMPLES[exampleIdx];
  const step = example.steps[stepIdx];
  const totalSteps = example.steps.length;

  const next = useCallback(() => {
    setStepIdx((i) => Math.min(i + 1, totalSteps - 1));
  }, [totalSteps]);

  const prev = () => setStepIdx((i) => Math.max(i - 1, 0));

  const selectExample = (idx: number) => {
    setExampleIdx(idx);
    setStepIdx(0);
    setPlaying(false);
  };

  const handlePlayPause = () => {
    if (stepIdx === totalSteps - 1) {
      setStepIdx(0);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  };

  useEffect(() => {
    if (!playing) return;
    if (stepIdx >= totalSteps - 1) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(next, 1500);
    return () => clearTimeout(id);
  }, [playing, stepIdx, totalSteps, next]);

  const hi = (zone: Zone) => step.highlight === zone;

  const playLabel = playing
    ? "⏸ Pause"
    : stepIdx === totalSteps - 1
    ? "↩ Restart"
    : "▶ Play";

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <Link
            href="/playground"
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors mb-3 inline-block"
          >
            ← Back to Playground
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
            Event Loop Visualizer
          </h1>
          <p className="text-slate-500">
            Step through how JavaScript&apos;s event loop processes synchronous
            code, timers, and promises.
          </p>
        </div>

        {/* Example selector */}
        <div className="flex flex-wrap gap-2 mb-5">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => selectExample(i)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                exampleIdx === i
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {ex.name}
            </button>
          ))}
        </div>

        {/* Main grid: code (left) + zones (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <CodePanel code={example.code} activeLine={step.activeLine} />

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <VisZone
                title="Call Stack"
                items={step.callStack}
                direction="stack"
                highlighted={hi("callStack")}
                emptyLabel="empty"
                titleColor="text-blue-600"
              />
              <VisZone
                title="Web APIs"
                items={step.webApis}
                direction="queue"
                highlighted={hi("webApis")}
                emptyLabel="empty"
                titleColor="text-amber-600"
              />
            </div>

            {/* Event Loop indicator */}
            <div
              className={`flex items-center justify-center gap-2 py-2 rounded-xl border text-xs font-semibold transition-all duration-300 ${
                hi("eventLoop")
                  ? "bg-indigo-50 border-indigo-300 text-indigo-700 animate-pulse"
                  : "bg-white border-slate-200 text-slate-400"
              }`}
            >
              <svg
                className="w-4 h-4"
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
              Event Loop
            </div>

            <div className="grid grid-cols-2 gap-3">
              <VisZone
                title="Microtask Queue"
                items={step.microQueue}
                direction="queue"
                highlighted={hi("microQueue")}
                emptyLabel="empty"
                titleColor="text-violet-600"
              />
              <VisZone
                title="Macro Queue"
                items={step.macroQueue}
                direction="queue"
                highlighted={hi("macroQueue")}
                emptyLabel="empty"
                titleColor="text-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Console output */}
        <div className="bg-slate-900 rounded-xl px-4 py-3 mb-4">
          <div className="text-xs text-slate-500 font-mono mb-1.5">Console</div>
          <div className="flex flex-wrap items-center gap-1 min-h-[24px] font-mono text-sm">
            {step.output.length === 0 ? (
              <span className="text-slate-600 italic text-xs">no output yet</span>
            ) : (
              step.output.map((line, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="text-slate-600">→</span>}
                  <span className="text-green-400">{line}</span>
                </React.Fragment>
              ))
            )}
          </div>
        </div>

        {/* Step description + controls */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-slate-400 mb-1">
              Step {stepIdx + 1} of {totalSteps}
            </div>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">
              {step.description}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={prev}
              disabled={stepIdx === 0}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={handlePlayPause}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                playing
                  ? "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {playLabel}
            </button>
            <button
              onClick={next}
              disabled={stepIdx === totalSteps - 1}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${((stepIdx + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200" />
            Call Stack
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-amber-100 border border-amber-200" />
            Web APIs
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-violet-100 border border-violet-200" />
            Microtask (Promises, await)
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200" />
            Macro Task (setTimeout, setInterval)
          </div>
        </div>

      </div>
    </div>
  );
}
