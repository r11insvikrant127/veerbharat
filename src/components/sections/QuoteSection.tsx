// src/components/sections/QuoteSection.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useQuoteRotation } from '@/hooks/useQuoteRotation';

interface HistoricalQuote {
  _id: string;
  quoteId: string;
  text: string;
  translation?: string;
  heroId?: string;
}

interface QuoteResponse {
  data: HistoricalQuote[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function QuoteSection() {
  const [quotes, setQuotes] = useState<HistoricalQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        setLoading(true);

        const response = await fetch(
          '/api/quotes?page=1&limit=50'
        );

        if (!response.ok) {
          throw new Error(
            'Failed to fetch quotes.'
          );
        }

        const result: QuoteResponse =
          await response.json();

        setQuotes(result.data);
      } catch (error) {
        console.error(
          'Failed to load quotes:',
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchQuotes();
  }, []);

  const currentQuote =
    useQuoteRotation(quotes);

  if (loading || !currentQuote) {
    return null;
  }

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
            key={currentQuote._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <blockquote className="text-2xl md:text-3xl font-serif font-light leading-relaxed mb-6 text-[#F8F5F0]">
              "
              {currentQuote.translation ||
                currentQuote.text}
              "
            </blockquote>

            {currentQuote.heroId && (
              <p className="text-[#D4AF37] font-medium">
                — Historical Quote
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}