// Downloadable resources for the optional `/resources` page.
// See design.md "11. /resources (optional)" + Requirement 16.1.
//
// `resourcesEnabled` gates the page: when true the grid of resource cards
// renders; when false ResourcesPage shows a tasteful "coming soon" empty state.

/** A single downloadable resource rendered as a card with file metadata. */
export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  /** Human-readable file format label, e.g. `PDF`, `ZIP`. */
  fileType: string;
  /** Human-readable file size, e.g. `1.2 MB`. */
  fileSize: string;
  /** Download URL for the asset. */
  href: string;
}

/** Feature flag controlling whether the resources grid is shown. */
export const resourcesEnabled: boolean = true;

/** Downloadable resources shown on `/resources` (Requirement 16.1). */
export const resources: ResourceItem[] = [
  {
    id: 'product-engineering-playbook',
    title: 'Product Engineering Playbook',
    description:
      'How we scope, design, and ship durable software in vertical slices — the process we use on every engagement.',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    href: '/downloads/ryze-product-engineering-playbook.pdf',
  },
  {
    id: 'accessibility-checklist',
    title: 'WCAG AA Accessibility Checklist',
    description:
      'A practical, component-level checklist we run before launch so every interface meets WCAG AA in the real world.',
    fileType: 'PDF',
    fileSize: '880 KB',
    href: '/downloads/ryze-accessibility-checklist.pdf',
  },
  {
    id: 'design-tokens-starter',
    title: 'Design Tokens Starter Kit',
    description:
      'A token-driven Tailwind config and Figma library to bootstrap a consistent, themeable design system.',
    fileType: 'ZIP',
    fileSize: '5.1 MB',
    href: '/downloads/ryze-design-tokens-starter.zip',
  },
  {
    id: 'performance-budget-template',
    title: 'Web Performance Budget Template',
    description:
      'A spreadsheet template for setting and tracking bundle, image, and Core Web Vitals budgets across a project.',
    fileType: 'XLSX',
    fileSize: '210 KB',
    href: '/downloads/ryze-performance-budget-template.xlsx',
  },
  {
    id: 'discovery-workshop-guide',
    title: 'Discovery Workshop Guide',
    description:
      'The agenda, prompts, and worksheets we use to align goals, audience, and scope at the start of every build.',
    fileType: 'PDF',
    fileSize: '1.6 MB',
    href: '/downloads/ryze-discovery-workshop-guide.pdf',
  },
];

export default resources;
