// src/components/sections/FeaturedHeroes.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { HeroCard } from '@/components/cards/HeroCard';
import { featuredHeroes } from '@/data/heroes';

export function FeaturedHeroes() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Featured <span className="text-amber-600">Bravehearts</span>
          </h2>
          <p className="text-gray-600">
            Meet some of the legendary figures who shaped India's history through their courage and leadership.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {featuredHeroes.map((hero, index) => (
            <HeroCard key={hero.id} hero={hero} index={index} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/heroes">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-3 bg-white border-2 border-amber-600 text-amber-600 hover:bg-amber-50 rounded-full font-medium transition-all flex items-center gap-2 mx-auto"
            >
              View All Heroes
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}
