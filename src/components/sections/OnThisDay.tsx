'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar,
  Flag,
  ArrowRight,
  Crown,
  Shield,
  Swords,
} from 'lucide-react';

interface EventHero {
  _id: string;
  heroId: string;
  name: string;
}

interface HistoricalEvent {
  _id: string;
  eventId: string;
  name: string;
  status?: string;
  eventDate: string | null;
  eventDateAccuracy: string;
  description: string;
  shortDescription?: string;
  significance?: string;
  isOnThisDayEligible: boolean;

  linkedEventId?:
    | {
        _id: string;
        eventId: string;
      }
    | string
    | null;

  heroIds: EventHero[];
}

interface Hero {
  _id: string;
  heroId: string;
  name: string;
  status?: string;
  birthDate?: string | null;
  deathDate?: string | null;
  shortDescription?: string;
  causeOfDeath?: string;
  tags?: string[];
}

interface HistoricalPersonality {
  _id: string;
  historicalPersonalityId: string;
  name: string;
  status?: string;
  birthDate?: string | null;
  deathDate?: string | null;
  shortDescription?: string;
  legacy?: string;
}



interface Battle {
  _id: string;
  battleId: string;
  name: string;
  status?: string;
  battleDate: string | null;
  battleEndDate?: string | null;
  battleDateAccuracy?: string;
  shortDescription?: string;
  description: string;
}

interface OnThisDayItem {
  id: string;
  name: string;
  year: number | null;
  description: string;
  href: string;
  type: 'event' | 'battle' | 'hero' | 'personality';
}

