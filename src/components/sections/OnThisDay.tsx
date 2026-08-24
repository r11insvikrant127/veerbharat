'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar,
  Flag,
  ArrowRight,
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
  eventDate: string | null;
  eventDateAccuracy: string;
  description: string;
  significance?: string;
  isOnThisDayEligible: boolean;
  heroIds: EventHero[];
}

interface EventsResponse {
  data: HistoricalEvent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function OnThisDay() {
  const [events, setEvents] =
    useState<HistoricalEvent[]>([]);

  const [loading, setLoading] =
    useState(true);

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
    async function fetchTodayEvents() {
      try {
        setLoading(true);

        const response = await fetch(
          '/api/events?page=1&limit=100&status=Published'
        );

        if (!response.ok) {
          throw new Error(
            'Failed to fetch historical events.'
          );
        }

        const result: EventsResponse =
          await response.json();

        const eventsForToday =
          result.data.filter((item) => {
            if (!item.eventDate) {
              return false;
            }

            const eventDate =
              new Date(item.eventDate);

            return (
              eventDate.getDate() ===
                today.getDate() &&
              eventDate.getMonth() ===
                today.getMonth()
            );
          });

        setEvents(eventsForToday);

      } catch (error) {
        console.error(
          'Failed to load On This Day events:',
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTodayEvents();
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

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[#1C1410] border-y border-[#D4AF37]/10">
      <div className="container mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
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

            {events.map((event, index) => {

              const relatedHero =
                event.heroIds?.[0];

              const destination =
                relatedHero
                  ? `/heroes/${relatedHero.heroId}`
                  : `/events/${event.eventId}`;

              const linkText =
                relatedHero
                  ? `Discover ${relatedHero.name}`
                  : 'Explore this event';

              return (
                <motion.div
                  key={event.eventId}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1,
                  }}
                >

                  <div className="bg-[#2B221C] rounded-2xl shadow-md p-6 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-300">

                    <div className="flex items-start gap-4">

                      <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center flex-shrink-0 border border-[#D4AF37]/20">
                        <Flag className="w-6 h-6 text-[#D4AF37]" />
                      </div>

                      <div className="flex-1">

                        {event.eventDate && (
                          <p className="text-[#D4AF37] text-sm font-medium mb-1">
                            {new Date(
                              event.eventDate
                            ).getFullYear()}
                          </p>
                        )}

                        <h3 className="text-xl font-semibold text-[#F8F5F0] mb-2">
                          {event.name}
                        </h3>

                        <p className="text-[#D7C9A5] leading-relaxed">
                          {event.description}
                        </p>

                        <Link
                          href={destination}
                          className="mt-4 inline-flex text-[#D4AF37] font-medium hover:text-[#C46A00] items-center gap-1 transition-colors"
                        >
                          {linkText}

                          <ArrowRight className="w-4 h-4" />
                        </Link>

                      </div>

                    </div>

                  </div>

                </motion.div>
              );
            })}

          </div>

        </motion.div>

      </div>
    </section>
  );
}