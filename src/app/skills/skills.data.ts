type SkillCategory = {
  category: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: 'Frontend',
    skills: ['React.js', 'Next.js', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Ant Design', 'Redux Toolkit'],
  },
  {
    category: 'Backend',
    skills: ['Node.js', 'Express.js', 'REST APIs'],
  },
  {
    category: 'Databases',
    skills: ['MongoDB', 'PostgreSQL', 'MySQL'],
  },
  {
    category: 'Tools',
    skills: ['Git', 'Vite', 'Figma', 'Docker'],
  },
]
