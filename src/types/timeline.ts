// src/types/timeline.ts
export interface TimelineEvent {
  id: string;
  era: string;
  period: string;
  title: string;
  description: string;
  color: string;
  icon?: string;
  subEvents: {
    title: string;
    description: string;
  }[];
}