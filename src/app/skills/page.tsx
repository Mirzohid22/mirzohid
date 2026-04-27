import type { Metadata } from "next";
import Header from "@/components/header";
import { skillCategories } from "./skills.data";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Technical skills of Mirzohid Salimov — React, Next.js, TypeScript, Node.js, PostgreSQL, and more.",
};

const categoryStyle: Record<string, string> = {
  Frontend: "bg-indigo-50 text-indigo-700 border border-indigo-100",
  Backend: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  Databases: "bg-amber-50 text-amber-700 border border-amber-100",
  Tools: "bg-slate-100 text-slate-600 border border-slate-200",
};

export default function Skills() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Skills</h1>
          <p className="text-slate-500 mb-10">Technologies and tools I work with.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {skillCategories.map((group) => (
              <div
                key={group.category}
                className="bg-white rounded-xl border border-slate-200 p-6"
              >
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                  {group.category}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        categoryStyle[group.category] ??
                        "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
