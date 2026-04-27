import type { Metadata } from "next";
import Header from "@/components/header";
import { jobs } from "./experience.data";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Professional experience of Mirzohid Salimov — Frontend Developer at BM Electronics and 2+ years of freelance full-stack work.",
};

export default function Experience() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Experience</h1>
          <p className="text-slate-500 mb-12">My professional journey.</p>

          <div className="relative">
            <div className="absolute left-0 top-2 bottom-2 w-px bg-slate-200" />
            <div className="flex flex-col gap-10 pl-8">
              {jobs.map((job, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[34px] top-1 w-3.5 h-3.5 rounded-full border-2 border-indigo-500 bg-white" />
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-0.5">
                    <h2 className="text-base font-semibold text-slate-900">
                      {job.role}
                    </h2>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      {job.type}
                    </span>
                  </div>
                  <p className="text-indigo-600 text-sm font-medium mb-0.5">
                    {job.company}
                  </p>
                  <p className="text-xs text-slate-400 mb-3">{job.period}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {job.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
