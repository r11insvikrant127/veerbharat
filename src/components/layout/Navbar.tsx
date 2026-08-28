// src/components/layout/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, XCircle, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScroll } from '@/hooks/useScroll';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoExpanded, setIsLogoExpanded] = useState(false);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const isScrolled = useScroll(20);

  // Close modals on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLogoExpanded(false);
        setIsMissionModalOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/heroes', label: 'Bravehearts' },
    {
      href: '/historical-personalities',
      label: 'Historical Personalities',
    },
    { href: '/battles', label: 'Battles' },
    { href: '/events', label: 'Events' },
    { href: '/timeline', label: 'Timeline' },
    { href: '/about', label: 'About' },
  ];

  return (
    <>
      {/* Mission Modal - Museum Plaque Style */}
      {isMissionModalOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#030303]/95 backdrop-blur-2xl"
          onClick={() => setIsMissionModalOpen(false)}
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
              onClick={() => setIsMissionModalOpen(false)}
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
                To preserve and celebrate the stories of India&apos;s forgotten bravehearts, 
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

      {/* Logo Expansion Lightbox */}
      <AnimatePresence>
        {isLogoExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030303]/95 backdrop-blur-xl"
            onClick={() => setIsLogoExpanded(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="relative w-full max-w-7xl h-[90vh] flex items-center justify-center px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsLogoExpanded(false)}
                className="absolute top-10 right-10 text-white/50 hover:text-white transition-all duration-300 hover:scale-110 z-10"
              >
                <XCircle className="w-9 h-9" />
              </button>

              <motion.div
                className="relative w-full h-full max-h-[85vh]"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  filter: 'drop-shadow(0 0 80px rgba(212, 175, 55, 0.12))',
                }}
              >
                {/* Golden Glow */}
                <div
                  className="absolute inset-0 rounded-full blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.08) 40%, transparent 75%)",
                    transform: "scale(0.75)",
                  }}
                />
                <Image
                  src="/images/veerbharat.png"
                  alt="Veer Bharat"
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority
                  className="object-contain"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-gradient-to-b from-[#101010] via-[#15120F] to-[#101010] backdrop-blur-xl border-b border-[#D4AF37]/15 shadow-[0_12px_40px_rgba(0,0,0,0.45),0_1px_0_rgba(212,175,55,0.1)]'
            : 'bg-gradient-to-b from-[#101010]/80 via-[#15120F]/60 to-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-22 md:h-24">
            {/* Logo Section */}
            <button
              onClick={() => setIsLogoExpanded(true)}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-[#D4AF37]/30 shadow-lg shadow-[#D4AF37]/10 transition-all duration-300 group-hover:border-[#D4AF37]/60 group-hover:shadow-[#D4AF37]/30 group-hover:scale-105">
                <Image
                  src="/images/veerbharat.png"
                  alt="Veer Bharat"
                  fill
                  sizes="(max-width: 768px) 56px, 64px"
                  className="object-cover"
                  priority
                />
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link, index) => (
                <div key={link.href} className="flex items-center gap-6">
                  <Link
                    href={link.href}
                    className="relative group text-sm font-medium transition-colors duration-300 text-[#D7C9A5] hover:text-[#D4AF37]"
                  >
                    {link.label}
                    {/* Golden underline on hover */}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#C46A00] transition-all duration-300 group-hover:w-full" />
                  </Link>
                  {index < navLinks.length - 1 && (
                    <span className="text-[#D4AF37]/30 text-xs select-none">✦</span>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side - Search & Clickable Museum Badge */}
            <div className="flex items-center gap-6">
              {/* Museum Badge - Desktop - Now Clickable */}
              <button
                onClick={() => setIsMissionModalOpen(true)}
                className="hidden lg:flex items-center gap-2 text-xs text-[#D4AF37]/40 hover:text-[#D4AF37]/80 font-light tracking-wider transition-colors duration-300 group"
              >
                <span className="text-base group-hover:scale-110 transition-transform duration-300">📜</span>
                <span className="border-b border-transparent group-hover:border-[#D4AF37]/30 transition-all duration-300">
                  Preserving India&apos;s Legacy
                </span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  isScrolled ? 'text-[#D7C9A5] hover:bg-[#D4AF37]/10' : 'text-white hover:bg-white/10'
                }`}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden overflow-hidden border-t border-[#D4AF37]/10"
              >
                <nav className="py-4 flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-3 text-[#D7C9A5] hover:bg-[#D4AF37]/10 rounded-lg transition-colors flex items-center justify-between"
                    >
                      {link.label}
                      <span className="text-[#D4AF37]/30">✦</span>
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMissionModalOpen(true);
                    }}
                    className="px-4 py-3 text-xs text-[#D4AF37]/40 hover:text-[#D4AF37]/80 flex items-center gap-2 transition-colors duration-300 w-full text-left hover:bg-[#D4AF37]/10 rounded-lg"
                  >
                    <span>📜</span>
                    <span>Preserving India&apos;s Legacy</span>
                  </button>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}
