"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Calendar } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface Hero {
  _id: string;
  heroId: string;
  name: string;
  nativeName: string;
  alternativeNames: string[];
  title: string;
  gender: string;

  birthDate: string | null;
  birthDateAccuracy: string;
  deathDate: string | null;
  deathDateAccuracy: string;

  causeOfDeath: string;
  nickname: string;

  personalityTraits: string[];
  legacy: string;

  biography: string;
  shortDescription: string;

  knownFor: string[];
  occupation: string[];
  roles: string[];
  languagesKnown: string[];
  education: string[];
  religion: string;

  coronationDate: string | null;

  militaryTactics: string[];
  notableFeats: string[];
  rank: string;

  armySize: number | null;

  clan: string;
  reignPeriod: string;

  achievements: string[];

  tags: string[];

  status: string;

  metadata: {
    createdBy: string;
    verifiedBy: string;
    version: number;
  };

  createdAt: string;
  updatedAt: string;
}

interface HeroResponse {
  success?: boolean;
  data?: Hero;
  message?: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function HeroDetailPage({
  params,
}: PageProps) {
  const [hero, setHero] = useState<Hero | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHero() {
      try {
        setLoading(true);
        setError("");

        const { id } = await params;

        const response = await fetch(
          `/api/heroes/${id}`
        );

        const result: HeroResponse =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Hero not found."
          );
        }

        /*
         * Your current API returns the Hero document
         * directly for GET /api/heroes/[id].
         *
         * This supports both:
         *   { data: hero }
         * and
         *   hero
         */
        const heroData =
          result.data ??
          (result as unknown as Hero);

        setHero(heroData);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load this hero."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchHero();
  }, [params]);

  function formatDate(
    date: string | null,
    accuracy?: string
  ) {
    if (!date) {
      return "Unknown";
    }

    const formatted = new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

    if (
      accuracy &&
      accuracy !== "Unknown"
    ) {
      return `${formatted} (${accuracy})`;
    }

    return formatted;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0F0F0F] text-[#F8F5F0]">
        <Navbar />

        <section className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />

            <p className="mt-6 text-[#A09682]">
              Opening the historical record...
            </p>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  if (error || !hero) {
    return (
      <main className="min-h-screen bg-[#0F0F0F] text-[#F8F5F0]">
        <Navbar />

        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-lg w-full text-center section-card p-10">
            <Shield className="w-12 h-12 mx-auto text-[#D4AF37]/60 mb-6" />

            <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]/60 mb-3">
              Historical Record
            </p>

            <h1 className="font-serif text-3xl font-bold mb-4">
              Hero Not Found
            </h1>

            <p className="text-[#A09682] mb-8">
              {error ||
                "The requested historical record could not be found."}
            </p>

            <Link
              href="/heroes"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37] text-[#0F0F0F] font-medium hover:bg-[#C46A00] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Archive
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F8F5F0]">
      <Navbar />

      {/* HERO HEADER */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[#D4AF37]/5 blur-3xl" />

          <div className="absolute inset-0 bg-radial-gradient" />
        </div>

        <div className="relative container mx-auto px-6">
          <Link
            href="/heroes"
            className="inline-flex items-center gap-2 text-sm text-[#A09682] hover:text-[#D4AF37] transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Bravehearts
          </Link>

          <div className="max-w-5xl mx-auto text-center">
            <div className="flex justify-center mb-7">
              <div className="w-20 h-20 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.08)]">
                <Shield className="w-10 h-10 text-[#D4AF37]" />
              </div>
            </div>

            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/60 mb-4">
              {hero.heroId}
            </p>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-gold-gradient">
              {hero.name}
            </h1>

            {hero.nativeName && (
              <p className="mt-4 text-lg text-[#A09682]">
                {hero.nativeName}
              </p>
            )}

            {hero.title && (
              <p className="mt-5 text-lg md:text-xl text-[#D4AF37]">
                {hero.title}
              </p>
            )}

            <div className="flex items-center justify-center gap-4 mt-7">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#D4AF37]/40" />

              <span className="text-[#D4AF37]/40">
                ✦ ✦ ✦
              </span>

              <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
            </div>

            {hero.shortDescription && (
              <p className="max-w-2xl mx-auto mt-7 text-[#D7C9A5] leading-relaxed">
                {hero.shortDescription}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* MAIN RECORD */}
      <section className="section-dark pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* STATUS */}
            <div className="flex justify-center mb-10">
              <span className="px-4 py-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-xs uppercase tracking-[0.2em] text-[#D7C9A5]">
                {hero.status}
              </span>
            </div>

            {/* BASIC INFORMATION */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="section-card-hover p-7">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-5 h-5 text-[#D4AF37]" />

                  <h2 className="font-serif text-2xl font-bold">
                    Personal Record
                  </h2>
                </div>

                <div className="space-y-4 text-sm">
                  <InfoRow
                    label="Gender"
                    value={hero.gender}
                  />

                  <InfoRow
                    label="Nickname"
                    value={hero.nickname}
                  />

                  <InfoRow
                    label="Clan"
                    value={hero.clan}
                  />

                  <InfoRow
                    label="Religion"
                    value={hero.religion}
                  />

                  <InfoRow
                    label="Rank"
                    value={hero.rank}
                  />
                </div>
              </div>

              {/* LIFE */}
              <div className="section-card-hover p-7">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-5 h-5 text-[#D4AF37]" />

                  <h2 className="font-serif text-2xl font-bold">
                    Life & Legacy
                  </h2>
                </div>

                <div className="space-y-4 text-sm">
                  <InfoRow
                    label="Birth"
                    value={formatDate(
                      hero.birthDate,
                      hero.birthDateAccuracy
                    )}
                  />

                  <InfoRow
                    label="Death"
                    value={formatDate(
                      hero.deathDate,
                      hero.deathDateAccuracy
                    )}
                  />

                  <InfoRow
                    label="Cause of Death"
                    value={hero.causeOfDeath}
                  />

                  <InfoRow
                    label="Coronation"
                    value={formatDate(
                      hero.coronationDate
                    )}
                  />

                  <InfoRow
                    label="Reign"
                    value={hero.reignPeriod}
                  />
                </div>
              </div>
            </div>

            {/* BIOGRAPHY */}
            <div className="section-card-hover p-8 md:p-10 mt-6">
              <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/60 mb-3">
                Chronicle
              </p>

              <h2 className="font-serif text-3xl font-bold mb-6">
                Biography
              </h2>

              <p className="text-[#D7C9A5] leading-8 whitespace-pre-line">
                {hero.biography}
              </p>
            </div>

            {/* KNOWN FOR */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <ArraySection
                title="Known For"
                items={hero.knownFor}
              />

              <ArraySection
                title="Occupations"
                items={hero.occupation}
              />

              <ArraySection
                title="Roles"
                items={hero.roles}
              />

              <ArraySection
                title="Languages"
                items={hero.languagesKnown}
              />
            </div>

            {/* MILITARY */}
            <div className="section-card-hover p-8 md:p-10 mt-6">
              <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/60 mb-3">
                Martial Legacy
              </p>

              <h2 className="font-serif text-3xl font-bold mb-8">
                Military Record
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <InfoRow
                    label="Rank"
                    value={hero.rank}
                  />

                  <InfoRow
                    label="Army Size"
                    value={
                      hero.armySize !== null
                        ? hero.armySize.toLocaleString(
                            "en-IN"
                          )
                        : "Unknown"
                    }
                  />
                </div>

                <ArraySection
                  title="Military Tactics"
                  items={hero.militaryTactics}
                />
              </div>

              <div className="mt-8">
                <ArraySection
                  title="Notable Feats"
                  items={hero.notableFeats}
                />
              </div>
            </div>

            {/* ACHIEVEMENTS */}
            <div className="section-card-hover p-8 md:p-10 mt-6">
              <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/60 mb-3">
                Contributions
              </p>

              <h2 className="font-serif text-3xl font-bold mb-6">
                Achievements
              </h2>

              <ArraySection
                title=""
                items={hero.achievements}
              />
            </div>

            {/* LEGACY */}
            {hero.legacy && (
              <div className="section-card-hover p-8 md:p-10 mt-6">
                <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/60 mb-3">
                  Remembered
                </p>

                <h2 className="font-serif text-3xl font-bold mb-6">
                  Legacy
                </h2>

                <p className="text-[#D7C9A5] leading-8">
                  {hero.legacy}
                </p>
              </div>
            )}

            {/* TAGS */}
            {hero.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {hero.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-sm text-[#D7C9A5]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* FOOTER NAVIGATION */}
            <div className="mt-14 text-center">
              <Link
                href="/heroes"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#D4AF37]/30 text-[#D7C9A5] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Bravehearts Archive
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1 pb-3 border-b border-[#D4AF37]/10">
      <span className="text-xs uppercase tracking-wider text-[#A09682]">
        {label}
      </span>

      <span className="text-[#D7C9A5]">
        {value}
      </span>
    </div>
  );
}

function ArraySection({
  title,
  items,
}: {
  title: string;
  items?: string[];
}) {
  if (!items || items.length === 0) {
    return (
      <div>
        {title && (
          <h3 className="text-sm uppercase tracking-wider text-[#A09682] mb-3">
            {title}
          </h3>
        )}

        <p className="text-sm text-[#A09682]/60">
          No information recorded.
        </p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h3 className="text-sm uppercase tracking-wider text-[#D4AF37]/70 mb-4">
          {title}
        </h3>
      )}

      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="px-3 py-2 rounded-lg bg-[#1C1410] border border-[#D4AF37]/10 text-sm text-[#D7C9A5]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
