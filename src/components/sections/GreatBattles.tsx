// src/components/sections/GreatBattles.tsx
'use client';

import { motion } from 'framer-motion';
import { BattleCard } from '@/components/cards/BattleCard';
import { greatBattles } from '@/data/battles';

export function GreatBattles() {
  return (
    <section className="py-20 bg-[#0F0F0F]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gold-gradient mb-4">
            Great <span className="text-[#D4AF37]">Battles</span>
          </h2>
          <p className="text-[#D7C9A5]">
            The turning points that shaped India's history.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {greatBattles.map((battle, index) => (
            <BattleCard key={index} battle={battle} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}