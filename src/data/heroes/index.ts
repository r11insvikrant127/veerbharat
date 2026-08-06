// src/data/heroes/index.ts
import { Hero } from '@/types/hero';

export const featuredHeroes: Hero[] = [
  {
    id: 'rana-pratap',
    name: 'Maharana Pratap',
    slug: 'rana-pratap',
    title: 'The Lion of Mewar',
    era: '16th Century',
    category: ['Rajput', 'Warrior'],
    description: 'Fierce resistance against the Mughal Empire',
  },
  {
    id: 'shivaji',
    name: 'Chhatrapati Shivaji',
    slug: 'shivaji',
    title: 'The Great Maratha',
    era: '17th Century',
    category: ['Maratha', 'King'],
    description: 'Founded the Maratha Empire',
  },
  {
    id: 'rana-sanga',
    name: 'Rana Sanga',
    slug: 'rana-sanga',
    title: 'The Warrior King of Mewar',
    era: '16th Century',
    category: ['Rajput', 'Warrior'],
    description: 'United Rajput kingdoms against the Mughals',
  },
  {
    id: 'ashoka',
    name: 'Emperor Ashoka',
    slug: 'ashoka',
    title: 'The Great Mauryan',
    era: '3rd Century BCE',
    category: ['Mauryan', 'Emperor'],
    description: 'Spread Buddhism across Asia',
  },
];