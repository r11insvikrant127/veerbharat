"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Crown,
  Landmark,
  ScrollText,
  Swords,
} from "lucide-react";

const timelinePeriods = [
  {
    period: "Ancient India",
    years: "c. 3300 BCE – 1200 CE",
    title: "The Foundations of Civilization",
    description:
      "From the Indus Valley Civilization to the rise of great kingdoms and empires, this era witnessed the foundations of philosophy, science, literature, governance and culture across the Indian subcontinent.",
    icon: Landmark,
    href: "/timeline?period=ancient",
    events: [
      "Indus Valley Civilization",
      "Vedic Period",
      "Rise of Mahajanapadas",
      "Maurya Empire",
      "Gupta Empire",
    ],
  },
  {
    period: "Medieval India",
    years: "c. 1200 – 1757",
    title: "Kingdoms, Empires & Changing Powers",
    description:
      "A period of powerful kingdoms, expanding empires, military campaigns and cultural transformation. Rajput kingdoms, regional powers, Sultanates and the Mughal Empire shaped the political landscape.",
    icon: Crown,
    href: "/timeline?period=medieval",
    events: [
      "Rise of Rajput Kingdoms",
      "Delhi Sultanate",
      "Vijayanagara Empire",
      "Mughal Empire",
      "Rise of the Marathas",
    ],
  },
  {
    period: "Colonial India",
    years: "1757 – 1947",
    title: "Resistance & the Struggle for Freedom",
    description:
      "Foreign rule transformed the political and economic structure of the subcontinent. At the same time, countless movements, revolts and individuals rose to challenge colonial power.",
    icon: Swords,
    href: "/timeline?period=colonial",
    events: [
      "Battle of Plassey",
      "Revolt of 1857",
      "Formation of the Indian National Congress",
      "Non-Cooperation Movement",
      "Quit India Movement",
    ],
  },
  {
    period: "Independent India",
    years: "1947 – Present",
    title: "A Nation Continues Its Journey",
    description:
      "Independence marked the beginning of a new chapter. India emerged as a modern republic while continuing to carry the memories, cultures, struggles and achievements of its long historical journey.",
    icon: ScrollText,
    href: "/timeline?period=modern",
    events: [
      "Indian Independence",
      "Adoption of the Constitution",
      "Formation of the Republic",
      "Modern Nation Building",
      "India in the 21st Century",
    ],
  },
];

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const fadeLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const fadeRight: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

