// src/types/map.ts
export interface MapLocation {
  id: string;
  name: string;
  nameHindi?: string;
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  era: string;
  hero: string;
  description: string;
  icon: 'fort' | 'battle' | 'temple' | 'capital' | 'university' | 'port';
  symbol: string;
  image?: string;
}

export interface MapEra {
  id: string;
  name: string;
  year: string;
  yearStart: number;
  yearEnd: number;
  description: string;
  color: string;
}

export interface Empire {
  name: string;
  era: string;
  color: string;
  border: { x: number; y: number }[];
  locations: string[];
}