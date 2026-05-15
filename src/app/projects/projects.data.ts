type Project = {
    title: string;
    description: string;
    tools: string[];
    demo: string | null;
    source: string | null;
}

export const projects: Project[] = [
    {
        title: "QQL — Qishloq Qurilish Loyiha",
        description: "Enterprise Resource Planning system for project and process management. Designed and built from the ground up — modelling project workflows, process states, and team-level views into a maintainable React architecture with Redux Toolkit and React Query for server-state management.",
        tools: ["React.js", "Ant Design", "Redux Toolkit", "React Query", "Vite"],
        demo: null,
        source: null
    },
    {
        title: "BMEL ERP",
        description: "Internal ERP for BM Electronics — a distribution company. Production ERP system used to manage all areas of company staff and operations, covering employees, roles and access, day-to-day workflows, and reporting across the distribution business.",
        tools: ["React.js", "Redux Toolkit", "React Query"],
        demo: "https://my.bmel.uz",
        source: null
    },
    {
        title: "BM Electronics",
        description: "Official corporate website for BM Electronics, built with React and Tailwind for fast iteration and a responsive, polished UI.",
        tools: ["React.js", "Tailwind CSS"],
        demo: "https://bme.uz/",
        source: null
    },
]; 