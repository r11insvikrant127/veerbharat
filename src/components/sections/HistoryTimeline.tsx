// src/components/sections/HistoryTimeline.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Crown, Building, Flag, Compass, BookOpen, MapPin, Sword } from 'lucide-react';
import { timelineEvents } from '@/data/timeline';
import Link from 'next/link';

// Icon mapping
const iconMap = {
  Crown: Crown,
  Building: Building,
  Flag: Flag,
  Compass: Compass,
};

// Sub-event icons
const subIcons = {
  'Indus Valley Civilization': '🏛️',
  'Vedic Period': '📜',
  'Mahajanapadas': '⚔️',
  'Mauryan Empire': '🦁',
  'Gupta Empire': '👑',
  'South Indian Dynasties': '🏯',
  'Rajput Kingdoms': '⚔️',
  'Chola Empire': '🌊',
  'Delhi Sultanate': '🕌',
  'Vijayanagara Empire': '🏰',
  'Maratha Empire': '⚡',
  'Bhakti Movement': '🙏',
  'Babur': '⚔️',
  'Humayun': '👑',
  'Akbar': '🕌',
  'Shah Jahan': '🏛️',
  'Aurangzeb': '⚔️',
  'Maratha Resistance': '🔥',
  'British East India Company': '🏴',
  'British Raj': '👑',
  'First War of Independence (1857)': '🔥',
  'Indian National Movement': '✊',
  'Independence': '🇮🇳',
  'Republic of India': '🇮🇳',
  'Economic Development': '📈',
  'Science & Technology': '🚀',
};

export function HistoryTimeline() {
  const [openEra, setOpenEra] = useState<string | null>('ancient');
  const [expandedSub, setExpandedSub] = useState<string | null>(null);

  const toggleEra = (id: string) => {
    setOpenEra(openEra === id ? null : id);
    setExpandedSub(null);
  };

  const toggleSub = (id: string) => {
    setExpandedSub(expandedSub === id ? null : id);
  };

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
            Journey Through Time
          </h2>
          <p className="text-[#D7C9A5]">
            Explore India's rich history through different eras, dynasties, and legendary rulers.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {timelineEvents.map((event, index) => {
            const IconComponent = iconMap[event.icon as keyof typeof iconMap] || Crown;
            const isOpen = openEra === event.id;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Era Header - Clickable */}
                <button
                  onClick={() => toggleEra(event.id)}
                  className={`w-full text-left p-6 rounded-xl transition-all duration-300 border ${
                    isOpen
                      ? 'bg-[#2B221C] border-[#D4AF37]/30 shadow-lg shadow-[#D4AF37]/5'
                      : 'bg-[#1C1410] border-[#D4AF37]/10 hover:border-[#D4AF37]/20 hover:bg-[#2B221C]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg transition-colors ${
                        isOpen ? 'bg-[#D4AF37]/20' : 'bg-[#D4AF37]/10'
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          isOpen ? 'text-[#D4AF37]' : 'text-[#D7C9A5]'
                        }`} />
                      </div>
                      <div>
                        <h3 className={`text-xl font-serif font-bold transition-colors ${
                          isOpen ? 'text-gold-gradient' : 'text-[#F8F5F0]'
                        }`}>
                          {event.era}
                        </h3>
                        <p className="text-sm text-[#A09682]">{event.period}</p>
                      </div>
                    </div>
                    <div className={`p-2 rounded-full transition-all duration-300 ${
                      isOpen ? 'bg-[#D4AF37]/20 rotate-180' : 'bg-[#D4AF37]/10'
                    }`}>
                      <ChevronDown className={`w-5 h-5 transition-colors ${
                        isOpen ? 'text-[#D4AF37]' : 'text-[#D7C9A5]'
                      }`} />
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 p-6 bg-[#1C1410] rounded-xl border border-[#D4AF37]/10 space-y-4">
                        {/* Era Description */}
                        <p className="text-[#D7C9A5] text-sm leading-relaxed border-b border-[#D4AF37]/10 pb-4">
                          {event.description}
                        </p>

                        {/* Sub-events Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {event.subEvents.map((sub, idx) => {
                            const subId = `${event.id}-${idx}`;
                            const isSubExpanded = expandedSub === subId;
                            const icon = subIcons[sub.title as keyof typeof subIcons] || '📖';

                            return (
                              <div key={idx}>
                                <button
                                  onClick={() => toggleSub(subId)}
                                  className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                                    isSubExpanded
                                      ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/30'
                                      : 'bg-[#2B221C]/50 border border-transparent hover:border-[#D4AF37]/20'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-2xl">{icon}</span>
                                    <span className="flex-1 text-sm font-medium text-[#D7C9A5]">
                                      {sub.title}
                                    </span>
                                    {isSubExpanded ? (
                                      <ChevronUp className="w-4 h-4 text-[#D4AF37]" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 text-[#A09682]" />
                                    )}
                                  </div>
                                </button>

                                {/* Sub-event Details */}
                                <AnimatePresence>
                                  {isSubExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="mt-2 p-4 bg-[#0F0F0F] rounded-lg border border-[#D4AF37]/10 space-y-3">
                                        <p className="text-sm text-[#D7C9A5] leading-relaxed">
                                          {sub.description}
                                        </p>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#D4AF37]/10">
                                          <Link href={`/heroes?era=${event.era}`}>
                                            <button className="text-xs px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full hover:bg-[#D4AF37]/20 transition-colors flex items-center gap-1">
                                              <Sword className="w-3 h-3" />
                                              Heroes
                                            </button>
                                          </Link>
                                          <Link href={`/battles?era=${event.era}`}>
                                            <button className="text-xs px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full hover:bg-[#D4AF37]/20 transition-colors flex items-center gap-1">
                                              <MapPin className="w-3 h-3" />
                                              Battles
                                            </button>
                                          </Link>
                                          <Link href={`/books?era=${event.era}`}>
                                            <button className="text-xs px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full hover:bg-[#D4AF37]/20 transition-colors flex items-center gap-1">
                                              <BookOpen className="w-3 h-3" />
                                              Books
                                            </button>
                                          </Link>
                                          <button className="text-xs px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full hover:bg-[#D4AF37]/20 transition-colors flex items-center gap-1">
                                            Read More →
                                          </button>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}