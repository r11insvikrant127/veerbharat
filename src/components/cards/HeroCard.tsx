// src/components/cards/HeroCard.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Hero } from '@/types/hero';

interface HeroCardProps {
  hero: Hero;
  index?: number;
}

export function HeroCard({ hero, index = 0 }: HeroCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={`/heroes/${hero.slug}`}>
        <div className="bg-[#2B221C] rounded-2xl overflow-hidden border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#D4AF37]/5">
          <div className="aspect-[3/4] bg-gradient-to-br from-[#D4AF37]/20 to-[#C46A00]/10 relative">
            <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
              ⚔️
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-[#0F0F0F]/80 text-[#D4AF37] text-xs font-medium rounded-full border border-[#D4AF37]/20">
                {hero.era}
              </span>
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-xl font-serif font-bold text-gold-gradient mb-1">
              {hero.name}
            </h3>
            <p className="text-sm text-[#D7C9A5] mb-2">{hero.title}</p>
            <p className="text-xs text-[#A09682] mb-3">{hero.description}</p>
            <div className="flex flex-wrap gap-1">
              {hero.category.map((cat) => (
                <span
                  key={cat}
                  className="text-xs px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

