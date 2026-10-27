type Project = {
    title: string;
    description: string;
    tools: string[];
    demo: string | null;
    source: string | null;
}

export const projects: Project[] = [
    {
        title: "BMEL ERP",
        description: "Production ERP for BM Electronics, a national electronics distributor. Covers finance and accounting, inventory, sales and delivery, with a built-in AI data assistant that streams answers from live company data.",
        tools: ["React", "React Query", "MUI", "SSE", "Claude API"],
        demo: "https://my.bmel.uz",
        source: null
    },
    {
        title: "QQL — Qishloq Qurilish Loyiha",
        description: "Construction project management ERP. Template-based database schema, Hikvision face-recognition attendance via ISAPI webhooks, budget tracking, invoices, trilingual reports and a Claude-powered report-analysis assistant.",
        tools: ["React", "TypeScript", "Ant Design", "Redux Toolkit", "React Query", "Vite"],
        demo: "https://qqlmonitoring.uz/",
        source: null
    },
    {
        title: "Taklifly",
        description: "Animated online wedding invitations shared as a link. Built solo end to end in Uzbek, Russian and English, and self-hosted on a Hetzner VPS behind nginx.",
        tools: ["Next.js", "PostgreSQL", "Prisma", "Docker", "nginx"],
        demo: "https://taklifly.uz",
        source: null
    },
    {
        title: "BM Electronics",
        description: "Official corporate website for BM Electronics, with GSAP animations and internationalization, deployed with Docker.",
        tools: ["React", "Tailwind CSS", "GSAP", "Docker"],
        demo: "https://bme.uz/",
        source: null
    },
];
