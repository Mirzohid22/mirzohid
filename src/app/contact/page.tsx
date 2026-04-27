import type { Metadata } from "next";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Mirzohid Salimov via email, Telegram, GitHub, LinkedIn, LeetCode, or Chess.com.",
};
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import github from "../../../public/brands/github.png";
import telegram from "../../../public/brands/telegram.png";
import linkedin from "../../../public/brands/linkedin.png";
import stackoverflow from "../../../public/brands/stackoverflow.png";

function ChessIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="7" fill="#7fa650"/>
      <text x="16" y="24" fontFamily="Georgia, serif" fontSize="20" textAnchor="middle" fill="white">♞</text>
    </svg>
  );
}

function LeetCodeIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#FFA116"
        d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"
      />
    </svg>
  );
}

type Contact = {
  label: string;
  value: string;
  href: string;
} & (
  | { kind: "email" }
  | { kind: "image"; icon: StaticImageData }
  | { kind: "leetcode" }
  | { kind: "chess" }
);

const contacts: Contact[] = [
  { kind: "email", label: "Email", value: "mirzohidsalimov22@gmail.com", href: "mailto:mirzohidsalimov22@gmail.com" },
  { kind: "image", label: "Telegram", value: "@mirzohidsalimov", href: "https://t.me/mirzohidsalimov", icon: telegram },
  { kind: "image", label: "GitHub", value: "github.com/Mirzohid22", href: "https://github.com/Mirzohid22", icon: github },
  { kind: "image", label: "LinkedIn", value: "linkedin.com/in/mirzohid-salimov", href: "https://www.linkedin.com/in/mirzohid-salimov/", icon: linkedin },
  { kind: "leetcode", label: "LeetCode", value: "leetcode.com/u/MirzohidSalimov", href: "https://leetcode.com/u/MirzohidSalimov/" },
  { kind: "chess", label: "Chess.com", value: "chess.com/member/device_22", href: "https://www.chess.com/member/device_22" },
  { kind: "image", label: "Stack Overflow", value: "mirzohid-salimov", href: "https://stackoverflow.com/users/17851958/mirzohid-salimov", icon: stackoverflow },
];

export default function Contact() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Contact</h1>
          <p className="text-slate-500 mb-10">
            Feel free to reach out via any of the channels below.
          </p>
          <div className="flex flex-col gap-3">
            {contacts.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                target="_blank"
                className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 hover:border-indigo-300 hover:shadow-md transition-all duration-200 group"
              >
                {c.kind === "chess" ? (
                  <div className="shrink-0"><ChessIcon /></div>
                ) : c.kind === "leetcode" ? (
                  <div className="shrink-0"><LeetCodeIcon /></div>
                ) : c.kind === "image" ? (
                  <Image src={c.icon} width={32} height={32} alt={c.label} className="rounded shrink-0" />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 rounded-lg text-indigo-600 font-bold text-sm shrink-0">
                    @
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">{c.label}</p>
                  <p className="text-sm font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{c.value}</p>
                </div>
                <span className="text-slate-300 group-hover:text-indigo-400 transition-colors text-lg shrink-0">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
