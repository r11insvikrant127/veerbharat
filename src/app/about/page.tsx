"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Crown,
  ScrollText,
  Shield,
  Sparkles,
  Swords,
  Users,
} from "lucide-react";

const pillars = [
  {
    title: "Bravehearts",
    description:
      "Discover the lives of individuals whose courage, sacrifice and determination left an enduring mark on the story of Bharat.",
    icon: Shield,
    href: "/heroes",
  },
  {
    title: "Historical Personalities",
    description:
      "Explore rulers, queens, generals, strategists, scholars and influential individuals who shaped history in complex and lasting ways.",
    icon: Crown,
    href: "/historical-personalities",
  },
  {
    title: "Battles & Events",
    description:
      "Journey through decisive battles, revolutions, movements and defining moments that changed the course of history.",
    icon: Swords,
    href: "/battles",
  },
  {
    title: "The Timeline",
    description:
      "Travel across centuries and connect people, places, kingdoms and events within the larger story of Bharat.",
    icon: ScrollText,
    href: "/timeline",
  },
];

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const fadeLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      ease: "easeOut",
    },
  },
};

const fadeRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      ease: "easeOut",
    },
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F0E6] overflow-hidden">
      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/about/about-hero.jpg"
            alt="Historical landscape of Bharat"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/70" />

          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B]/40 via-transparent to-[#0B0B0B]" />
        </div>

        {/* Decorative glow */}
        <div className="absolute top-1/3 left-1/2 w-[500px] h-[500px] -translate-x-1/2 rounded-full bg-[#D4AF37]/10 blur-[150px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] text-sm tracking-[0.2em] uppercase mb-8">
            <Sparkles className="w-4 h-4" />
            India&apos;s Digital Historical Archive
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-8">
            About{" "}
            <span className="text-[#D4AF37]">Veer Bharat</span>
          </h1>

          <div className="w-24 h-[2px] bg-[#D4AF37] mx-auto mb-8" />

          <p className="max-w-3xl mx-auto text-xl md:text-3xl leading-relaxed text-[#E6DED0]/85 font-light">
            Every generation inherits a story.
            <br />
            <span className="text-[#D4AF37]">
              Some stories deserve to be remembered forever.
            </span>
          </p>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0B0B0B] to-transparent" />
      </section>

      {/* =====================================================
          INTRODUCTION
      ====================================================== */}

      <section className="relative py-28 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-[#D4AF37]/10 blur-3xl rounded-full" />

            <div className="relative overflow-hidden border border-[#D4AF37]/30 bg-[#0B0B0B]">
              <Image
                src="/images/history.png"
                alt="Preserving the stories of history"
                width={1024}
                height={1024}
                className="w-full h-auto block transition-transform duration-700 hover:scale-[1.02]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/80 via-transparent to-transparent" />
            </div>

            {/* Decorative border */}
            <div className="absolute -bottom-5 -right-5 w-40 h-40 border-r border-b border-[#D4AF37]/50" />
          </motion.div>

          {/* Content */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex items-center gap-3 text-[#D4AF37] uppercase tracking-[0.2em] text-sm mb-6">
              <BookOpen className="w-5 h-5" />
              Why Veer Bharat Exists
            </div>

            <h2 className="font-serif text-4xl md:text-6xl leading-tight mb-8">
              History is more than
              <span className="block text-[#D4AF37]">
                dates and names.
              </span>
            </h2>

            <div className="space-y-6 text-lg leading-relaxed text-[#E6DED0]/70">
              <p>
                History is the memory of courage, sacrifice, leadership,
                ambition, triumph and tragedy. It lives not only in books,
                monuments and archives, but also in the stories passed from
                one generation to another.
              </p>

              <p>
                <span className="text-[#F5F0E6] font-medium">
                  Veer Bharat
                </span>{" "}
                is a digital initiative dedicated to preserving and exploring
                the people, battles, kingdoms, movements and events that
                shaped the history of the Indian subcontinent.
              </p>

              <p>
                From celebrated heroes to complex historical personalities,
                from legendary battles to forgotten places, we seek to bring
                these stories together into one living digital archive.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          PILLARS
      ====================================================== */}

      <section className="relative py-28 px-6 border-y border-[#D4AF37]/10 bg-[#10100F]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 text-[#D4AF37] uppercase tracking-[0.2em] text-sm mb-5">
              <Users className="w-5 h-5" />
              Explore the Archive
            </div>

            <h2 className="font-serif text-4xl md:text-6xl mb-6">
              Many stories.
              <span className="text-[#D4AF37]"> One journey.</span>
            </h2>

            <p className="text-[#E6DED0]/65 text-lg">
              Explore the people and moments that together form the vast and
              interconnected story of Bharat.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;

              return (
                <motion.div
                  key={pillar.title}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.12,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href={pillar.href}
                    className="group relative block h-full p-7 border border-[#D4AF37]/20 bg-[#0B0B0B] hover:border-[#D4AF37]/60 transition-all duration-500 overflow-hidden"
                  >
                    {/* Hover glow */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#D4AF37]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative">
                      <div className="w-14 h-14 flex items-center justify-center border border-[#D4AF37]/30 text-[#D4AF37] mb-8 group-hover:bg-[#D4AF37] group-hover:text-[#0B0B0B] transition-all duration-500">
                        <Icon className="w-7 h-7" />
                      </div>

                      <h3 className="font-serif text-2xl mb-4 group-hover:text-[#D4AF37] transition-colors">
                        {pillar.title}
                      </h3>

                      <p className="text-[#E6DED0]/60 leading-relaxed text-sm mb-8">
                        {pillar.description}
                      </p>

                      <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-medium">
                        Explore
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          HISTORY IS COMPLEX
      ====================================================== */}

      <section className="relative py-32 px-6 overflow-hidden">
        {/* Background lines */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute left-1/4 top-0 bottom-0 w-px bg-[#D4AF37]" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#D4AF37]" />
          <div className="absolute left-3/4 top-0 bottom-0 w-px bg-[#D4AF37]" />
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="relative max-w-5xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] mb-8">
            <ScrollText className="w-7 h-7" />
          </div>

          <p className="text-[#D4AF37] uppercase tracking-[0.25em] text-sm mb-6">
            Beyond Simple Labels
          </p>

          <h2 className="font-serif text-5xl md:text-7xl leading-tight mb-10">
            History is not
            <span className="block text-[#D4AF37]">
              always simple.
            </span>
          </h2>

          <div className="max-w-4xl mx-auto space-y-6 text-lg md:text-xl leading-relaxed text-[#E6DED0]/70">
            <p>
              A person may be admired by some and criticised by others. A
              ruler may have been a brilliant administrator while fighting for
              a cause we do not celebrate. A commander may have displayed
              extraordinary courage while serving an invading power.
            </p>

            <p className="text-[#F5F0E6] text-xl md:text-2xl font-serif">
              Veer Bharat does not attempt to erase these complexities.
            </p>

            <p>
              Instead, we aim to present historical individuals and events
              with context, multiple perspectives and reliable sources—
              allowing visitors to explore history beyond simple labels.
            </p>
          </div>
        </motion.div>
      </section>

      {/* =====================================================
          MISSION
      ====================================================== */}

      <section className="relative py-32 px-6 overflow-hidden border-t border-[#D4AF37]/20">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/about/about-mission.jpg"
            alt="Journey through history"
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[#0B0B0B]/85" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/80 to-[#D4AF37]/10" />
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative max-w-5xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 text-[#D4AF37] uppercase tracking-[0.2em] text-sm mb-7">
            <Sparkles className="w-5 h-5" />
            Our Mission
          </div>

          <h2 className="font-serif text-5xl md:text-7xl leading-tight mb-10">
            To Remember.
            <br />
            <span className="text-[#D4AF37]">
              To Explore.
            </span>
            <br />
            To Understand.
          </h2>

          <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed text-[#E6DED0]/75 mb-12">
            Our mission is not merely to preserve the past, but to make it
            accessible, connected and alive for future generations.
          </p>

          <div className="max-w-3xl mx-auto border-y border-[#D4AF37]/20 py-10 mb-12">
            <p className="font-serif text-2xl md:text-4xl leading-relaxed">
              Because every stone remembers.
              <br />
              Every battlefield has a story.
              <br />
              <span className="text-[#D4AF37]">
                And every generation deserves to know where it came from.
              </span>
            </p>
          </div>

          <div className="flex items-center justify-center">
            <Link
              href="/timeline"
              className="group inline-flex items-center gap-3 px-8 py-4 border border-[#D4AF37]/40 text-[#F5F0E6] hover:bg-[#D4AF37]/10 transition-colors"
            >
              Begin the Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}