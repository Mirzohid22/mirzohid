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
    role: 'Software Developer (Frontend)',
    period: 'May 2024 – Present',
    type: 'Full-time · On-site',
    description:
      'Build and maintain the company’s internal platforms: BMEL ERP, the Daftar operations and POS apps, and the corporate site bme.uz. Built the ERP’s AI data assistant end to end, streaming answers from live company data over SSE with inline charts, chat history and permission-based access. Deliver features across finance and accounting (fixed assets, ledger, Balance Sheet and Trial Balance reports, period closing, payments) and inventory, sales and delivery (IMEI and serial tracking, inventory lots, stock transfers, orders, returns, bulk Excel import). Focus on performance and UX with server-side pagination, debounced search, URL-synced filters, code splitting and React Query caching, backed by reusable hooks, role-based access, internationalization, unit and integration tests, and staged releases.',
  },
  {
    company: 'Self-employed',
    role: 'Freelance Web Developer',
    period: 'Sep 2022 – May 2024',
    type: 'Freelance · Remote',
    description:
      'Delivered end-to-end web projects for clients, covering UI, API integration and deployment. Worked across the stack with React / Next.js on the frontend and Node.js + MongoDB on the backend. Owned client communication: requirements, estimates and production-ready delivery.',
  },
  {
    company: 'Software Systems',
    role: 'Frontend Web Developer',
    period: 'Apr 2021 – May 2022',
    type: 'Internship, then part-time',
    description:
      'Built and maintained user-facing features in React from designs and product specs. Implemented responsive layouts, integrated them with backend services and took part in code reviews.',
  },
]
