// src/components/sections/HeroSection.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Shield, Search, ArrowRight, XCircle } from 'lucide-react';
import { useParticles } from '@/hooks/useParticles';
import { useState, useEffect } from 'react';

export function HeroSection() {
  const { particles, isMounted } = useParticles(30);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Mission Modal - Museum Plaque Style */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#030303]/95 backdrop-blur-2xl"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative max-w-2xl w-full mx-4 p-10 md:p-14 bg-gradient-to-br from-[#1C1410] to-[#0F0F0F] border border-[#D4AF37]/30 rounded-sm shadow-2xl shadow-[#D4AF37]/5"
            style={{
              boxShadow: 'inset 0 2px 4px rgba(212, 175, 55, 0.05), 0 25px 50px -12px rgba(0, 0, 0, 0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bronze plaque texture overlay */}
            <div 
              className="absolute inset-0 rounded-sm opacity-5 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.1) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)',
              }}
            />
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors duration-300 z-10"
            >
              <XCircle className="w-6 h-6" />
            </button>
            
            <div className="relative text-center z-10">
              {/* Decorative Shield */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full border border-[#D4AF37]/30 flex items-center justify-center bg-[#D4AF37]/5">
                  <Shield className="w-8 h-8 text-[#D4AF37]" />
                </div>
              </div>
              
              {/* Title with decorative divider */}
              <h2 className="text-3xl font-serif font-bold text-gold-gradient mb-2">
                Our Mission
              </h2>
              
              {/* Elegant divider */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
                <span className="text-[#D4AF37]/30 text-xs">✦ ✦ ✦</span>
                <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
              </div>
              
              <p className="text-[#D7C9A5] leading-relaxed mb-8 text-base md:text-lg font-light">
                To preserve and celebrate the stories of India's forgotten bravehearts, 
                kingdoms, battles, forts, and civilizations through a freely accessible 
                digital museum, inspiring future generations to reconnect with their heritage.
              </p>
              
              {/* Updated Chips */}
              <div className="flex flex-wrap gap-3 justify-center">
                <span className="px-4 py-2 border border-[#D4AF37]/20 rounded-full text-xs text-[#D7C9A5] hover:border-[#D4AF37]/40 transition-colors duration-300">
                  ⚔ Bravehearts
                </span>
                <span className="px-4 py-2 border border-[#D4AF37]/20 rounded-full text-xs text-[#D7C9A5] hover:border-[#D4AF37]/40 transition-colors duration-300">
                  🏰 Kingdoms
                </span>
                <span className="px-4 py-2 border border-[#D4AF37]/20 rounded-full text-xs text-[#D7C9A5] hover:border-[#D4AF37]/40 transition-colors duration-300">
                  🛡 Battles
                </span>
                <span className="px-4 py-2 border border-[#D4AF37]/20 rounded-full text-xs text-[#D7C9A5] hover:border-[#D4AF37]/40 transition-colors duration-300">
                  🌏 Heritage
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with Parallax Layers */}
        <div className="absolute inset-0">
          {/* Base dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F0F] via-[#1C1410] to-[#0F0F0F]">
            
            {/* Layer 1: Background Image with Parallax */}
            <motion.div 
              className="absolute inset-0 opacity-30"
              style={{
                y: scrollY * 0.2,
              }}
            >
              <Image
                src="/images/veer.png"
                alt="Background"
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </motion.div>
            
            {/* Fort silhouette overlay */}
            <div className="absolute inset-0 bg-[url('/images/fort-silhouette.svg')] bg-bottom bg-no-repeat bg-contain opacity-20" />
            
            {/* Vignette - Darken corners */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40" />
            
            {/* Sun/moon glow */}
            <div className="absolute top-20 right-20 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-40 left-10 w-96 h-96 bg-[#C46A00]/5 rounded-full blur-3xl" />
            
            {/* Dark overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/50" />
            
            {/* Layer 2: Floating Embers (replacing particles) */}
            {isMounted && (
              <motion.div 
                className="absolute inset-0 overflow-hidden"
                style={{
                  y: scrollY * 0.1,
                }}
              >
                {particles.map((particle) => {
                  // Randomly assign ember type: • or ✦
                  const emberType = Math.random() > 0.6 ? '✦' : '•';
                  const size = emberType === '✦' ? 'w-1.5 h-1.5' : 'w-1 h-1';
                  const opacity = emberType === '✦' ? 'opacity-60' : 'opacity-30';
                  
                  return (
                    <motion.div
                      key={particle.id}
                      className={`absolute ${size} bg-[#D4AF37] rounded-full ${opacity}`}
                      initial={{ x: particle.x, y: particle.y }}
                      animate={{
                        y: [particle.y, particle.y - 80, particle.y],
                        x: [particle.x, particle.x + 10, particle.x - 5, particle.x],
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: particle.duration * 1.5,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: 'easeInOut',
                      }}
                    >
                      {emberType === '✦' && (
                        <span className="absolute inset-0 flex items-center justify-center text-[#D4AF37] text-xs">
                          ✦
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>

        {/* Content - Fixed Layer */}
        <div className="relative container mx-auto px-4 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="max-w-4xl mx-auto"
          >
            {/* Hero Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', damping: 20 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 glass-gold rounded-full mb-5"
            >
              <Shield className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-medium tracking-wider text-[#D7C9A5]">
                INDIA'S DIGITAL MUSEUM
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-4"
            >
              <span className="text-gold-gradient">Veer Bharat</span>
            </motion.h1>

            {/* Emotional Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-[#D7C9A5] max-w-2xl mx-auto mb-5 font-light leading-relaxed"
            >
              "Every stone remembers, every sword has a story,<br />
              every hero deserves to be remembered."
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="max-w-2xl mx-auto mb-5"
            >
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search bravehearts, kingdoms, battles or empires..."
                  className="w-full px-6 py-4 pl-14 bg-[#1C1410]/80 backdrop-blur-md border border-[#D4AF37]/20 rounded-full text-[#F8F5F0] placeholder-[#A09682] focus:outline-none focus:border-[#D4AF37]/50 transition-all duration-300 group-hover:border-[#D4AF37]/40"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A09682] group-hover:text-[#D4AF37] transition-colors" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[#D4AF37] text-[#0F0F0F] hover:bg-[#C46A00] rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/20">
                  Explore
                </button>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link href="/heroes">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-[#D4AF37] text-[#0F0F0F] hover:bg-[#C46A00] rounded-full font-medium shadow-lg shadow-[#D4AF37]/20 transition-all duration-300 flex items-center gap-2"
                >
                  Explore Bravehearts
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/timeline">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D7C9A5] hover:bg-[#D4AF37]/20 rounded-full font-medium transition-all duration-300"
                >
                  Begin the Journey
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator with text */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-10"
        >
          <div className="w-6 h-10 border-2 border-[#D4AF37]/20 rounded-full flex justify-center pt-2 mx-auto mb-2">
            <div className="w-1 h-3 bg-[#D4AF37]/40 rounded-full animate-pulse" />
          </div>
          <span className="text-xs text-[#A09682]/50 tracking-wider font-light">
            Scroll to Explore
          </span>
        </motion.div>
      </section>
    </>
  );
}