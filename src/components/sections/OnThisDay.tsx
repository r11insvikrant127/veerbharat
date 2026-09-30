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

interface OnThisDayItem {
  id: string;
  name: string;
  year: number | null;
  description: string;
  href: string;
  type:
    | 'event'
    | 'battle'
    | 'hero'
    | 'personality';
}

export function OnThisDay() {
  const [items, setItems] =
    useState<OnThisDayItem[]>([]);

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
    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let isFetching = false;

    async function fetchTodayHistory() {
      if (!isMounted || isFetching) {
        return;
      }

      isFetching = true;

      try {
        console.log(
          '[OnThisDay] FETCH START:',
          new Date().toLocaleTimeString()
        );

        const response = await fetch(
          `/api/on-this-day?_=${Date.now()}`,
          {
            method: 'GET',
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
              Pragma: 'no-cache',
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        const result =
          await response.json();

        console.log(
          '[OnThisDay] FETCH SUCCESS:',
          new Date().toLocaleTimeString(),
          result
        );

        if (!isMounted) {
          return;
        }

        if (result.success) {
          setItems(
            Array.isArray(result.data)
              ? result.data
              : []
          );
        }

      } catch (error) {

        console.error(
          '[OnThisDay] FETCH ERROR:',
          error
        );

      } finally {

        isFetching = false;

        if (isMounted) {
          setLoading(false);
        }
      }
    }

    /*
    * Initial request
    */
    fetchTodayHistory();

    /*
    * Poll every 30 seconds
    */
    intervalId = setInterval(() => {
      console.log(
        '[OnThisDay] POLL TIMER:',
        new Date().toLocaleTimeString()
      );

      fetchTodayHistory();
    }, 30_000);

    /*
    * Fetch immediately when the user
    * returns to the tab.
    */
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible'
      ) {
        console.log(
          '[OnThisDay] TAB VISIBLE - refreshing'
        );

        fetchTodayHistory();
      }
    };

    /*
    * Fetch immediately when the window
    * receives focus.
    */
    const handleFocus = () => {
      console.log(
        '[OnThisDay] WINDOW FOCUS - refreshing'
      );

      fetchTodayHistory();
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    window.addEventListener(
      'focus',
      handleFocus
    );

    /*
    * Cleanup
    */
    return () => {
      isMounted = false;

      if (intervalId) {
        clearInterval(intervalId);
      }

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );

      window.removeEventListener(
        'focus',
        handleFocus
      );
    };

  }, []);

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

                        {item.type ===
                        'personality' ? (
                          <Crown className="w-6 h-6 text-[#D4AF37]" />
                        ) : item.type ===
                          'hero' ? (
                          <Shield className="w-6 h-6 text-[#D4AF37]" />
                        ) : item.type ===
                          'battle' ? (
                          <Swords className="w-6 h-6 text-[#D4AF37]" />
                        ) : (
                          <Flag className="w-6 h-6 text-[#D4AF37]" />
                        )}

                      </div>

                      <div className="flex-1">

                        {item.year !== null && (
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