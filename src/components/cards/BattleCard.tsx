// src/components/cards/BattleCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Sword, MapPin } from 'lucide-react';
import { Battle } from '@/types/battle';

interface BattleCardProps {
  battle: Battle;
  index?: number;
}

export function BattleCard({ battle, index = 0 }: BattleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#2B221C] rounded-2xl shadow-md p-6 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/5 transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-[#D4AF37]/10 rounded-lg">
          <Sword className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <span className="text-sm font-medium text-[#D4AF37]">{battle.year}</span>
      </div>
      <h3 className="text-xl font-bold text-[#F8F5F0] mb-2">{battle.name}</h3>
      <p className="text-[#D7C9A5] text-sm mb-2">{battle.description}</p>
      <div className="flex items-center gap-1 text-sm text-[#A09682]">
        <MapPin className="w-4 h-4" />
        <span>{battle.location}</span>
      </div>
    </motion.div>
  );
}

