// src/components/sections/CTASection.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 bg-[#1C1410] border-t border-[#D4AF37]/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gold-gradient mb-4">
            Ready to Explore India&apos;s <br />
            <span className="text-[#D4AF37]">Heroic Legacy</span>?
          </h2>
          <p className="text-[#D7C9A5] mb-8">
            Start your journey through the lives of India&apos;s greatest warriors, 
            kings, and freedom fighters.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/heroes">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#D4AF37] text-[#0F0F0F] hover:bg-[#C46A00] rounded-full font-medium shadow-lg shadow-[#D4AF37]/20 transition-all duration-300 flex items-center gap-2"
              >
                Explore Heroes
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/timeline">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D7C9A5] hover:bg-[#D4AF37]/20 rounded-full font-medium transition-all duration-300"
              >
                Timeline
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
