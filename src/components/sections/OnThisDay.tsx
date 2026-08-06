// src/components/sections/OnThisDay.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Flag, ArrowRight } from 'lucide-react';
import { todayEvents } from '@/data/events';

export function OnThisDay() {
  const today = new Date();
  const todayStr = `${today.getDate()} ${today.toLocaleString('default', { month: 'long' })}`;
  const event = todayEvents[0];

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
              <p className="text-[#A09682] text-sm">{todayStr}</p>
            </div>
          </div>

          <div className="bg-[#2B221C] rounded-2xl shadow-md p-6 md:p-8 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center flex-shrink-0 border border-[#D4AF37]/20">
                <Flag className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#F8F5F0] mb-2">
                  {event.title}
                </h3>
                <p className="text-[#D7C9A5]">{event.description}</p>
                <Link href={event.link}>
                  <button className="mt-4 text-[#D4AF37] font-medium hover:text-[#C46A00] flex items-center gap-1 transition-colors">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}