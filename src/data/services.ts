// Service offerings for Ryze Technology.
// See design.md "Data Models" + "/services/:slug — Service Detail".
// Invariants: slugs unique (req 29.3); process step indices contiguous 1..n (req 29.4).

import type { Service } from '@app-types';

export const services: Service[] = [
  {
    slug: 'websites',
    name: 'Websites',
    tagline: 'Fast, accessible sites that earn attention and convert it.',
    icon: 'globe',
    order: 1,
    summary:
      'Marketing sites, storefronts, and web apps engineered for speed, accessibility, and measurable results.',
    whatWeDo:
      'We design and build websites from the strategy down to the last animation. That means a clear information architecture, a reusable design system, server-rendered performance, and accessibility baked in from the first commit, not bolted on before launch.',
    features: [
      {
        title: 'Performance-first builds',
        description: 'Sub-second loads with server rendering, image discipline, and tight bundle budgets.',
      },
      {
        title: 'Accessible by default',
        description: 'WCAG AA contrast, keyboard support, and screen-reader semantics on every component.',
      },
      {
        title: 'Design systems',
        description: 'A token-driven component library so your site stays consistent as it grows.',
      },
      {
        title: 'Headless commerce',
        description: 'Storefronts and checkout flows that handle real traffic without slowing down.',
      },
      {
        title: 'SEO foundations',
        description: 'Clean metadata, structured data, and canonical URLs that search engines trust.',
      },
      {
        title: 'Analytics & experiments',
        description: 'Event tracking and A/B testing wired in so you can iterate on evidence.',
      },
    ],
    techStack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Vercel'],
    process: [
      { index: 1, title: 'Discovery', description: 'We map your goals, audience, and content to a clear project scope.' },
      { index: 2, title: 'Design', description: 'We craft a design system and key page layouts you can react to early.' },
      { index: 3, title: 'Build', description: 'We engineer the site in vertical slices, shipping working pages as we go.' },
      { index: 4, title: 'Launch', description: 'We test, optimize, and deploy with monitoring and rollback in place.' },
      { index: 5, title: 'Iterate', description: 'We measure real usage and refine based on what the data shows.' },
    ],
    faqs: [
      {
        question: 'How long does a website project take?',
        answer: 'Most marketing sites ship in six to ten weeks. Storefronts and web apps take longer depending on scope, and we agree on a timeline during discovery.',
      },
      {
        question: 'Do you redesign existing sites or only build new ones?',
        answer: 'Both. We frequently rebuild aging sites on a modern stack while preserving your content, SEO equity, and brand.',
      },
      {
        question: 'Can we update content ourselves after launch?',
        answer: 'Yes. We integrate a headless CMS so your team can edit pages, posts, and products without touching code.',
      },
      {
        question: 'Will the site work well on mobile?',
        answer: 'Every site we build is responsive and tested across phones, tablets, and desktops as a baseline, not an add-on.',
      },
      {
        question: 'Do you handle hosting and maintenance?',
        answer: 'We can deploy to your infrastructure or a managed platform, and we offer ongoing maintenance to keep things fast and secure.',
      },
      {
        question: 'How do you ensure the site is accessible?',
        answer: 'We build to WCAG AA, test with keyboard and screen readers, and run automated accessibility checks in our pipeline.',
      },
    ],
    relatedCaseStudySlugs: ['orange-city-grocers'],
    seo: {
      title: 'Website Design & Development',
      description: 'Fast, accessible websites, storefronts, and web apps engineered for performance and conversion.',
      canonical: 'https://ryze.technology/services/websites',
    },
  },
  {
    slug: 'mobile-apps',
    name: 'Mobile Apps',
    tagline: 'Native-quality apps that feel right in the hand.',
    icon: 'smartphone',
    order: 2,
    summary:
      'iOS and Android apps built from one codebase, tuned for real devices, real networks, and real users.',
    whatWeDo:
      'We build cross-platform mobile apps that feel native on every device. From offline-first data layers to smooth gestures and push notifications, we focus on the details that make an app feel trustworthy and fast even on a weak connection.',
    features: [
      {
        title: 'Cross-platform delivery',
        description: 'One React Native codebase ships to both iOS and Android without cutting corners.',
      },
      {
        title: 'Offline-first data',
        description: 'Local storage and background sync so the app works with no signal and reconciles cleanly.',
      },
      {
        title: 'Native integrations',
        description: 'Camera, location, biometrics, and notifications wired in with platform best practices.',
      },
      {
        title: 'Fluid motion',
        description: 'Gestures and transitions that run at 60fps and respect reduced-motion settings.',
      },
      {
        title: 'Secure by design',
        description: 'Encrypted storage, secure auth, and careful handling of sensitive data.',
      },
      {
        title: 'Store-ready releases',
        description: 'We manage builds, signing, and submission to the App Store and Play Store.',
      },
    ],
    techStack: ['React Native', 'Expo', 'TypeScript', 'SQLite', 'WatermelonDB', 'Node.js'],
    process: [
      { index: 1, title: 'Discovery', description: 'We define the core jobs your app must do and the devices it must serve.' },
      { index: 2, title: 'Prototype', description: 'We build an interactive prototype to validate flows before full engineering.' },
      { index: 3, title: 'Build', description: 'We develop features in slices with real-device testing throughout.' },
      { index: 4, title: 'Beta', description: 'We run a beta with real users, gather feedback, and harden the app.' },
      { index: 5, title: 'Release', description: 'We submit to the stores and support a smooth public launch.' },
      { index: 6, title: 'Support', description: 'We monitor crashes and usage, then ship updates that keep the app healthy.' },
    ],
    faqs: [
      {
        question: 'Do you build separate apps for iOS and Android?',
        answer: 'We build a single React Native codebase that ships to both platforms, which keeps cost down and feature parity high while still feeling native.',
      },
      {
        question: 'Can the app work without an internet connection?',
        answer: 'Yes. We specialize in offline-first apps that store data locally and sync automatically once a connection returns.',
      },
      {
        question: 'Will you handle App Store and Play Store submission?',
        answer: 'We manage builds, code signing, store listings, and the review process so your launch goes smoothly.',
      },
      {
        question: 'How do you keep user data secure?',
        answer: 'We use encrypted local storage, secure authentication, and careful permission handling, and we follow each platform\u2019s privacy guidelines.',
      },
      {
        question: 'Can you add to or fix an app we already have?',
        answer: 'Yes. We can take over an existing codebase, stabilize it, and extend it with new features.',
      },
      {
        question: 'How do you test on real devices?',
        answer: 'We test across a range of physical phones and tablets, plus simulators, and run a beta program before release.',
      },
    ],
    relatedCaseStudySlugs: ['mednudge-care-companion'],
    seo: {
      title: 'Mobile App Development',
      description: 'Cross-platform iOS and Android apps with offline-first data and native-quality performance.',
      canonical: 'https://ryze.technology/services/mobile-apps',
    },
  },
  {
    slug: 'desktop',
    name: 'Desktop Software',
    tagline: 'Powerful desktop tools for work that lives on the big screen.',
    icon: 'monitor',
    order: 3,
    summary:
      'Cross-platform desktop applications for teams whose work demands more than a browser tab.',
    whatWeDo:
      'We build desktop software for control rooms, studios, and operations teams that need keyboard-driven speed, multi-monitor layouts, and access to local hardware. We bring web engineering ergonomics to native desktop without sacrificing performance.',
    features: [
      {
        title: 'Cross-platform desktop',
        description: 'One codebase that runs natively on Windows, macOS, and Linux.',
      },
      {
        title: 'Multi-monitor layouts',
        description: 'Dense, configurable workspaces designed for people who live on several screens.',
      },
      {
        title: 'Local hardware access',
        description: 'Printers, scanners, serial devices, and the file system integrated directly.',
      },
      {
        title: 'Offline capability',
        description: 'Full functionality without a network, with sync when connectivity returns.',
      },
      {
        title: 'Keyboard-first speed',
        description: 'Shortcuts and command palettes built for high-volume daily operators.',
      },
      {
        title: 'Auto-updates',
        description: 'Signed, background updates so every workstation stays current and secure.',
      },
    ],
    techStack: ['Electron', 'React', 'TypeScript', 'Node.js', 'SQLite', 'Rust'],
    process: [
      { index: 1, title: 'Discovery', description: 'We study the daily workflow and the hardware your team relies on.' },
      { index: 2, title: 'Design', description: 'We design dense, efficient layouts tailored to multi-monitor use.' },
      { index: 3, title: 'Build', description: 'We engineer the app with local-first data and native integrations.' },
      { index: 4, title: 'Rollout', description: 'We package signed installers and deploy across your workstations.' },
      { index: 5, title: 'Maintain', description: 'We ship auto-updates and respond to the needs of power users.' },
    ],
    faqs: [
      {
        question: 'Why build a desktop app instead of a website?',
        answer: 'Desktop apps win when you need deep hardware access, dense multi-monitor layouts, guaranteed offline use, or keyboard-driven speed for all-day operators.',
      },
      {
        question: 'Which operating systems do you support?',
        answer: 'We target Windows, macOS, and Linux from a single codebase, and we can prioritize the platforms your team actually uses.',
      },
      {
        question: 'Can the app connect to local devices and printers?',
        answer: 'Yes. We integrate printers, scanners, serial hardware, and the local file system directly into the application.',
      },
      {
        question: 'How are updates delivered?',
        answer: 'We ship signed auto-updates that install in the background, so every workstation stays current without manual reinstalls.',
      },
      {
        question: 'Does the desktop app work offline?',
        answer: 'Yes. We design for full offline functionality with a local data store that syncs once a connection is available.',
      },
      {
        question: 'Can it share a backend with our web or mobile apps?',
        answer: 'Absolutely. We commonly build a shared backend so desktop, web, and mobile stay in sync on the same data.',
      },
    ],
    relatedCaseStudySlugs: ['vidarbha-logistics-hub'],
    seo: {
      title: 'Desktop Software Development',
      description: 'Cross-platform desktop applications with multi-monitor layouts, hardware access, and offline support.',
      canonical: 'https://ryze.technology/services/desktop',
    },
  },
  {
    slug: 'business-systems',
    name: 'Business Systems',
    tagline: 'Custom platforms that replace spreadsheets and busywork.',
    icon: 'workflow',
    order: 4,
    summary:
      'Internal tools, dashboards, and automation that turn manual operations into a single source of truth.',
    whatWeDo:
      'We build the systems that run a business: dashboards, admin panels, workflow automation, and integrations. We start by mapping how work actually flows today, then replace the spreadsheets and manual handoffs with one reliable platform your team trusts.',
    features: [
      {
        title: 'Custom dashboards',
        description: 'Live operational views that surface the numbers your team checks every day.',
      },
      {
        title: 'Workflow automation',
        description: 'Approvals, notifications, and scheduled jobs that remove repetitive manual steps.',
      },
      {
        title: 'Role-based access',
        description: 'Fine-grained permissions so the right people see and change the right things.',
      },
      {
        title: 'Integrations',
        description: 'Connections to your accounting, CRM, and payment tools so data stays in sync.',
      },
      {
        title: 'Reporting & exports',
        description: 'Reliable reports and exports that replace fragile spreadsheet formulas.',
      },
      {
        title: 'Audit trails',
        description: 'A clear record of who changed what and when, for accountability and compliance.',
      },
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma', 'Redis', 'WebSocket'],
    process: [
      { index: 1, title: 'Discovery', description: 'We map your current workflows and find where time and accuracy are lost.' },
      { index: 2, title: 'Blueprint', description: 'We model the data and design the system around how your team really works.' },
      { index: 3, title: 'Build', description: 'We deliver modules incrementally so value lands early and often.' },
      { index: 4, title: 'Migrate', description: 'We move your existing data in safely and train the team on the new system.' },
      { index: 5, title: 'Optimize', description: 'We refine workflows and reporting as your operations evolve.' },
    ],
    faqs: [
      {
        question: 'We run everything on spreadsheets today. Where do we start?',
        answer: 'We start by mapping your real workflows, then replace the most error-prone spreadsheets first so you see value quickly without a risky big-bang switch.',
      },
      {
        question: 'Can the system integrate with our existing tools?',
        answer: 'Yes. We connect to accounting, CRM, payment, and other tools so data flows automatically instead of being re-keyed.',
      },
      {
        question: 'How do you control who can access what?',
        answer: 'We build role-based access with fine-grained permissions and audit trails, so people only see and change what their role allows.',
      },
      {
        question: 'Will you migrate our existing data?',
        answer: 'We plan and run the data migration carefully, validate it against your records, and keep your old data available during the transition.',
      },
      {
        question: 'Can the system grow as our business changes?',
        answer: 'Yes. We build modular systems so new workflows, reports, and integrations can be added without a rebuild.',
      },
      {
        question: 'How do you keep our operational data safe?',
        answer: 'We use secure authentication, encrypted storage, regular backups, and audit logging to protect your data and recover from mistakes.',
      },
    ],
    relatedCaseStudySlugs: ['vidarbha-logistics-hub', 'orange-city-grocers'],
    seo: {
      title: 'Business Systems & Internal Tools',
      description: 'Custom dashboards, workflow automation, and integrations that replace spreadsheets with one source of truth.',
      canonical: 'https://ryze.technology/services/business-systems',
    },
  },
];
