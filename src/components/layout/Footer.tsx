// src/components/layout/Footer.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { FaXTwitter, FaYoutube, FaInstagram } from 'react-icons/fa6';
import { motion } from 'framer-motion';

export function Footer() {
  const socialLinks = [
    { icon: FaXTwitter, label: 'Twitter' },
    { icon: FaYoutube, label: 'YouTube' },
    { icon: FaInstagram, label: 'Instagram' },
  ];

  return (
    <footer className="relative bg-[#0F0F0F] border-t border-[#D4AF37]/10">
      {/* Subtle gold glow at top */}
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37]/30 shadow-lg flex-shrink-0">
                <Image
                  src="/images/veerbharat.png"
                  alt="Veer Bharat"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gold-gradient">
                Veer Bharat
              </h3>
            </div>
            <p className="text-[#D7C9A5] text-sm max-w-md leading-relaxed">
              Honouring the brave hearts of India's glorious past through 
              curated stories, historical accuracy, and immersive experiences.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D7C9A5] hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-[#D4AF37] mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/heroes" className="text-[#D7C9A5] hover:text-[#D4AF37] transition-colors">
                  Heroes
                </Link>
              </li>
              <li>
                <Link href="/timeline" className="text-[#D7C9A5] hover:text-[#D4AF37] transition-colors">
                  Timeline
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#D7C9A5] hover:text-[#D4AF37] transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-[#D4AF37] mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-[#D7C9A5]">
              <li className="hover:text-[#D4AF37] transition-colors cursor-pointer">Twitter</li>
              <li className="hover:text-[#D4AF37] transition-colors cursor-pointer">YouTube</li>
              <li className="hover:text-[#D4AF37] transition-colors cursor-pointer">Instagram</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#D4AF37]/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-[#A09682]">
          <p>© {new Date().getFullYear()} Veer Bharat. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for India's heritage
          </p>
        </div>
      </div>
    </footer>
  );
}