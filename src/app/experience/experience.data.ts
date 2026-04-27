type Job = {
  company: string;
  role: string;
  period: string;
  type: string;
  description: string;
}

export const jobs: Job[] = [
  {
    company: 'BM Electronics',
    role: 'Frontend Developer',
    period: 'May 2024 – Present',
    type: 'Full-time · On-site',
    description:
      'Working on frontend development of internal business applications including ERP systems and B2B POS platforms. Building responsive interfaces, integrating frontend components with backend APIs, and improving usability of business-critical web apps.',
  },
  {
    company: 'Self-employed',
    role: 'Freelance Web Developer',
    period: 'Sep 2022 – May 2024',
    type: 'Freelance',
    description:
      'Full-stack freelance work: built web applications for clients, integrated REST APIs, and worked with MongoDB, React.js and Node.js.',
  },
  {
    company: 'Software Systems',
    role: 'Frontend Web Developer',
    period: 'May 2021 – May 2022',
    type: 'Part-time',
    description:
      'Built React.js frontends, worked with HTML/CSS, and collaborated in team workflows.',
  },
  {
    company: 'Software Systems',
    role: 'Web Developer',
    period: 'Apr 2021 – May 2021',
    type: 'Internship',
    description:
      'Internship focused on CSS, Git, and foundational web development practices.',
  },
]
