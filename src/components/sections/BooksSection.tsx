// src/components/sections/BooksSection.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookCard } from '@/components/cards/BookCard';
import { Book } from '@/types/book';

interface ApiBook {
  _id: string;
  bookId: string;
  title: string;
  author?: string;
  bookType: string;
  period?: string;
  description: string;
  status: string;
}

interface BooksResponse {
  data: ApiBook[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function BooksSection() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedBooks() {
      try {
        const response = await fetch(
          '/api/books?page=1&limit=3&status=Published'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const result: BooksResponse =
          await response.json();

        const formattedBooks: Book[] =
          result.data.map((book) => ({
            id: book.bookId,

            title: book.title,

            author:
              book.author ||
              'Unknown Author',

            year: book.period
              ? Number(book.period) || 0
              : 0,

            category: book.bookType,
          }));

        setBooks(formattedBooks);
      } catch (error) {
        console.error(
          'Failed to load books:',
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedBooks();
  }, []);

  return (
    <section className="py-20 bg-[#1C1410]">
      <div className="container mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gold-gradient mb-4">
            Books &{' '}
            <span className="text-[#D4AF37]">
              References
            </span>
          </h2>

          <p className="text-[#D7C9A5]">
            Explore our recommended reading list for deeper historical insights.
          </p>
        </motion.div>

        {loading && (
          <div className="text-center py-10 text-[#D7C9A5]">
            Loading books...
          </div>
        )}

        {!loading && books.length === 0 && (
          <div className="text-center py-10 text-[#D7C9A5]">
            No books available.
          </div>
        )}

        {!loading && books.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {books.map((book, index) => (
              <BookCard
                key={book.id || index}
                book={book}
                index={index}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}