export function OnThisDay() {

  async function fetchAllPages<T>(
    endpoint: string
  ): Promise<T[]> {
    const allData: T[] = [];

    let page = 1;
    let totalPages = 1;

    do {
      const response = await fetch(
        `${endpoint}?page=${page}&limit=100`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${endpoint}: ${response.status}`
        );
      }

      const result = await response.json();

      allData.push(...(result.data || []));

      totalPages =
        result.pagination?.totalPages || 1;

      page++;
    } while (page <= totalPages);

    return allData;
  }

  const [items, setItems] =
    useState<OnThisDayItem[]>([]);

  const [loading, setLoading] =
    useState(true);
  const isPublished = (status?: string) =>
    status?.trim().toLowerCase() === 'published';

  const today = useMemo(
    () => new Date(),
    []
  );

  const todayStr =
    `${today.getDate()} ${today.toLocaleString(
      'default',
      {
        month: 'long',
      }
    )}`;

  useEffect(() => {
    async function fetchTodayHistory() {
      try {
        setLoading(true);

        const [
          events,
          battles,
          heroes,
          personalities,
        ] = await Promise.all([
          fetchAllPages<HistoricalEvent>('/api/events'),
          fetchAllPages<Battle>('/api/battles'),
          fetchAllPages<Hero>('/api/heroes'),
          fetchAllPages<HistoricalPersonality>(
            '/api/historical-personalities'
          ),
        ]);

        const allItems: OnThisDayItem[] = [];

        /*
         * EVENTS
         */
        events.forEach((event) => {
          if (
            !isPublished(event.status) ||
            !event.eventDate
          ) {
            return;
          }

            const eventDate =
              new Date(event.eventDate);

            if (
              eventDate.getDate() ===
                today.getDate() &&
              eventDate.getMonth() ===
                today.getMonth()
            ) {
              const relatedHero =
                event.heroIds?.[0];

              const isHeroFocusedEvent =
                relatedHero &&
                /^(Birth|Death|Martyrdom) of /i.test(
                  event.name
                );

              allItems.push({
                id: event._id,
                name: event.name,
                year: eventDate.getFullYear(),

                description:
                  event.shortDescription ||
                  event.description,

                href: isHeroFocusedEvent
                  ? `/heroes/${relatedHero.heroId}`
                  : `/events/${event.eventId}`,

                type: 'event',
              });
                          }
          });

        /*
        * BATTLES
        *
        * A battle is eligible for On This Day if today's
        * month/day falls between its start and end dates.
        */
        battles.forEach((battle) => {
          if (
            !isPublished(battle.status) ||
            !battle.battleDate
          ) {
            return;
          }

          const battleStart = new Date(
            battle.battleDate
          );

          if (Number.isNaN(battleStart.getTime())) {
            return;
          }

          const battleEnd = battle.battleEndDate
            ? new Date(battle.battleEndDate)
            : battleStart;

          if (Number.isNaN(battleEnd.getTime())) {
            return;
          }

          /*
          * Convert month/day to a fixed leap year
          * so historical years do not matter.
          */
          const startKey = Date.UTC(
            2000,
            battleStart.getMonth(),
            battleStart.getDate()
          );

          const endKey = Date.UTC(
            2000,
            battleEnd.getMonth(),
            battleEnd.getDate()
          );

          const todayKey = Date.UTC(
            2000,
            today.getMonth(),
            today.getDate()
          );

          const isOnThisDay =
            todayKey === startKey ||
            todayKey === endKey;

          if (isOnThisDay) {
            allItems.push({
              id: `battle-${battle.battleId}`,
              name: battle.name,
              year: battleStart.getFullYear(),
              description:
                battle.shortDescription ||
                battle.description,
              href:
                `/battles/${battle.battleId}`,
              type: 'battle',
            });
          }
        });
        


        /*
         * HEROES
         */
        heroes.forEach((hero) => {
          if (!isPublished(hero.status)) {
            return;
          }

          if (hero.birthDate) {
              const birthDate =
                new Date(hero.birthDate);

              if (
                birthDate.getDate() ===
                  today.getDate() &&
                birthDate.getMonth() ===
                  today.getMonth()
              ) {
                allItems.push({
                  id: `${hero._id}-birth`,
                  name:
                    `Birth of ${hero.name}`,
                  year:
                    birthDate.getFullYear(),
                  description:
                    hero.shortDescription ||
                    `Birth anniversary of ${hero.name}.`,
                  href:
                    `/heroes/${hero.heroId}`,
                  type: 'hero',
                });
              }
            }

            if (hero.deathDate) {
              const deathDate =
                new Date(hero.deathDate);

              if (
                deathDate.getDate() ===
                  today.getDate() &&
                deathDate.getMonth() ===
                  today.getMonth()
              ) {
                allItems.push({
                  id: `${hero._id}-death`,
                  name:
                    /martyr|executed|execution|shot dead|hanged/i.test(
                      [
                        hero.causeOfDeath || '',
                        ...(hero.tags || []),
                      ].join(' ')
                    )
                      ? `Martyrdom of ${hero.name}`
                      : `Death of ${hero.name}`,
                  year:
                    deathDate.getFullYear(),
                  description:
                    hero.shortDescription ||
                    `Death anniversary of ${hero.name}.`,
                  href:
                    `/heroes/${hero.heroId}`,
                  type: 'hero',
                });
              }
            }
         });


        /*
         * HISTORICAL PERSONALITIES
         */
        personalities.forEach((personality) => {
              if (
                !isPublished(personality.status)
              ) {
                return;
              }

              if (personality.birthDate) {
                const birthDate =
                  new Date(
                    personality.birthDate
                  );

                if (
                  birthDate.getDate() ===
                    today.getDate() &&
                  birthDate.getMonth() ===
                    today.getMonth()
                ) {
                  allItems.push({
                    id:
                      `${personality._id}-birth`,
                    name:
                      `Birth of ${personality.name}`,
                    year:
                      birthDate.getFullYear(),
                    description:
                      personality.shortDescription ||
                      personality.legacy ||
                      `Birth anniversary of ${personality.name}.`,
                    href:
                      `/historical-personalities/${personality.historicalPersonalityId}`,
                    type: 'personality',
                  });
                }
              }

              if (personality.deathDate) {
                const deathDate =
                  new Date(
                    personality.deathDate
                  );

                if (
                  deathDate.getDate() ===
                    today.getDate() &&
                  deathDate.getMonth() ===
                    today.getMonth()
                ) {
                  allItems.push({
                    id:
                      `${personality._id}-death`,
                    name:
                      `Death of ${personality.name}`,
                    year:
                      deathDate.getFullYear(),
                    description:
                      personality.shortDescription ||
                      personality.legacy ||
                      `Death anniversary of ${personality.name}.`,
                    href:
                      `/historical-personalities/${personality.historicalPersonalityId}`,
                    type: 'personality',
                  });
                }
              }
            });
        

        /*
         * Sort oldest events first
         */
        allItems.sort((a, b) => {
          if (a.year === null) return 1;
          if (b.year === null) return -1;

          return a.year - b.year;
        });

        setItems(allItems);

      } catch (error) {
        console.error(
          'Failed to load On This Day history:',
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTodayHistory();
  }, [today]);

  if (loading) {
    return (
      <section className="py-16 bg-[#1C1410] border-y border-[#D4AF37]/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#A09682]">
            Searching history...
          </p>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[#1C1410] border-y border-[#D4AF37]/10">
      <div className="container mx-auto px-4">

        <motion.div
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
            duration: 0.6,
          }}
          className="max-w-4xl mx-auto"
        >

          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#D4AF37]/20 rounded-xl border border-[#D4AF37]/20">
              <Calendar className="w-6 h-6 text-[#D4AF37]" />
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-gold-gradient">
                On This Day in History
              </h2>

              <p className="text-[#A09682] text-sm">
                {todayStr}
              </p>
            </div>
          </div>

          <div className="space-y-5">

            {items.map(
              (item, index) => (
                <motion.div
                  key={item.id}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay:
                      index * 0.1,
                  }}
                >

                  <div className="bg-[#2B221C] rounded-2xl shadow-md p-6 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-300">

                    <div className="flex items-start gap-4">

                      <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center flex-shrink-0 border border-[#D4AF37]/20">

                        {item.type === 'personality' ? (
                          <Crown className="w-6 h-6 text-[#D4AF37]" />
                        ) : item.type === 'hero' ? (
                          <Shield className="w-6 h-6 text-[#D4AF37]" />
                        ) : item.type === 'battle' ? (
                          <Swords className="w-6 h-6 text-[#D4AF37]" />
                        ) : (
                          <Flag className="w-6 h-6 text-[#D4AF37]" />
                        )}

                      </div>

                      <div className="flex-1">

                        {item.year && (
                          <p className="text-[#D4AF37] text-sm font-medium mb-1">
                            {item.year}
                          </p>
                        )}

                        <h3 className="text-xl font-semibold text-[#F8F5F0] mb-2">
                          {item.name}
                        </h3>

                        <p className="text-[#D7C9A5] leading-relaxed">
                          {item.description}
                        </p>

                        <Link
                          href={item.href}
                          className="mt-4 inline-flex text-[#D4AF37] font-medium hover:text-[#C46A00] items-center gap-1 transition-colors"
                        >
                          Explore this record

                          <ArrowRight className="w-4 h-4" />
                        </Link>

                      </div>

                    </div>

                  </div>

                </motion.div>
              )
            )}

          </div>

        </motion.div>

      </div>
    </section>
  );
}