export default function TimelinePage() {
  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F0E6] overflow-hidden">
      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <section className="relative min-h-[72vh] flex items-center justify-center px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#D4AF3715,transparent_55%)]" />

          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#D4AF37]/10" />

          <div className="absolute left-1/4 top-0 bottom-0 w-px bg-[#D4AF37]/5" />

          <div className="absolute right-1/4 top-0 bottom-0 w-px bg-[#D4AF37]/5" />
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl mx-auto text-center pt-20"
        >
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-7 flex items-center justify-center rounded-full border border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5">
            <CalendarDays className="w-7 h-7" />
          </div>

          {/* Label */}
          <p className="text-[#D4AF37] uppercase tracking-[0.35em] text-xs sm:text-sm mb-6">
            The Veer Bharat Archive
          </p>

          {/* Heading */}
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight">
            Timeline
          </h1>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 my-8">
            <div className="w-20 h-px bg-[#D4AF37]/40" />

            <div className="flex gap-2 text-[#D4AF37] text-xs">
              ✦ ✦ ✦
            </div>

            <div className="w-20 h-px bg-[#D4AF37]/40" />
          </div>

          {/* Description */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl leading-relaxed text-[#E6DED0]/75">
            Travel through centuries of courage, kingdoms, संघर्ष, revolution
            and transformation.
            <br />
            <span className="text-[#D4AF37]">
              Every era is a chapter. Every chapter has a story.
            </span>
          </p>

          {/* Scroll indicator */}
          <div className="mt-14 flex flex-col items-center gap-3 text-[#D4AF37]/60">
            <span className="text-xs uppercase tracking-[0.25em]">
              Explore the centuries
            </span>

            <ChevronDown className="w-5 h-5 animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* =====================================================
          INTRO
      ====================================================== */}

      <section className="relative py-20 px-6 border-y border-[#D4AF37]/10 bg-[#10100F]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-[#D4AF37] uppercase tracking-[0.25em] text-sm mb-6">
            A Journey Through Time
          </p>

          <h2 className="font-serif text-4xl md:text-6xl leading-tight mb-8">
            Thousands of years.
            <span className="block text-[#D4AF37]">
              One continuing story.
            </span>
          </h2>

          <p className="text-lg md:text-xl leading-relaxed text-[#E6DED0]/70">
            The history of Bharat cannot be understood through a single
            moment, ruler or empire. It is a vast and interconnected journey
            shaped by civilizations, kingdoms, battles, ideas, movements and
            generations of people.
          </p>
        </motion.div>
      </section>

      {/* =====================================================
          TIMELINE
      ====================================================== */}

      <section className="relative py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-20"
          >
            <p className="text-[#D4AF37] uppercase tracking-[0.25em] text-sm mb-4">
              Historical Journey
            </p>

            <h2 className="font-serif text-4xl md:text-6xl">
              The story through
              <span className="text-[#D4AF37]"> the ages.</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Central line */}
            <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-[#D4AF37]/20 md:-translate-x-1/2" />

            <div className="space-y-20">
              {timelinePeriods.map((item, index) => {
                const Icon = item.icon;
                const isLeft = index % 2 === 0;

                return (
                  <motion.div
                    key={item.period}
                    variants={isLeft ? fadeLeft : fadeRight}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className={`relative grid md:grid-cols-2 gap-10 md:gap-20 items-center ${
                      !isLeft ? "md:text-right" : ""
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-5 md:left-1/2 top-8 -translate-x-1/2 z-10">
                      <div className="w-4 h-4 rounded-full bg-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.7)]" />
                    </div>

                    {/* Content */}
                    <div
                      className={`pl-14 md:pl-0 ${
                        isLeft
                          ? "md:col-start-1"
                          : "md:col-start-2 md:row-start-1"
                      }`}
                    >
                      <div
                        className={`relative border border-[#D4AF37]/20 bg-[#10100F] p-8 md:p-10 hover:border-[#D4AF37]/50 transition-colors duration-500 ${
                          !isLeft ? "md:ml-0" : ""
                        }`}
                      >
                        {/* Icon */}
                        <div
                          className={`w-12 h-12 flex items-center justify-center border border-[#D4AF37]/30 text-[#D4AF37] mb-7 ${
                            !isLeft ? "md:ml-auto" : ""
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>

                        <p className="text-[#D4AF37] uppercase tracking-[0.2em] text-xs mb-3">
                          {item.years}
                        </p>

                        <h3 className="font-serif text-3xl md:text-4xl mb-5">
                          {item.period}
                        </h3>

                        <h4 className="text-[#D4AF37] text-lg mb-5">
                          {item.title}
                        </h4>

                        <p className="text-[#E6DED0]/65 leading-relaxed mb-7">
                          {item.description}
                        </p>

                        {/* Events */}
                        <div
                          className={`border-t border-[#D4AF37]/15 pt-6 ${
                            !isLeft ? "md:text-right" : ""
                          }`}
                        >
                          <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/70 mb-4">
                            Key chapters
                          </p>

                          <div
                            className={`flex flex-wrap gap-2 ${
                              !isLeft ? "md:justify-end" : ""
                            }`}
                          >
                            {item.events.map((event) => (
                              <span
                                key={event}
                                className="px-3 py-1.5 text-xs border border-[#D4AF37]/15 text-[#E6DED0]/60 bg-[#D4AF37]/5"
                              >
                                {event}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Explore */}
                        <Link
                          href={item.href}
                          className={`group mt-8 inline-flex items-center gap-2 text-sm text-[#D4AF37] ${
                            !isLeft ? "md:flex-row-reverse" : ""
                          }`}
                        >
                          Explore this era
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>

                    {/* Empty opposite side */}
                    <div
                      className={
                        isLeft
                          ? "hidden md:block md:col-start-2"
                          : "hidden md:block md:col-start-1"
                      }
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="relative py-28 px-6 border-t border-[#D4AF37]/20 bg-[#10100F] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#D4AF3710,transparent_60%)]" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] mb-8">
            <ScrollText className="w-7 h-7" />
          </div>

          <h2 className="font-serif text-4xl md:text-6xl leading-tight mb-8">
            History never truly
            <span className="block text-[#D4AF37]"> ends.</span>
          </h2>

          <p className="text-lg md:text-xl text-[#E6DED0]/70 leading-relaxed max-w-3xl mx-auto mb-10">
            Every generation inherits the past, interprets it differently and
            adds its own chapter to the continuing story.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/heroes"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#D4AF37] text-[#0B0B0B] font-medium hover:bg-[#E5C158] transition-colors"
            >
              Explore Bravehearts
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/historical-personalities"
              className="group inline-flex items-center gap-3 px-8 py-4 border border-[#D4AF37]/40 text-[#F5F0E6] hover:bg-[#D4AF37]/10 transition-colors"
            >
              Historical Personalities
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}