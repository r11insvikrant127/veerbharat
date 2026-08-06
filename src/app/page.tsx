// src/app/page.tsx
'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { OnThisDay } from '@/components/sections/OnThisDay';
import { FeaturedHeroes } from '@/components/sections/FeaturedHeroes';
import { HistoryTimeline } from '@/components/sections/HistoryTimeline';
import { InteractiveMap } from '@/components/sections/InteractiveMap';
import { GreatBattles } from '@/components/sections/GreatBattles';
import { BooksSection } from '@/components/sections/BooksSection';
import { QuoteSection } from '@/components/sections/QuoteSection';
import { CTASection } from '@/components/sections/CTASection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0F0F0F]">
      <Navbar />
      <HeroSection />
      <OnThisDay />
      <FeaturedHeroes />
      <HistoryTimeline />
      <InteractiveMap />
      <GreatBattles />
      <BooksSection />
      <QuoteSection />
      <CTASection />
      <Footer />
    </main>
  );
}