// Client testimonials for the Ryze Technology site.
// See design.md "Data Models" (Testimonial) and requirements 8.1.
// Invariant: ids prefixed `t-` match the `testimonialId` referenced by
// the corresponding case study in caseStudies.ts, and `caseStudySlug`
// matches that case study's slug.

import type { ImageAsset, Testimonial } from '@app-types';

/** Build a square avatar ImageAsset for a testimonial author. */
function avatar(id: string, name: string): ImageAsset {
  return {
    src: `/images/testimonials/${id}.jpg`,
    width: 96,
    height: 96,
    alt: `Photo of ${name}`,
  };
}

export const testimonials: Testimonial[] = [
  {
    id: 't-orange-city-grocers',
    quote:
      'Ryze understood the neighbourhood feel we were scared of losing online. The new storefront is fast, our regulars subscribe, and stock finally stays in sync across every store.',
    author: 'Sanjay Mehta',
    authorRole: 'Managing Director',
    company: 'Orange City Grocers',
    avatar: avatar('sanjay-mehta', 'Sanjay Mehta'),
    caseStudySlug: 'orange-city-grocers',
    rating: 5,
  },
  {
    id: 't-mednudge-care-companion',
    quote:
      'The app just works, even where the network does not. Our patients are sticking to their medication and showing up for follow-ups in numbers we had not seen before.',
    author: 'Dr. Priya Nair',
    authorRole: 'Clinical Director',
    company: 'MedNudge Health',
    avatar: avatar('priya-nair', 'Dr. Priya Nair'),
    caseStudySlug: 'mednudge-care-companion',
    rating: 5,
  },
  {
    id: 't-vidarbha-logistics-hub',
    quote:
      'We went from stale spreadsheets to a live control room. Dispatchers trust the screen, billing keeps pace, and we can finally see every shipment in real time.',
    author: 'Arvind Kale',
    authorRole: 'Head of Operations',
    company: 'Vidarbha Logistics',
    avatar: avatar('arvind-kale', 'Arvind Kale'),
    caseStudySlug: 'vidarbha-logistics-hub',
    rating: 5,
  },
  {
    id: 't-greenfield-agritech',
    quote:
      'Working with Ryze felt like adding a senior engineering team overnight. They asked sharp questions, shipped on schedule, and left us with code we can actually maintain.',
    author: 'Neha Bhandari',
    authorRole: 'Co-founder',
    company: 'Greenfield AgriTech',
    avatar: avatar('neha-bhandari', 'Neha Bhandari'),
    rating: 5,
  },
  {
    id: 't-saffron-hospitality',
    quote:
      'They cared about the details that matter to our guests. The booking flow is smooth, the site is quick, and support after launch has been genuinely responsive.',
    author: 'Imran Qureshi',
    authorRole: 'Operations Manager',
    company: 'Saffron Hospitality Group',
    avatar: avatar('imran-qureshi', 'Imran Qureshi'),
    rating: 4,
  },
];
