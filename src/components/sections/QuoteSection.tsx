// src/components/sections/QuoteSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useQuoteRotation } from '@/hooks/useQuoteRotation';
import { quotes } from '@/data/quotes';

export function QuoteSection() {
  const currentQuote = useQuoteRotation(quotes);

  return (
    <section className="py-20 bg-[#0F0F0F] relative overflow-hidden">
      {/* Gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <Quote className="w-12 h-12 text-[#D4AF37]/40 mx-auto mb-6" />
          <motion.div
            key={currentQuote.text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <blockquote className="text-2xl md:text-3xl font-serif font-light leading-relaxed mb-6 text-[#F8F5F0]">
              "{currentQuote.text}"
            </blockquote>
            <p className="text-[#D4AF37] font-medium">
              — {currentQuote.author}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}