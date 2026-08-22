// src/components/sections/OnThisDay.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Flag, ArrowRight } from 'lucide-react';

interface HistoricalEvent {
  _id: string;
  eventId: string;
  name: string;
  eventDate: string | null;
  eventDateAccuracy: string;
  description: string;
  significance?: string;
  isOnThisDayEligible: boolean;
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
  const [event, setEvent] =
    useState<HistoricalEvent | null>(null);

  const [loading, setLoading] = useState(true);

  const today = useMemo(() => new Date(), []);

  const todayStr =
    `${today.getDate()} ${today.toLocaleString(
      'default',
      { month: 'long' }
    )}`;

  useEffect(() => {
    async function fetchTodayEvent() {
      try {
        setLoading(true);

        // Fetch all available events.
        // No backend changes required.
        const response = await fetch(
          '/api/events?page=1&limit=50'
        );

        if (!response.ok) {
          throw new Error(
            'Failed to fetch historical events.'
          );
        }

        const result: EventsResponse =
          await response.json();

        // Priority 1:
        // Find an event matching today's day and month.
        const eventForToday =
          result.data.find((item) => {
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

        // Priority 2:
        // Find an event marked as eligible for On This Day.
        const eligibleEvent =
          result.data.find(
            (item) =>
              item.isOnThisDayEligible === true
          );

        // Priority 3:
        // Use the first available event as a fallback.
        const fallbackEvent =
          result.data[0];

        setEvent(
          eventForToday ??
          eligibleEvent ??
          fallbackEvent ??
          null
        );
      } catch (error) {
        console.error(
          'Failed to load On This Day event:',
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTodayEvent();
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

  if (!event) {
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
          <div className="flex items-center gap-4 mb-6">
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

          <div className="bg-[#2B221C] rounded-2xl shadow-md p-6 md:p-8 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center flex-shrink-0 border border-[#D4AF37]/20">
                <Flag className="w-6 h-6 text-[#D4AF37]" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#F8F5F0] mb-2">
                  {event.name}
                </h3>

                <p className="text-[#D7C9A5]">
                  {event.description}
                </p>

                <Link
                  href={`/events/${event.eventId}`}
                  className="mt-4 text-[#D4AF37] font-medium hover:text-[#C46A00] flex items-center gap-1 transition-colors"
                >
                  Learn more

                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}




