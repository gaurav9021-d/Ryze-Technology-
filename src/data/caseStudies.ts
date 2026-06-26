// Case study content for the Ryze Technology portfolio.
// See design.md "Data Models" + "/portfolio/:slug — Case Study Detail".
// Invariants (requirements 29.3): slugs are unique within this collection.

import type { CaseStudy } from '@app-types';

export const caseStudies: CaseStudy[] = [
  {
    slug: 'orange-city-grocers',
    title: 'A storefront that turned aisle browsers into loyal subscribers',
    client: 'Orange City Grocers',
    category: 'websites',
    services: ['websites', 'business-systems'],
    year: 2024,
    role: 'Product strategy, full-stack engineering, design system',
    featured: true,
    order: 1,
    summary:
      'A Nagpur grocery chain wanted online ordering without losing the neighbourhood feel. We built a fast storefront and a subscription engine that keeps regulars coming back.',
    hero: {
      src: '/images/case-studies/orange-city-grocers-hero.jpg',
      width: 1600,
      height: 900,
      alt: 'Orange City Grocers storefront homepage on a laptop and phone',
    },
    challenge:
      'Orange City Grocers ran six stores on phone orders and handwritten ledgers. Repeat customers wanted recurring deliveries, but the team had no way to schedule, bill, or track them, and a slow legacy site drove shoppers to national apps.',
    solution:
      'We shipped a server-rendered storefront with sub-second navigation, a recurring-order subscription engine, and an inventory dashboard that syncs stock across all six stores. Drivers get an optimized daily route, and customers manage deliveries from a single account page.',
    results: [
      { label: 'Online revenue growth', value: 240, suffix: '%' },
      { label: 'Repeat order rate', value: 68, suffix: '%' },
      { label: 'Faster page loads', value: 4, suffix: 'x' },
      { label: 'Active subscriptions', value: 1200, suffix: '+' },
    ],
    gallery: [
      {
        src: '/images/case-studies/orange-city-grocers-gallery-1.jpg',
        width: 1280,
        height: 800,
        alt: 'Product listing grid with category filters',
      },
      {
        src: '/images/case-studies/orange-city-grocers-gallery-2.jpg',
        width: 1280,
        height: 800,
        alt: 'Subscription management screen on mobile',
      },
      {
        src: '/images/case-studies/orange-city-grocers-gallery-3.jpg',
        width: 1280,
        height: 800,
        alt: 'Store inventory dashboard with stock levels',
      },
      {
        src: '/images/case-studies/orange-city-grocers-gallery-4.jpg',
        width: 1280,
        height: 800,
        alt: 'Delivery route map for the driver app',
      },
    ],
    testimonialId: 't-orange-city-grocers',
    techStack: ['React', 'Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Stripe', 'Redis'],
    learnings: [
      'Subscription churn dropped sharply once we let customers skip a week instead of cancelling outright.',
      'Inventory accuracy mattered more than feature count; reliable stock counts built shopper trust.',
    ],
    relatedSlugs: ['vidarbha-logistics-hub'],
    seo: {
      title: 'Orange City Grocers — Grocery storefront & subscriptions',
      description:
        'How we helped a Nagpur grocery chain grow online revenue 240% with a fast storefront and recurring delivery engine.',
      canonical: 'https://ryze.technology/portfolio/orange-city-grocers',
    },
  },
  {
    slug: 'mednudge-care-companion',
    title: 'A care companion app that keeps patients on track between visits',
    client: 'MedNudge Health',
    category: 'mobile',
    services: ['mobile-apps'],
    year: 2024,
    role: 'Mobile architecture, offline sync, design system',
    featured: true,
    order: 2,
    summary:
      'A clinic network needed a patient app that works on patchy networks across Vidarbha. We built an offline-first companion for medication reminders and follow-ups.',
    hero: {
      src: '/images/case-studies/mednudge-care-companion-hero.jpg',
      width: 1600,
      height: 900,
      alt: 'MedNudge care companion app shown on two smartphones',
    },
    challenge:
      'Patients in semi-urban Vidarbha frequently missed medication doses and follow-up appointments. Connectivity was unreliable, so any reminder system had to work entirely offline and reconcile cleanly once a signal returned.',
    solution:
      'We built an offline-first React Native app with a conflict-free local store, scheduled local notifications for doses, and a background sync layer that reconciles reminders and visit notes with the clinic backend. Caregivers can manage a relative\u2019s schedule from the same account.',
    results: [
      { label: 'Medication adherence', value: 82, suffix: '%' },
      { label: 'Follow-up attendance', value: 57, suffix: '%' },
      { label: 'Works offline', value: 100, suffix: '%' },
      { label: 'Patients onboarded', value: 9000, suffix: '+' },
    ],
    gallery: [
      {
        src: '/images/case-studies/mednudge-care-companion-gallery-1.jpg',
        width: 1280,
        height: 800,
        alt: 'Daily medication schedule screen',
      },
      {
        src: '/images/case-studies/mednudge-care-companion-gallery-2.jpg',
        width: 1280,
        height: 800,
        alt: 'Reminder notification on a lock screen',
      },
      {
        src: '/images/case-studies/mednudge-care-companion-gallery-3.jpg',
        width: 1280,
        height: 800,
        alt: 'Caregiver dashboard tracking a relative',
      },
    ],
    testimonialId: 't-mednudge-care-companion',
    techStack: ['React Native', 'Expo', 'TypeScript', 'SQLite', 'WatermelonDB', 'Node.js'],
    learnings: [
      'Local-first storage with deterministic merge rules removed nearly all sync conflicts.',
      'Plain-language reminders outperformed clinical wording for adherence in user testing.',
    ],
    seo: {
      title: 'MedNudge — Offline-first patient care companion app',
      description:
        'An offline-first mobile app that lifted medication adherence to 82% across patchy networks in Vidarbha.',
      canonical: 'https://ryze.technology/portfolio/mednudge-care-companion',
    },
  },
  {
    slug: 'vidarbha-logistics-hub',
    title: 'An operations hub that replaced spreadsheets for a regional fleet',
    client: 'Vidarbha Logistics',
    category: 'systems',
    services: ['business-systems', 'desktop'],
    year: 2023,
    role: 'Systems design, full-stack engineering, desktop tooling',
    featured: true,
    order: 3,
    summary:
      'A freight operator ran dispatch on spreadsheets and phone calls. We built a real-time operations hub plus a desktop dispatch console for the control room.',
    hero: {
      src: '/images/case-studies/vidarbha-logistics-hub-hero.jpg',
      width: 1600,
      height: 900,
      alt: 'Vidarbha Logistics operations dashboard on a wide monitor',
    },
    challenge:
      'Vidarbha Logistics coordinated 140 vehicles with shared spreadsheets that went stale within minutes. Dispatchers double-booked trucks, billing lagged days behind, and no one had a live view of where shipments actually were.',
    solution:
      'We delivered a real-time operations hub with live shipment tracking, automated billing, and role-based access, paired with a native desktop dispatch console built for the control room\u2019s multi-monitor setup. Events stream over websockets so every screen reflects the same state instantly.',
    results: [
      { label: 'Dispatch errors cut', value: 91, suffix: '%' },
      { label: 'Billing cycle faster', value: 6, suffix: 'x' },
      { label: 'Fleet utilisation', value: 34, suffix: '%' },
      { label: 'Hours saved weekly', value: 120, suffix: '+' },
    ],
    gallery: [
      {
        src: '/images/case-studies/vidarbha-logistics-hub-gallery-1.jpg',
        width: 1280,
        height: 800,
        alt: 'Live shipment tracking map',
      },
      {
        src: '/images/case-studies/vidarbha-logistics-hub-gallery-2.jpg',
        width: 1280,
        height: 800,
        alt: 'Desktop dispatch console across two monitors',
      },
      {
        src: '/images/case-studies/vidarbha-logistics-hub-gallery-3.jpg',
        width: 1280,
        height: 800,
        alt: 'Automated billing summary screen',
      },
      {
        src: '/images/case-studies/vidarbha-logistics-hub-gallery-4.jpg',
        width: 1280,
        height: 800,
        alt: 'Role-based access settings panel',
      },
    ],
    testimonialId: 't-vidarbha-logistics-hub',
    techStack: ['React', 'TypeScript', 'Electron', 'Node.js', 'PostgreSQL', 'WebSocket', 'Redis'],
    learnings: [
      'A native desktop console beat the browser for dispatchers who live on multi-monitor rigs all day.',
      'Streaming a single source of truth to every screen eliminated the double-booking problem entirely.',
    ],
    relatedSlugs: ['orange-city-grocers'],
    seo: {
      title: 'Vidarbha Logistics — Real-time fleet operations hub',
      description:
        'A real-time operations hub and desktop dispatch console that cut dispatch errors 91% for a regional freight fleet.',
      canonical: 'https://ryze.technology/portfolio/vidarbha-logistics-hub',
    },
  },
];
