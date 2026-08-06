// src/components/cards/BookCard.tsx
'use client';

import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Book } from '@/types/book';

interface BookCardProps {
  book: Book;
  index?: number;
}

export function BookCard({ book, index = 0 }: BookCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start gap-4 p-4 bg-[#2B221C] rounded-xl hover:bg-[#D4AF37]/5 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-300"
    >
      <div className="w-12 h-16 bg-[#D4AF37]/20 rounded flex items-center justify-center flex-shrink-0 border border-[#D4AF37]/10">
        <BookOpen className="w-6 h-6 text-[#D4AF37]" />
      </div>
      <div>
        <h3 className="font-semibold text-[#F8F5F0] text-sm">{book.title}</h3>
        <p className="text-sm text-[#D7C9A5]">{book.author}</p>
        <p className="text-xs text-[#A09682]">{book.year}</p>
        {book.category && (
          <span className="text-xs px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full mt-1 inline-block">
            {book.category}
          </span>
        )}
      </div>
    </motion.div>
  );
}