'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Hero {
  _id: string;
  heroId: string;
  name: string;
  nativeName?: string;
  title?: string;
  shortDescription?: string;
  biography?: string;
  status: string;
}

interface HeroesResponse {
  data: Hero[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function FeaturedHeroes() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedHeroes() {
      try {
        const response = await fetch(
          '/api/heroes?page=1&limit=4'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch heroes');
        }

        const result: HeroesResponse =
          await response.json();

        setHeroes(result.data);
      } catch (error) {
        console.error(
          'Failed to load featured heroes:',
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedHeroes();
  }, []);

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
            Featured{' '}
            <span className="text-amber-600">
              Bravehearts
            </span>
          </h2>

          <p className="text-gray-600">
            Meet some of the legendary figures who shaped
            India&apos;s history through their courage and
            leadership.
          </p>
        </motion.div>

        {loading && (
          <div className="text-center py-10 text-gray-500">
            Loading bravehearts...
          </div>
        )}

        {!loading && heroes.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No bravehearts available.
          </div>
        )}

        {!loading && heroes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {heroes.map((hero, index) => (
              <motion.div
                key={hero._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={`/heroes/${hero.heroId}`}
                >
                  <div className="h-full bg-[#2B221C] rounded-2xl overflow-hidden border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#D4AF37]/5">

                    {/* Placeholder image area */}
                    <div className="aspect-[3/4] bg-gradient-to-br from-[#D4AF37]/20 to-[#C46A00]/10 relative">

                      <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
                        ⚔️
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent" />

                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-[#0F0F0F]/80 text-[#D4AF37] text-xs font-medium rounded-full border border-[#D4AF37]/20">
                          {hero.status}
                        </span>
                      </div>

                    </div>

                    <div className="p-5">

                      <h3 className="text-xl font-serif font-bold text-[#F8F5F0] mb-1">
                        {hero.name}
                      </h3>

                      {hero.nativeName && (
                        <p className="text-sm text-[#A09682] mb-2">
                          {hero.nativeName}
                        </p>
                      )}

                      {hero.title && (
                        <p className="text-sm text-[#D4AF37] mb-2">
                          {hero.title}
                        </p>
                      )}

                      <p className="text-xs text-[#A09682]">
                        {hero.shortDescription ||
                          hero.biography ||
                          'Discover the story of this braveheart.'}
                      </p>

                    </div>

                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

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
