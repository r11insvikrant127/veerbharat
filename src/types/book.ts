// src/types/book.ts
export interface Book {
  id?: string;
  title: string;
  author: string;
  year: number;
  category?: string;
  cover?: string;
}