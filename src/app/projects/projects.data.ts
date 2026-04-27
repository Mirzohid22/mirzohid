type Project = {
    title: string;
    description: string;
    tools: string[];
    demo: string | null;
    source: string | null;
}

export const projects: Project[] = [
    {
        title: "BM Electronics",
        description: "The official site of BM Electronics",
        tools: ["React.js", "Tailwind.css"],
        demo: "https://bme.uz/",
        source: null
    },
    {
        title: "Infusion CMS",
        description: "Client Management System for Med Clinics",
        tools: ["React.js", "Node.js", "MongoDB"],
        demo: "https://infusion-client.vercel.app",
        source: "https://github.com/Mirzohid22/infusion-client"
    },
    {
        title: "QQL",
        description: "Enterprise Resource Planning system for project and process management",
        tools: ["React.js", "Ant Design", "React Query", "Redux Toolkit", "Vite"],
        demo: null,
        source: null
    },
]; 