// Studio headline metrics — single source of truth shared by HomePage and AboutPage.
// Update here and both pages stay in sync.

export interface Metric {
  value: number;
  suffix: string;
  decimals?: number;
  label: string;
}

export const studioMetrics: Metric[] = [
  { value: 50, suffix: '+', label: 'Products shipped' },
  { value: 8, suffix: '', label: 'Years building software' },
  { value: 99.9, decimals: 1, suffix: '%', label: 'Uptime sustained' },
  { value: 98, suffix: '%', label: 'Client retention' },
];
