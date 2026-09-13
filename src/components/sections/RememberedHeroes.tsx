'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Feather,
  Shield,
  Sparkles,
} from 'lucide-react';

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
  gender?: string;
  shortDescription?: string;
  biography?: string;
  status?: string;
  birthDate?: string | null;
  deathDate?: string | null;
  imageIds?: HeroImage[];
  tags?: string[];
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

const HEROES_PER_PAGE = 4;

export function RememberedHeroes() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    async function fetchHeroes() {
      try {
        setLoading(true);
        setError('');

        const allHeroes: Hero[] = [];

        let currentPage = 1;
        let totalPages = 1;

        while (currentPage <= totalPages) {
          const response = await fetch(
            `/api/heroes?page=${currentPage}&limit=100&status=Published`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch heroes.');
          }

          const result: HeroesResponse = await response.json();

          allHeroes.push(...(result.data || []));

          totalPages =
            result.pagination?.totalPages || 1;

          currentPage++;
        }

        /*
         * REMEMBERED HEROES
         *
         * Priority is given to heroes whose historical
         * dates are incomplete or unavailable.
         *
         * These are exactly the people who can easily
         * disappear from "On This Day" / anniversary
         * based sections.
         */
        const remembered = allHeroes.filter((hero) => {
            const missingBirthDate =
                !hero.birthDate;

            const missingDeathDate =
                !hero.deathDate;

            return (
                missingBirthDate ||
                missingDeathDate
            );
        });

        setHeroes(remembered);
      } catch (err) {
        console.error(
          'Failed to load remembered heroes:',
          err
        );

        setError(
          'Unable to load the remembered heroes archive.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchHeroes();
  }, []);

  const totalPages = Math.ceil(
    heroes.length / HEROES_PER_PAGE
  );

  const visibleHeroes = useMemo(() => {
    const start =
      page * HEROES_PER_PAGE;

    return heroes.slice(
      start,
      start + HEROES_PER_PAGE
    );
  }, [heroes, page]);

  function formatDate(
    date?: string | null
  ) {
    if (!date) {
      return null;
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return parsed.toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    );
  }

  function getDateText(hero: Hero) {
    const birth = formatDate(
      hero.birthDate
    );

    const death = formatDate(
      hero.deathDate
    );

    if (birth && death) {
      return `${birth} — ${death}`;
    }

    if (death) {
      return `Died ${death}`;
    }

    if (birth) {
      return `Born ${birth}`;
    }

    return 'Dates not fully known';
  }

  if (
    !loading &&
    !error &&
    heroes.length === 0
  ) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#0F0F0F] py-20 border-y border-[#D4AF37]/10">

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">

        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-[#D4AF37]/5 blur-3xl" />

        <div className="absolute bottom-0 left-0 w-[350px] h-[250px] rounded-full bg-[#C46A00]/5 blur-3xl" />

      </div>

      <div className="relative container mx-auto px-6">

        {/* HEADER */}

        <div className="max-w-3xl mx-auto text-center mb-12">

          <div className="flex justify-center mb-6">

            <div className="relative">

              <div className="absolute inset-0 rounded-full bg-[#D4AF37]/10 blur-xl" />

              <div className="relative w-16 h-16 rounded-full border border-[#D4AF37]/30 bg-[#1C1410] flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.08)]">

                <Feather className="w-7 h-7 text-[#D4AF37]" />

              </div>

            </div>

          </div>

          <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/70 mb-4">
            Beyond the Calendar
          </p>

          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#F8F5F0]">
            Remembered{' '}
            <span className="text-gold-gradient">
              Heroes
            </span>
          </h2>

          <div className="flex items-center justify-center gap-4 mt-5">

            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/40" />

            <Sparkles className="w-4 h-4 text-[#D4AF37]/50" />

            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/40" />

          </div>

          <p className="mt-6 text-[#A09682] leading-relaxed max-w-2xl mx-auto">
            Some lives are preserved in history without
            an exact date on the calendar. Their stories
            deserve to be remembered too.
          </p>

        </div>


        {/* LOADING */}

        {loading && (

          <div className="flex flex-col items-center justify-center py-16">

            <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />

            <p className="mt-5 text-sm text-[#A09682]">
              Opening the archive...
            </p>

          </div>

        )}


        {/* ERROR */}

        {!loading && error && (

          <div className="max-w-xl mx-auto text-center py-12">

            <Shield className="w-10 h-10 text-[#D4AF37] mx-auto mb-5" />

            <h3 className="font-serif text-2xl font-bold text-[#F8F5F0] mb-3">
              Archive Unavailable
            </h3>

            <p className="text-[#A09682]">
              {error}
            </p>

          </div>

        )}


        {/* HERO CARDS */}

        {!loading &&
          !error &&
          visibleHeroes.length > 0 && (

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">

              {visibleHeroes.map(
                (hero, index) => (

                  <Link
                    key={hero._id}
                    href={`/heroes/${hero.heroId}`}
                    className="group block"
                  >

                    <article
                      className="
                        relative
                        h-full
                        overflow-hidden
                        rounded-2xl
                        bg-[#1C1410]
                        border
                        border-[#D4AF37]/15
                        transition-all
                        duration-500
                        hover:-translate-y-2
                        hover:border-[#D4AF37]/45
                        hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                      "
                    >

                      {/* Gold accent */}

                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />


                      {/* IMAGE */}

                      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#211812] via-[#2B221C] to-[#120E0C]">

                        {hero.imageIds?.[0] ? (

                          <img
                            src={hero.imageIds[0].url}
                            alt={
                              hero.imageIds[0]
                                .altText ||
                              hero.name
                            }
                            className="
                              w-full
                              h-full
                              object-contain
                              p-5
                              opacity-90
                              group-hover:scale-105
                              group-hover:opacity-100
                              transition-all
                              duration-700
                            "
                          />

                        ) : (

                          <div className="absolute inset-0 flex items-center justify-center">

                            <div className="w-20 h-20 rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/5 flex items-center justify-center">

                              <Shield className="w-9 h-9 text-[#D4AF37]/30" />

                            </div>

                          </div>

                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410] via-transparent to-transparent" />

                        {/* Archive marker */}

                        <div className="absolute top-4 left-4">

                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0F0F0F]/70 backdrop-blur-sm border border-[#D4AF37]/15 text-[10px] uppercase tracking-[0.18em] text-[#D7C9A5]">

                            <BookOpen className="w-3 h-3 text-[#D4AF37]" />

                            Remembered

                          </span>

                        </div>

                      </div>


                      {/* CONTENT */}

                      <div className="p-6">

                        <div className="flex items-center justify-between gap-3 mb-4">

                          <span className="text-[10px] uppercase tracking-[0.18em] text-[#D4AF37]/50">
                            {hero.heroId}
                          </span>

                          <span className="text-[10px] uppercase tracking-wider text-[#A09682]">
                            {hero.status}
                          </span>

                        </div>


                        <h3 className="font-serif text-xl font-bold leading-tight text-[#F8F5F0] group-hover:text-[#D4AF37] transition-colors duration-300">

                          {hero.name}

                        </h3>


                        {hero.nativeName && (

                          <p className="mt-1 text-xs text-[#8A7F72]">
                            {hero.nativeName}
                          </p>

                        )}


                        {hero.title && (

                          <p className="mt-3 text-xs font-medium text-[#D4AF37]">
                            {hero.title}
                          </p>

                        )}


                        <div className="my-5 h-px bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/10 to-transparent" />


                        {/* DATE */}

                        <div className="text-xs text-[#A09682]">

                          <span className="text-[#D7C9A5]">
                            {getDateText(hero)}
                          </span>

                        </div>


                        {/* DESCRIPTION */}

                        <p className="mt-4 text-sm leading-relaxed text-[#A09682] line-clamp-3">

                          {hero.shortDescription ||
                            hero.biography ||
                            'Discover the story of this remarkable hero.'}

                        </p>


                        {/* CTA */}

                        <div className="mt-6 pt-4 border-t border-[#D4AF37]/10 flex items-center justify-between">

                          <span className="text-[10px] uppercase tracking-[0.18em] text-[#D4AF37]/60 group-hover:text-[#D4AF37] transition-colors">

                            Remember their story

                          </span>

                          <ArrowRight className="w-4 h-4 text-[#D4AF37]/50 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />

                        </div>

                      </div>

                    </article>

                  </Link>

                )
              )}

            </div>

          )}


        {/* PAGINATION */}

        {!loading &&
          !error &&
          totalPages > 1 && (

            <div className="flex items-center justify-center gap-5 mt-10">

              <button
                type="button"
                disabled={page === 0}
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.max(
                        0,
                        current - 1
                      )
                  )
                }
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-full
                  border
                  border-[#D4AF37]/15
                  text-sm
                  text-[#D7C9A5]
                  transition-all
                  hover:border-[#D4AF37]/40
                  hover:text-[#D4AF37]
                  disabled:opacity-30
                  disabled:cursor-not-allowed
                "
              >

                <ChevronLeft className="w-4 h-4" />

                Previous

              </button>


              <span className="text-xs text-[#A09682]">

                <span className="text-[#D4AF37]">
                  {page + 1}
                </span>

                {' / '}

                {totalPages}

              </span>


              <button
                type="button"
                disabled={
                  page >=
                  totalPages - 1
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.min(
                        totalPages - 1,
                        current + 1
                      )
                  )
                }
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-full
                  border
                  border-[#D4AF37]/15
                  text-sm
                  text-[#D7C9A5]
                  transition-all
                  hover:border-[#D4AF37]/40
                  hover:text-[#D4AF37]
                  disabled:opacity-30
                  disabled:cursor-not-allowed
                "
              >

                Next

                <ChevronRight className="w-4 h-4" />

              </button>

            </div>

          )}


        {/* FOOTER MESSAGE */}

        {!loading &&
          !error &&
          heroes.length > 0 && (

            <div className="flex justify-center mt-10">

              <Link
                href="/heroes"
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-xs
                  uppercase
                  tracking-[0.2em]
                  text-[#D4AF37]/60
                  hover:text-[#D4AF37]
                  transition-colors
                "
              >

                Explore the complete archive

                <ArrowRight className="w-4 h-4" />

              </Link>

            </div>

          )}

      </div>

    </section>
  );
}