import type { Metadata } from "next";
import Header from "@/components/header";
import { educationList } from "./education.data";

export const metadata: Metadata = {
  title: "Education",
  description:
    "Mirzohid Salimov's academic background — Bachelor's in Software Engineering from Tashkent University of Information Technologies (TUIT), GPA 4.59/5.",
};

export default function Education() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Education</h1>
          <p className="text-slate-500 mb-10">Academic background.</p>
          <div className="flex flex-col gap-5">
            {educationList.map((edu, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 p-6"
              >
                <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      {edu.institution}
                    </h2>
                    <p className="text-indigo-600 text-sm font-medium mt-0.5">
                      {edu.degree} · {edu.field}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-slate-500">{edu.period}</p>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">
                      GPA {edu.grade}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                    Activities &amp; Societies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {edu.activities.map((activity, i) => (
                      <span
                        key={i}
                        className="bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1 rounded-full text-xs"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
