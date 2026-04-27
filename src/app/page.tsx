import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import Details from "@/components/details";
import mirzohid from "../../public/mirzohid.jpg";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="container mx-auto px-4 pt-12 pb-16 sm:pt-24 sm:pb-20 flex flex-col items-center text-center">
        <div className="relative mb-6">
          <Image
            src={mirzohid}
            width={128}
            height={128}
            className="rounded-full ring-4 ring-indigo-100 ring-offset-2"
            alt="Mirzohid Salimov"
          />
          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
        </div>

        <p className="text-indigo-500 font-medium text-sm uppercase tracking-widest mb-3">
          Available for work
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
          Mirzohid Salimov
        </h1>
        <p className="text-slate-500 text-lg font-medium mb-6">
          Frontend Developer · Tashkent, Uzbekistan
        </p>

        <p className="max-w-lg text-slate-600 text-base leading-relaxed mb-10">
          4+ years building production web apps — from B2B ERP systems to
          freelance client projects. I specialise in the React.js ecosystem and
          love turning complex requirements into clean, usable interfaces.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <Link
            href="https://drive.google.com/file/d/1GuhvYUwReGxITLgG6sNyEHltFPZtGVXr/view?usp=sharing"
            target="_blank"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Download CV
          </Link>
          <Link
            href="/projects"
            className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-sm font-semibold transition-colors"
          >
            View Projects
          </Link>
        </div>

        <Details />
      </section>
    </main>
  );
}
