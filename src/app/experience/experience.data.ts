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
      'Develop and maintain the frontend of internal business applications used in day-to-day operations, including ERP systems and B2B POS platforms. Build intuitive, responsive interfaces with React and Next.js, translating product requirements into clean component architecture. Integrate frontend components with backend REST APIs, optimising data flow and state management for performance and reliability. Collaborate with product managers, designers, and backend engineers to improve the usability and stability of business-critical web applications.',
  },
  {
    company: 'Self-employed',
    role: 'Freelance Web Developer',
    period: 'Sep 2022 – May 2024',
    type: 'Freelance · Remote',
    description:
      'Delivered end-to-end web projects for clients, covering UI implementation, API integration, and deployment. Worked across the stack with React / Next.js on the frontend and Node.js + MongoDB on the backend to ship features quickly and iteratively. Owned client communication — gathering requirements, providing estimates, and delivering production-ready solutions.',
  },
  {
    company: 'Software Systems',
    role: 'Frontend Web Developer',
    period: 'May 2021 – May 2022',
    type: 'Part-time',
    description:
      'Built and maintained user-facing features in React.js, working from designs and product specifications. Implemented responsive layouts with HTML and CSS and integrated them with backend services. Contributed to code reviews and team discussions on component structure and reusability.',
  },
  {
    company: 'Software Systems',
    role: 'Web Developer Intern',
    period: 'Apr 2021 – May 2021',
    type: 'Internship',
    description:
      'Learned production workflows around Git-based collaboration and code review. Built small frontend features using HTML, CSS, and JavaScript under the guidance of senior engineers.',
  },
]
