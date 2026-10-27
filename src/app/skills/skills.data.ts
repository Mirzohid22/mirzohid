type SkillCategory = {
  category: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: 'Languages',
    skills: ['JavaScript', 'TypeScript', 'SQL', 'HTML/CSS'],
  },
  {
    category: 'Frontend',
    skills: ['React', 'Next.js', 'React Query', 'Redux Toolkit', 'react-hook-form', 'MUI', 'Ant Design', 'Tailwind CSS', 'Vite', 'Webpack', 'i18next'],
  },
  {
    category: 'Backend & data',
    skills: ['Node.js', 'Fastify', 'Express.js', 'REST APIs', 'PostgreSQL', 'Prisma', 'MongoDB'],
  },
  {
    category: 'AI',
    skills: ['Claude API', 'Claude Code', 'Agentic orchestration', 'Subagents', 'MCP', 'Context engineering', 'LLM streaming (SSE)'],
  },
  {
    category: 'DevOps',
    skills: ['Docker', 'nginx', 'Linux VPS', 'Cloudflare', 'GitLab CI/CD', 'Git'],
  },
  {
    category: 'Quality',
    skills: ['Jest', 'ESLint', 'Prettier', 'Code review', 'Feature-Sliced Design'],
  },
]
