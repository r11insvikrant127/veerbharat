// src/types/hero.ts
export interface Hero {
  id: string;
  name: string;
  slug: string;
  title: string;
  era: string;
  category: string[];
  description: string;
  image?: string;
  portrait?: string;
  banner?: string;
}