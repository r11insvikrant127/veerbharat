// src/types/hero.ts

export interface HistoricalDetail {
  label: string;
  content: string;
}

export interface HistoricalSource {
  title?: string;
  author?: string;
  date?: string;
  type?: string;
}

export interface HistoricalNarrative {
  title: string;

  source?: HistoricalSource;

  classification?: string;

  description?: string;

  details?: HistoricalDetail[];
}

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

  historicalNarratives?: HistoricalNarrative[];
}