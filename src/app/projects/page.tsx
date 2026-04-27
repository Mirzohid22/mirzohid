import type { Metadata } from "next";
import Header from "@/components/header";
import { projects } from "./projects.data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Web applications built by Mirzohid Salimov — B2B ERP systems, CMS platforms, and client sites using React, Node.js, and MongoDB.",
};

export default function Projects() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Projects</h1>
          <p className="text-slate-500 mb-10">A selection of things I&apos;ve built.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, id) => (
              <div
                key={id}
                className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col hover:border-indigo-300 hover:shadow-md transition-all duration-200"
              >
                <h2 className="text-base font-semibold text-slate-900 mb-2">
                  {project.title}
                </h2>
                <p className="text-slate-500 text-sm mb-4 flex-1">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 text-sm font-medium border-t border-slate-100 pt-4">
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Live Demo →
                    </a>
                  )}
                  {project.source && (
                    <a
                      href={project.source}
                      target="_blank"
                      className="text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      GitHub →
                    </a>
                  )}
                  {!project.demo && !project.source && (
                    <span className="text-slate-400 text-xs">Private project</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
