// src/components/sections/HistoryTimeline.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Crown,
  Building,
  Flag,
  Compass,
  BookOpen,
  MapPin,
  Sword,
} from 'lucide-react';
import Link from 'next/link';

interface HistoricalPeriod {
  _id: string;

  periodId: string;

  name: string;

  nativeName?: string;

  alternativeNames?: string[];

  startYear: string;

  endYear: string;

  duration?: string;

  keyCharacteristics?: string[];

  description: string;

  significance?: string;

  tags?: string[];

  status: string;
}

interface HistoricalPeriodsResponse {
  data: HistoricalPeriod[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const icons = [
  Crown,
  Building,
  Flag,
  Compass,
];

export function HistoryTimeline() {
  const [periods, setPeriods] =
    useState<HistoricalPeriod[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [openEra, setOpenEra] =
    useState<string | null>(null);

  const [expandedCharacteristic, setExpandedCharacteristic] =
    useState<string | null>(null);

  const [error, setError] =
    useState('');

  useEffect(() => {
    async function fetchHistoricalPeriods() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          '/api/historical-periods?page=1&limit=50'
        );

        if (!response.ok) {
          throw new Error(
            'Failed to fetch historical periods.'
          );
        }

        const result: HistoricalPeriodsResponse =
          await response.json();

        setPeriods(result.data);

        if (result.data.length > 0) {
          setOpenEra(result.data[0].periodId);
        }
      } catch (error) {
        console.error(
          'Failed to load historical periods:',
          error
        );

        setError(
          'Unable to load the historical timeline.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchHistoricalPeriods();
  }, []);

  function toggleEra(id: string) {
    setOpenEra(
      openEra === id ? null : id
    );

    setExpandedCharacteristic(null);
  }

  function toggleCharacteristic(id: string) {
    setExpandedCharacteristic(
      expandedCharacteristic === id
        ? null
        : id
    );
  }

  return (
    <section className="py-20 bg-[#0F0F0F]">
      <div className="container mx-auto px-4">

        {/* SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gold-gradient mb-4">
            Journey Through Time
          </h2>

          <p className="text-[#D7C9A5]">
            Explore India&apos;s rich history through
            different eras, dynasties, and legendary
            figures.
          </p>
        </motion.div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-10 h-10 mx-auto rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />

            <p className="mt-5 text-[#A09682]">
              Journeying through history...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="max-w-xl mx-auto text-center section-card p-8">
            <h3 className="font-serif text-xl text-[#F8F5F0] mb-3">
              Timeline Unavailable
            </h3>

            <p className="text-[#A09682]">
              {error}
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          periods.length === 0 && (
            <div className="max-w-xl mx-auto text-center section-card p-8">
              <h3 className="font-serif text-xl text-[#F8F5F0] mb-3">
                No Historical Periods Found
              </h3>

              <p className="text-[#A09682]">
                The historical timeline currently
                contains no records.
              </p>
            </div>
          )}

        {/* TIMELINE */}
        {!loading &&
          !error &&
          periods.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-4">

              {periods.map(
                (period, index) => {
                  const IconComponent =
                    icons[
                      index % icons.length
                    ];

                  const isOpen =
                    openEra === period.periodId;

                  return (
                    <motion.div
                      key={period._id}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        delay: index * 0.1,
                      }}
                      className="relative"
                    >

                      {/* PERIOD HEADER */}
                      <button
                        onClick={() =>
                          toggleEra(
                            period.periodId
                          )
                        }
                        className={`w-full text-left p-6 rounded-xl transition-all duration-300 border ${
                          isOpen
                            ? 'bg-[#2B221C] border-[#D4AF37]/30 shadow-lg shadow-[#D4AF37]/5'
                            : 'bg-[#1C1410] border-[#D4AF37]/10 hover:border-[#D4AF37]/20 hover:bg-[#2B221C]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">

                          <div className="flex items-center gap-4">

                            <div
                              className={`p-3 rounded-lg transition-colors ${
                                isOpen
                                  ? 'bg-[#D4AF37]/20'
                                  : 'bg-[#D4AF37]/10'
                              }`}
                            >
                              <IconComponent
                                className={`w-6 h-6 ${
                                  isOpen
                                    ? 'text-[#D4AF37]'
                                    : 'text-[#D7C9A5]'
                                }`}
                              />
                            </div>

                            <div>
                              <h3
                                className={`text-xl font-serif font-bold transition-colors ${
                                  isOpen
                                    ? 'text-gold-gradient'
                                    : 'text-[#F8F5F0]'
                                }`}
                              >
                                {period.name}
                              </h3>

                              {period.nativeName && (
                                <p className="text-sm text-[#A09682]">
                                  {period.nativeName}
                                </p>
                              )}

                              <p className="text-sm text-[#A09682] mt-1">
                                {period.startYear}
                                {' – '}
                                {period.endYear}
                              </p>
                            </div>

                          </div>

                          <div
                            className={`p-2 rounded-full transition-all duration-300 ${
                              isOpen
                                ? 'bg-[#D4AF37]/20 rotate-180'
                                : 'bg-[#D4AF37]/10'
                            }`}
                          >
                            <ChevronDown
                              className={`w-5 h-5 ${
                                isOpen
                                  ? 'text-[#D4AF37]'
                                  : 'text-[#D7C9A5]'
                              }`}
                            />
                          </div>

                        </div>
                      </button>

                      {/* EXPANDED CONTENT */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              height: 0,
                            }}
                            animate={{
                              opacity: 1,
                              height: 'auto',
                            }}
                            exit={{
                              opacity: 0,
                              height: 0,
                            }}
                            transition={{
                              duration: 0.3,
                            }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 p-6 bg-[#1C1410] rounded-xl border border-[#D4AF37]/10 space-y-6">

                              {/* DESCRIPTION */}
                              <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/60 mb-3">
                                  Historical Period
                                </p>

                                <p className="text-[#D7C9A5] text-sm leading-relaxed">
                                  {period.description}
                                </p>
                              </div>

                              {/* DURATION */}
                              {period.duration && (
                                <div className="pt-4 border-t border-[#D4AF37]/10">
                                  <span className="text-xs uppercase tracking-wider text-[#A09682]">
                                    Duration
                                  </span>

                                  <p className="mt-1 text-sm text-[#D7C9A5]">
                                    {period.duration}
                                  </p>
                                </div>
                              )}

                              {/* SIGNIFICANCE */}
                              {period.significance && (
                                <div className="pt-4 border-t border-[#D4AF37]/10">
                                  <span className="text-xs uppercase tracking-wider text-[#A09682]">
                                    Significance
                                  </span>

                                  <p className="mt-2 text-sm text-[#D7C9A5] leading-relaxed">
                                    {period.significance}
                                  </p>
                                </div>
                              )}

                              {/* KEY CHARACTERISTICS */}
                              {period.keyCharacteristics &&
                                period.keyCharacteristics
                                  .length > 0 && (
                                  <div className="pt-4 border-t border-[#D4AF37]/10">

                                    <h4 className="text-sm uppercase tracking-wider text-[#D4AF37]/70 mb-4">
                                      Key Characteristics
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                                      {period.keyCharacteristics.map(
                                        (
                                          characteristic,
                                          characteristicIndex
                                        ) => {
                                          const characteristicId =
                                            `${period.periodId}-${characteristicIndex}`;

                                          const isExpanded =
                                            expandedCharacteristic ===
                                            characteristicId;

                                          return (
                                            <div
                                              key={
                                                characteristicId
                                              }
                                            >
                                              <button
                                                onClick={() =>
                                                  toggleCharacteristic(
                                                    characteristicId
                                                  )
                                                }
                                                className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                                                  isExpanded
                                                    ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/30'
                                                    : 'bg-[#2B221C]/50 border border-transparent hover:border-[#D4AF37]/20'
                                                }`}
                                              >
                                                <div className="flex items-center justify-between gap-3">

                                                  <span className="flex-1 text-sm font-medium text-[#D7C9A5]">
                                                    {
                                                      characteristic
                                                    }
                                                  </span>

                                                  {isExpanded ? (
                                                    <ChevronUp className="w-4 h-4 text-[#D4AF37]" />
                                                  ) : (
                                                    <ChevronDown className="w-4 h-4 text-[#A09682]" />
                                                  )}

                                                </div>
                                              </button>

                                              <AnimatePresence>
                                                {isExpanded && (
                                                  <motion.div
                                                    initial={{
                                                      opacity: 0,
                                                      height: 0,
                                                    }}
                                                    animate={{
                                                      opacity: 1,
                                                      height:
                                                        'auto',
                                                    }}
                                                    exit={{
                                                      opacity: 0,
                                                      height: 0,
                                                    }}
                                                    transition={{
                                                      duration:
                                                        0.2,
                                                    }}
                                                    className="overflow-hidden"
                                                  >
                                                    <div className="mt-2 p-4 bg-[#0F0F0F] rounded-lg border border-[#D4AF37]/10">
                                                      <p className="text-sm text-[#D7C9A5]">
                                                        {
                                                          characteristic
                                                        }
                                                      </p>
                                                    </div>
                                                  </motion.div>
                                                )}
                                              </AnimatePresence>
                                            </div>
                                          );
                                        }
                                      )}

                                    </div>
                                  </div>
                                )}

                              {/* TAGS */}
                              {period.tags &&
                                period.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2 pt-4 border-t border-[#D4AF37]/10">
                                    {period.tags.map(
                                      (tag) => (
                                        <span
                                          key={tag}
                                          className="text-xs px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37]"
                                        >
                                          #{tag}
                                        </span>
                                      )
                                    )}
                                  </div>
                                )}

                              {/* ACTION BUTTONS */}
                              <div className="flex flex-wrap gap-2 pt-4 border-t border-[#D4AF37]/10">

                                <Link
                                  href={`/heroes?period=${encodeURIComponent(
                                    period.name
                                  )}`}
                                >
                                  <span className="text-xs px-3 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full hover:bg-[#D4AF37]/20 transition-colors flex items-center gap-1">
                                    <Sword className="w-3 h-3" />
                                    Heroes
                                  </span>
                                </Link>

                                <Link
                                  href={`/battles?period=${encodeURIComponent(
                                    period.name
                                  )}`}
                                >
                                  <span className="text-xs px-3 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full hover:bg-[#D4AF37]/20 transition-colors flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    Battles
                                  </span>
                                </Link>

                                <Link
                                  href={`/books?period=${encodeURIComponent(
                                    period.name
                                  )}`}
                                >
                                  <span className="text-xs px-3 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full hover:bg-[#D4AF37]/20 transition-colors flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" />
                                    Books
                                  </span>
                                </Link>

                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </motion.div>
                  );
                }
              )}

            </div>
          )}

      </div>
    </section>
  );
}