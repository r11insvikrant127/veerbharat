// src/components/sections/GreatBattles.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BattleCard } from '@/components/cards/BattleCard';
import { Battle } from '@/types/battle';

interface ApiBattle {
  _id: string;
  battleId: string;
  name: string;
  battleDate?: string | null;
  description: string;
  significance?: string;
  locationId?: string;
  status: string;
}

interface BattlesResponse {
  data: ApiBattle[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function GreatBattles() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGreatBattles() {
      try {
        const response = await fetch(
          '/api/battles?page=1&limit=3&status=Published'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch battles');
        }

        const result: BattlesResponse =
          await response.json();

        const formattedBattles: Battle[] =
          result.data.map((battle) => ({
            id: battle.battleId,

            name: battle.name,

            year: battle.battleDate
              ? new Date(
                  battle.battleDate
                ).getFullYear().toString()
              : 'Unknown',

            description:
              battle.significance ||
              battle.description,

            location: 'Historical location',
          }));

        setBattles(formattedBattles);
      } catch (error) {
        console.error(
          'Failed to load battles:',
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchGreatBattles();
  }, []);

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
            Great{' '}
            <span className="text-[#D4AF37]">
              Battles
            </span>
          </h2>

          <p className="text-[#D7C9A5]">
            The turning points that shaped India's history.
          </p>
        </motion.div>

        {loading && (
          <div className="text-center py-10 text-[#D7C9A5]">
            Loading battles...
          </div>
        )}

        {!loading && battles.length === 0 && (
          <div className="text-center py-10 text-[#D7C9A5]">
            No battles available.
          </div>
        )}

        {!loading && battles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {battles.map((battle, index) => (
              <BattleCard
                key={battle.id || index}
                battle={battle}
                index={index}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}