'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HeroImage {
  _id: string;
  imageId: string;
  title: string;
  url: string;
  altText: string;
  imageType: string;
}

interface Hero {
  _id: string;
  heroId: string;
  name: string;
  nativeName?: string;
  title?: string;
  shortDescription?: string;
  biography?: string;
  status?: string | null;
  birthDate?: string | null;
  deathDate?: string | null;
  imageIds?: HeroImage[];
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

/**
 * Checks whether a hero is considered published.
 *
 * Accepted examples:
 *   Published
 *   published
 *   PUBLISHED
 *   Pubished
 *   pubished
 *   " published "
 */
function isPublishedStatus(status?: string | null): boolean {
  if (!status) return false;

  const normalizedStatus = status
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');

  return (
    normalizedStatus === 'published' ||
    normalizedStatus === 'pubished'
  );
}

/**
 * Safely checks whether a date falls on today's
 * month/day, ignoring the year.
 */
function isTodayDate(
  dateValue: string | null | undefined,
  today: Date
): boolean {
  if (!dateValue) return false;

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth()
  );
}

export function FeaturedHeroes() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);

  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    async function fetchFeaturedHeroes() {
      try {
        setLoading(true);

        const allHeroes: Hero[] = [];

        let page = 1;
        let totalPages = 1;

        /*
         * IMPORTANT:
         *
         * Do NOT send status=Published here.
         *
         * The backend status validation is case-sensitive.
         * Instead, fetch all heroes and perform a
         * case-insensitive status check below.
         */
        while (page <= totalPages) {
          const response = await fetch(
            `/api/heroes?page=${page}&limit=100`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch heroes');
          }

          const result: HeroesResponse = await response.json();

          allHeroes.push(...(result.data || []));

          totalPages = result.pagination?.totalPages || 1;

          page++;
        }

        /*
         * Only keep heroes whose status is considered published.
         *
         * This handles:
         * Published
         * published
         * PUBLISHED
         * Pubished
         * pubished
         * etc.
         */
        const publishedHeroes = allHeroes.filter((hero) =>
          isPublishedStatus(hero.status)
        );

        /*
         * FEATURE HEROES BASED ON
         * BIRTH OR DEATH/MARTYRDOM ANNIVERSARY.
         *
         * Only day and month are compared.
         * The year is intentionally ignored.
         */
        const todaysHeroes = publishedHeroes.filter((hero) => {
          const isBirthday = isTodayDate(
            hero.birthDate,
            today
          );

          const isDeathAnniversary = isTodayDate(
            hero.deathDate,
            today
          );

          return isBirthday || isDeathAnniversary;
        });

        /*
         * Maximum number of heroes shown
         */
        const maxFeaturedHeroes = 10;

        setHeroes(
          todaysHeroes.slice(0, maxFeaturedHeroes)
        );

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
  }, [today]);

  if (!loading && heroes.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-[#F8F5F0]">

      <div className="container mx-auto px-4">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >

          <p className="text-[#C46A00] text-sm font-semibold tracking-widest uppercase mb-3">
            Connected to Today&apos;s History
          </p>

          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1C1410] mb-4">
            Featured{' '}
            <span className="text-[#C46A00]">
              Bravehearts
            </span>
          </h2>

          <p className="text-[#6B6258]">
            Discover the remarkable individuals whose
            birth, death, or martyrdom anniversary falls
            on this day in history.
          </p>

        </motion.div>

        {loading && (
          <div className="text-center py-10 text-[#6B6258]">
            Discovering today&apos;s bravehearts...
          </div>
        )}

        {!loading && heroes.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">

            {heroes.map((hero, index) => (

              <motion.div
                key={hero.heroId}
                className="w-full sm:w-[280px] lg:w-[270px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -6,
                }}
              >

                <Link
                  href={`/heroes/${hero.heroId}`}
                  className="block h-full"
                >

                  <div className="group h-full bg-white rounded-2xl overflow-hidden border border-[#D4AF37]/20 transition-all duration-300 hover:border-[#D4AF37]/60 hover:shadow-xl hover:shadow-[#D4AF37]/10">

                    {/* Hero Visual */}

                    <div className="relative h-48 bg-gradient-to-br from-[#1C1410] via-[#2B221C] to-[#C46A00]/30 overflow-hidden">

                      {hero.imageIds?.[0] ? (

                        <Image
                          src={hero.imageIds[0].url}
                          alt={
                            hero.imageIds[0].altText ||
                            hero.name
                          }
                          fill
                          className="object-contain object-center p-2 group-hover:scale-105 transition-transform duration-500"
                        />

                      ) : (

                        <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-30">
                          ⚔
                        </div>

                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410] via-transparent to-transparent" />

                      <div className="absolute bottom-4 left-4 right-4">

                        {hero.title && (
                          <p className="text-[#D4AF37] text-xs font-medium tracking-wide">
                            {hero.title}
                          </p>
                        )}

                      </div>

                    </div>

                    {/* Hero Information */}

                    <div className="p-6 flex flex-col min-h-[230px]">

                      <h3 className="text-xl font-serif font-bold text-[#1C1410] mb-1 group-hover:text-[#C46A00] transition-colors">
                        {hero.name}
                      </h3>

                      {hero.nativeName && (
                        <p className="text-sm text-[#8A7F72] mb-4">
                          {hero.nativeName}
                        </p>
                      )}

                      <p className="text-sm text-[#6B6258] leading-relaxed line-clamp-3 flex-grow">
                        {hero.shortDescription ||
                          hero.biography ||
                          'Discover the story of this remarkable figure.'}
                      </p>

                      <div className="mt-5 pt-4 border-t border-[#D4AF37]/10 flex items-center text-sm font-medium text-[#C46A00] group-hover:gap-2 transition-all">

                        Discover their story

                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />

                      </div>

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
              className="group px-8 py-3 bg-[#1C1410] text-[#F8F5F0] hover:bg-[#C46A00] rounded-full font-medium transition-all flex items-center gap-2 mx-auto"
            >

              Explore All Bravehearts

              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />

            </motion.button>

          </Link>

        </div>

      </div>

    </section>
  );
}