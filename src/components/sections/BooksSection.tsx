// src/components/sections/BooksSection.tsx
'use client';

import { motion } from 'framer-motion';
import { BookCard } from '@/components/cards/BookCard';
import { featuredBooks } from '@/data/books';

export function BooksSection() {
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
            Books & <span className="text-[#D4AF37]">References</span>
          </h2>
          <p className="text-[#D7C9A5]">
            Explore our recommended reading list for deeper historical insights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {featuredBooks.map((book, index) => (
            <BookCard key={index} book={book} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}