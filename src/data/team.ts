// Team profiles for the Ryze Technology studio in Nagpur.
// See design.md "Data Models" (TeamMember) and requirements 11.2.
// Portrait ids reuse the shared author ids where sensible so the same
// placeholder square portraits under /images/team/<id>.jpg are used everywhere.

import type { ImageAsset, TeamMember } from '@app-types';

/** Build a square portrait ImageAsset from a stable member id. */
function portrait(id: string, name: string): ImageAsset {
  return {
    src: `/images/team/${id}.jpg`,
    width: 480,
    height: 480,
    alt: `Portrait of ${name}`,
  };
}

export const team: TeamMember[] = [
  {
    id: 'aanya-deshmukh',
    name: 'Aanya Deshmukh',
    role: 'Founder & Principal Engineer',
    bio: 'Aanya started Ryze to build software that holds up under real Indian conditions. She leads architecture across the studio and still ships code most weeks.',
    portrait: portrait('aanya-deshmukh', 'Aanya Deshmukh'),
    socials: [
      { platform: 'linkedin', url: 'https://www.linkedin.com/in/aanya-deshmukh' },
      { platform: 'github', url: 'https://github.com/aanya-deshmukh' },
      { platform: 'email', url: 'mailto:aanya@ryze.technology' },
    ],
    order: 1,
  },
  {
    id: 'rohan-iyer',
    name: 'Rohan Iyer',
    role: 'Head of Platform',
    bio: 'Rohan owns the backend and infrastructure that keeps client systems fast and reliable. He cares about boring, dependable software that quietly does its job.',
    portrait: portrait('rohan-iyer', 'Rohan Iyer'),
    socials: [
      { platform: 'linkedin', url: 'https://www.linkedin.com/in/rohan-iyer' },
      { platform: 'github', url: 'https://github.com/rohan-iyer' },
      { platform: 'x', url: 'https://x.com/rohan_iyer' },
    ],
    order: 2,
  },
  {
    id: 'meera-kulkarni',
    name: 'Meera Kulkarni',
    role: 'Design Systems Lead',
    bio: 'Meera turns dense product requirements into interfaces people actually enjoy using. She maintains the studio design system and obsesses over accessibility.',
    portrait: portrait('meera-kulkarni', 'Meera Kulkarni'),
    socials: [
      { platform: 'linkedin', url: 'https://www.linkedin.com/in/meera-kulkarni' },
      { platform: 'dribbble', url: 'https://dribbble.com/meera-kulkarni' },
      { platform: 'email', url: 'mailto:meera@ryze.technology' },
    ],
    order: 3,
  },
  {
    id: 'kabir-sharma',
    name: 'Kabir Sharma',
    role: 'Mobile & Client Engineering Lead',
    bio: 'Kabir builds the mobile and desktop experiences clients put in front of their customers. He has a soft spot for offline-first apps that work on any network.',
    portrait: portrait('kabir-sharma', 'Kabir Sharma'),
    socials: [
      { platform: 'linkedin', url: 'https://www.linkedin.com/in/kabir-sharma' },
      { platform: 'github', url: 'https://github.com/kabir-sharma' },
    ],
    order: 4,
  },
];
