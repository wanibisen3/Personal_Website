export const cvData = {
  personal: {
    name: "Wani Bisen",
    title: "Product Manager | AI & LLM Strategist | Ex-Fivetran SDE",
    email: "wanibisen3@gmail.com",
    linkedin: "https://www.linkedin.com/in/wanibisen/",
  },
  experience: [
    {
      company: "Enprivacy",
      role: "Product Manager — AI & LLMs",
      period: "Apr 2025 – Sep 2025",
      highlights: [
        "Owned full 0-to-1 product strategy for AI-driven privacy compliance tooling.",
        "Directed LLM integration for automated data classification across strict regulatory constraints.",
        "Aligned engineering roadmap with go-to-market strategy for scalable enterprise adoption.",
      ],
    },
    {
      company: "INSEAD & The Wharton School",
      role: "MBA — Business Strategy & Finance",
      period: "2024 – 2025",
      highlights: [
        "Translated a deep-tech foundation into frameworks for market entry and corporate finance.",
        "Led cross-functional student teams on fintech and market intelligence initiatives.",
        "Bridging computer science principles with executive execution across global markets.",
      ],
    },
    {
      company: "Fivetran",
      role: "Senior Software Development Engineer → Product Owner",
      period: "2022 – 2024",
      highlights: [
        "Architected enterprise ETL pipelines enabling Fortune 500 clients to scale strategic analytics.",
        "Transitioned into Product Owner — owned roadmap, led sprint planning, and aligned stakeholders.",
        "Backend optimisations translated directly into measurable product stickiness metrics.",
      ],
      transition: true,
    },
    {
      company: "ZS Associates",
      role: "Senior SDET → Team Lead",
      period: "2016 – 2022",
      highlights: [
        "Managed 10+ engineers across global platforms for pharmaceutical analytics systems.",
        "Reduced release cycle time by 60% by leading CI/CD pipeline automation.",
        "Championed quality gates adopted as company-wide engineering standards.",
      ],
      statHighlight: "Reduced release cycle time by 60%",
    },
  ],
  projects: [
    {
      title: "Product OS",
      description:
        "Engineering execution diverges from product strategy. I built a context-driven framework that deploys AI agents as structural product managers — decoupling strategy from execution and keeping both aligned at scale.",
      status: "Active (2026 - Present)",
      tags: ["LLM Orchestration", "AI Agents", "Workflow Design", "Product Strategy"],
      link: "https://github.com/wanibisen3/ai-product-os",
      featured: true,
      problem:
        "In fast-moving engineering teams, product context decays after every sprint. Roadmaps drift, tickets lose intent, and engineers make architectural decisions without strategic grounding.",
      approach:
        "Designed a persistent context layer that feeds LLM agents with structured product memory: goals, constraints, trade-offs, and prior decisions. Agents then act as embedded PM proxies across the sprint lifecycle.",
      outcome:
        "A working open-source framework actively used to align AI agent behavior with product goals — reducing strategic drift and enabling non-technical stakeholders to interrogate product decisions in plain language.",
    },
    {
      title: "Executive AI Decision Support",
      description:
        "Non-technical executives struggle to extract signal from AI market cycles. I built a platform that translates emerging technology trends into concise, investment-ready business strategy briefs.",
      status: "Active (2026 - Present)",
      tags: ["AI", "Strategy", "Product Management"],
      link: "https://ai-signals-for-leaders.vercel.app/",
    },
    {
      title: "My INSEAD CV",
      description:
        "INSEADers waste hours manually tailoring CVs for every application. I built a tool that takes your CV template + any job description and produces a tailored, ATS-optimised Word/PDF in 60 seconds — preserving your exact formatting, zero hallucination. Free, forever, for the INSEAD community.",
      status: "Live",
      tags: ["AI", "Community", "Career tools"],
      link: "https://cv-webapp-production.up.railway.app/",
    },
    {
      title: "Cross-border Payments Intelligence",
      description:
        "International payment routing is opaque and costly. I'm building a predictive intelligence layer that optimises cross-border transaction paths for margin and compliance efficiency.",
      status: "Active (2026 - Present)",
      tags: ["Fintech", "Payments", "Predictive Analytics"],
      link: "https://moneyflow-rho.vercel.app/",
    },
  ],
};
