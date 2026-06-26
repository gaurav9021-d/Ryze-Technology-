// Reusable blog authors. See design.md "Data Models" (BlogAuthor).
// Authors are shared across blogPosts.ts so author metadata stays consistent.

import type { BlogAuthor } from '@app-types';

/**
 * Build an avatar ImageAsset for an author from a stable id.
 * Placeholder square portraits live under /images/team/<id>.jpg.
 */
function avatar(id: string, name: string): BlogAuthor['avatar'] {
  return {
    src: `/images/team/${id}.jpg`,
    width: 256,
    height: 256,
    alt: `Portrait of ${name}`,
  };
}

export const authors = {
  aanya: {
    id: 'aanya-deshmukh',
    name: 'Aanya Deshmukh',
    role: 'Principal Engineer',
    avatar: avatar('aanya-deshmukh', 'Aanya Deshmukh'),
  },
  rohan: {
    id: 'rohan-iyer',
    name: 'Rohan Iyer',
    role: 'Head of Platform',
    avatar: avatar('rohan-iyer', 'Rohan Iyer'),
  },
  meera: {
    id: 'meera-kulkarni',
    name: 'Meera Kulkarni',
    role: 'Design Systems Lead',
    avatar: avatar('meera-kulkarni', 'Meera Kulkarni'),
  },
} satisfies Record<string, BlogAuthor>;
