"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  ArrowLeft,
  Shield,
  Calendar,
  Crown,
  Landmark,
  MapPin,
  Swords,
  Users,
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface HistoricalPersonalityImage {
  _id: string;
  imageId: string;
  title: string;
  url: string;
  altText: string;
  imageType: string;
}

interface HeroReference {
  heroId: string;
  name: string;
}

interface HistoricalPersonality {
  _id: string;

  historicalPersonalityId: string;

  name: string;

  alternativeNames?: string[];
  relatedHeroes?: HeroReference[];
  relatedBattles?: BattleReference[];
  relatedEvents?: EventReference[];
  title?: string;
  shortDescription?: string;

  biography?: string;
  category?: string;

  roles?: string[];

  imageIds?: HistoricalPersonalityImage[];

  birthDate?: string;

  deathDate?: string;

  birthplace?: {
    name?: string;
    region?: string;
    presentDayLocation?: string;
  };

  deathPlace?: {
    name?: string;
    presentDayLocation?: string;
  };

  dynasty?: string;

  kingdom?: string;

  allegiance?: {
    entity: string;
    role: string;
  }[];

  knownFor?: string[];

  majorEvents?: {
    name: string;
    year?: number;
    date?: string;
    role?: string;
  }[];

  legacy?: string;

  classificationReason?: string;

  tags?: string[];

  status?: string;
}


interface BattleReference {
  battleId: string;
  name: string;
}

interface EventReference {
  eventId: string;
  name: string;
}

interface HeroLinkCandidate {
  hero: HeroReference;
  name: string;
}

interface HistoricalPersonalityResponse {
  success?: boolean;
  data?: HistoricalPersonality;
  message?: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function HistoricalPersonalityDetailPage({
  params,
}: PageProps) {
  const [personality, setPersonality] =
    useState<HistoricalPersonality | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function fetchPersonality() {
      try {
        setLoading(true);

        setError("");

        const { id } =
          await params;

        const response = await fetch(
          `/api/historical-personalities/${id}`
        );

        const result: HistoricalPersonalityResponse =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Historical personality not found."
          );
        }

        /*
         * Supports both:
         *
         * { data: personality }
         *
         * and direct personality response
         */

        const personalityData =
          result.data ??
          (result as unknown as HistoricalPersonality);

        setPersonality(
          personalityData
        );
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load this historical personality."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPersonality();
  }, [params]);

  function formatDate(
    date?: string
  ) {
    if (!date) {
      return "Unknown";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
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

  if (error || !personality) {
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
              Historical Personality Not Found
            </h1>

            <p className="text-[#A09682] mb-8">
              {error ||
                "The requested historical record could not be found."}
            </p>

            <Link
              href="/historical-personalities"
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
            href="/historical-personalities"
            className="inline-flex items-center gap-2 text-sm text-[#A09682] hover:text-[#D4AF37] transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />

            Back to Historical Personalities
          </Link>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[380px_1fr] gap-12 lg:gap-16 items-center">

              {/* HISTORICAL PERSONALITY PORTRAIT */}

              <div className="flex justify-center">
                {personality.imageIds?.[0] ? (
                  <div className="relative w-full max-w-[380px]">

                    {/* OUTER DECORATIVE FRAME */}

                    <div className="absolute -inset-3 rounded-[2rem] border border-[#D4AF37]/20" />

                    <div className="absolute -inset-1 rounded-[1.7rem] bg-gradient-to-br from-[#D4AF37]/20 via-transparent to-[#C46A00]/20" />

                    {/* IMAGE FRAME */}

                    <div className="group relative aspect-[3/4] overflow-hidden rounded-[1.5rem] border border-[#D4AF37]/40 bg-[#17130F] shadow-[0_25px_80px_rgba(0,0,0,0.55)]">

                      <Image
                        src={
                          personality
                            .imageIds[0]
                            .url
                        }
                        alt={
                          personality
                            .imageIds[0]
                            .altText ||
                          personality.name
                        }
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* CINEMATIC GRADIENT */}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/70 via-transparent to-transparent pointer-events-none" />

                    </div>

                    {/* DECORATIVE LABEL */}

                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-5 py-2 rounded-full border border-[#D4AF37]/30 bg-[#17130F] text-xs uppercase tracking-[0.25em] text-[#D4AF37] shadow-lg">
                      Historical Portrait
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full max-w-[380px]">

                    <div className="absolute -inset-3 rounded-[2rem] border border-[#D4AF37]/20" />

                    <div className="absolute -inset-1 rounded-[1.7rem] bg-gradient-to-br from-[#D4AF37]/20 via-transparent to-[#C46A00]/20" />

                    <div className="aspect-[3/4] rounded-[1.5rem] border border-[#D4AF37]/20 bg-[#17130F] flex items-center justify-center">
                      <Shield className="w-20 h-20 text-[#D4AF37]/30" />
                    </div>

                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-5 py-2 rounded-full border border-[#D4AF37]/30 bg-[#17130F] text-xs uppercase tracking-[0.25em] text-[#D4AF37] shadow-lg">
                      Historical Record
                    </div>
                  </div>
                )}
              </div>

              {/* HISTORICAL PERSONALITY INFORMATION */}

              <div className="text-center lg:text-left pt-8 lg:pt-0">

                <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]/60 mb-5">
                  {personality.historicalPersonalityId}
                </p>

                <h1 className="font-serif text-5xl md:text-7xl font-bold text-gold-gradient">
                  {personality.name}
                </h1>

                {personality.alternativeNames &&
                  personality.alternativeNames.length >
                    0 && (
                    <p className="mt-4 text-lg text-[#A09682]">
                      {personality.alternativeNames.join(
                        " • "
                      )}
                    </p>
                  )}

                {personality.title && (
                  <p className="mt-5 text-lg md:text-xl text-[#D4AF37]">
                    {personality.title}
                  </p>
                )}
                {personality.shortDescription && (
                  <p className="max-w-2xl mt-7 text-[#D7C9A5] leading-relaxed mx-auto lg:mx-0">
                    {personality.shortDescription}
                  </p>
                )}

                <div className="flex items-center justify-center lg:justify-start gap-4 mt-7">
                  <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#D4AF37]/40" />

                  <span className="text-[#D4AF37]/40">
                    ✦ ✦ ✦
                  </span>

                  <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
                </div>

                {personality.roles &&
                  personality.roles.length > 0 && (
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-7">
                      {personality.roles.map(
                        (role) => (
                          <span
                            key={role}
                            className="px-3 py-2 rounded-lg bg-[#1C1410] border border-[#D4AF37]/10 text-sm text-[#D7C9A5]"
                          >
                            {role}
                          </span>
                        )
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN RECORD */}

      <section className="section-dark pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">

            {/* STATUS */}

            {personality.status && (
              <div className="flex justify-center mb-10">
                <span className="px-4 py-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-xs uppercase tracking-[0.2em] text-[#D7C9A5]">
                  {personality.status}
                </span>
              </div>
            )}

            {/* BASIC INFORMATION */}

            <div className="grid md:grid-cols-2 gap-6">

              {/* HISTORICAL RECORD */}

              <div className="section-card-hover p-7">
                <div className="flex items-center gap-3 mb-6">
                  <Crown className="w-5 h-5 text-[#D4AF37]" />

                  <h2 className="font-serif text-2xl font-bold">
                    Historical Record
                  </h2>
                </div>

                <div className="space-y-4 text-sm">
                  <InfoRow
                    label="Category"
                    value={
                      personality.category
                    }
                  />

                  <InfoRow
                    label="Dynasty"
                    value={
                      personality.dynasty
                    }
                  />

                  <InfoRow
                    label="Kingdom"
                    value={
                      personality.kingdom
                    }
                  />

                  <InfoRow
                    label="Birthplace"
                    value={
                      personality.birthplace
                        ?.name
                    }
                  />

                  <InfoRow
                    label="Death Place"
                    value={
                      personality.deathPlace
                        ?.name
                    }
                  />
                </div>
              </div>

              {/* LIFE */}

              <div className="section-card-hover p-7">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-5 h-5 text-[#D4AF37]" />

                  <h2 className="font-serif text-2xl font-bold">
                    Life & Era
                  </h2>
                </div>

                <div className="space-y-4 text-sm">
                  <InfoRow
                    label="Birth"
                    value={formatDate(
                      personality.birthDate
                    )}
                  />

                  <InfoRow
                    label="Death"
                    value={formatDate(
                      personality.deathDate
                    )}
                  />

                  <InfoRow
                    label="Birth Region"
                    value={
                      personality.birthplace
                        ?.region
                    }
                  />

                  <InfoRow
                    label="Present-Day Birthplace"
                    value={
                      personality.birthplace
                        ?.presentDayLocation
                    }
                  />

                  <InfoRow
                    label="Present-Day Death Place"
                    value={
                      personality.deathPlace
                        ?.presentDayLocation
                    }
                  />
                </div>
              </div>
            </div>
            {/* BIOGRAPHY */}

              {personality.biography && (
                <div className="section-card-hover p-8 md:p-10 mt-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/60 mb-3">
                    Historical Biography
                  </p>

                  <h2 className="font-serif text-3xl font-bold mb-6">
                    Biography
                  </h2>

                  <p className="text-[#D7C9A5] leading-8 whitespace-pre-line">
                    <LinkedHistoricalText
                      text={personality.biography}
                      heroes={personality.relatedHeroes ?? []}
                      battles={personality.relatedBattles ?? []}
                      events={personality.relatedEvents ?? []}
                    />
                  </p>
                </div>
              )}                       
            {/* KNOWN FOR */}

            {personality.knownFor &&
              personality.knownFor.length > 0 && (
                <div className="section-card-hover p-8 md:p-10 mt-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/60 mb-3">
                    Historical Significance
                  </p>

                  <div className="flex items-center gap-3 mb-8">
                    <Shield className="w-6 h-6 text-[#D4AF37]" />

                    <h2 className="font-serif text-3xl font-bold">
                      Known For
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {personality.knownFor.map(
                      (item, index) => (
                        <span
                          key={`${item}-${index}`}
                          className="px-4 py-3 rounded-lg bg-[#1C1410] border border-[#D4AF37]/10 text-sm text-[#D7C9A5]"
                        >
                          {item}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* MAJOR EVENTS */}

            {personality.majorEvents &&
              personality.majorEvents.length >
                0 && (
                <div className="section-card-hover p-8 md:p-10 mt-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/60 mb-3">
                    Historical Timeline
                  </p>

                  <div className="flex items-center gap-3 mb-8">
                    <Swords className="w-6 h-6 text-[#D4AF37]" />

                    <h2 className="font-serif text-3xl font-bold">
                      Major Events
                    </h2>
                  </div>

                  <div className="space-y-5">
                    {personality.majorEvents.map(
                      (event, index) => (
                        <div
                          key={`${event.name}-${index}`}
                          className="relative pl-6 pb-5 border-l border-[#D4AF37]/20"
                        >
                          <div className="absolute w-3 h-3 rounded-full bg-[#D4AF37] -left-[6.5px] top-1" />

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h3 className="font-serif text-xl">
                              {event.name}
                            </h3>

                            <span className="text-sm text-[#D4AF37]">
                              {event.year ||
                                (event.date
                                  ? new Date(
                                      event.date
                                    ).getFullYear()
                                  : "")}
                            </span>
                          </div>

                          {event.role && (
                            <p className="text-sm text-[#A09682] mt-2">
                              {event.role}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* ALLEGIANCE */}

            {personality.allegiance &&
              personality.allegiance.length >
                0 && (
                <div className="section-card-hover p-8 md:p-10 mt-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/60 mb-3">
                    Political & Military Associations
                  </p>

                  <div className="flex items-center gap-3 mb-8">
                    <Users className="w-6 h-6 text-[#D4AF37]" />

                    <h2 className="font-serif text-3xl font-bold">
                      Allegiance
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    {personality.allegiance.map(
                      (item, index) => (
                        <div
                          key={`${item.entity}-${index}`}
                          className="p-5 rounded-lg bg-[#1C1410] border border-[#D4AF37]/10"
                        >
                          <p className="font-serif text-lg text-[#F8F5F0]">
                            {item.entity}
                          </p>

                          <p className="text-sm text-[#A09682] mt-2">
                            {item.role}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* HISTORICAL CONTEXT */}

            {personality.classificationReason && (
              <div className="section-card-hover p-8 md:p-10 mt-6">
                <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/60 mb-3">
                  Historical Context
                </p>

                <div className="flex items-center gap-3 mb-6">
                  <Landmark className="w-6 h-6 text-[#D4AF37]" />

                  <h2 className="font-serif text-3xl font-bold">
                    Classification
                  </h2>
                </div>

                <p className="text-[#D7C9A5] leading-8">
                  <LinkedHistoricalText
                    text={personality.classificationReason}
                    heroes={personality.relatedHeroes ?? []}
                    battles={personality.relatedBattles ?? []}
                    events={personality.relatedEvents ?? []}
                  />
                </p>
              </div>
            )}

            {/* LEGACY */}

            {personality.legacy && (
              <div className="section-card-hover p-8 md:p-10 mt-6">
                <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/60 mb-3">
                  Remembered
                </p>

                <h2 className="font-serif text-3xl font-bold mb-6">
                  Legacy
                </h2>

                <p className="text-[#D7C9A5] leading-8">
                  <LinkedHistoricalText
                    text={personality.legacy}
                    heroes={personality.relatedHeroes ?? []}
                    battles={personality.relatedBattles ?? []}
                    events={personality.relatedEvents ?? []}
                  />
                </p>
              </div>
            )}

            {/* TAGS */}

            {personality.tags &&
              personality.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {personality.tags.map(
                    (tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-sm text-[#D7C9A5]"
                      >
                        #{tag}
                      </span>
                    )
                  )}
                </div>
              )}

            {/* FOOTER NAVIGATION */}

            <div className="mt-14 text-center">
              <Link
                href="/historical-personalities"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#D4AF37]/30 text-[#D7C9A5] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all"
              >
                <ArrowLeft className="w-4 h-4" />

                Return to Historical Personalities
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
  if (
    !value ||
    value === "Unknown"
  ) {
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

function LinkedHistoricalText({
  text,
  heroes,
  battles = [],
  events = [],
}: {
  text: string;
  heroes: HeroReference[];
  battles?: BattleReference[];
  events?: EventReference[];
}) {
  if (
    !text ||
    (
      heroes.length === 0 &&
      battles.length === 0 &&
      events.length === 0
    )
  ) {
    return <>{text}</>;
  }

  const escapeRegExp = (value: string) =>
    value.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

  /*
   * HERO CANDIDATES
   */
  const heroCandidates = heroes
    .filter(
      (hero) =>
        typeof hero?.heroId === "string" &&
        hero.heroId.trim() !== "" &&
        typeof hero?.name === "string" &&
        hero.name.trim() !== ""
    )
    .flatMap((hero) => {
      const fullName = hero.name.trim();

      const personalName = fullName
        .replace(
          /^(Field Marshal|General|Lieutenant General|Major General|Brigadier|Colonel|Lieutenant Colonel|Major|Captain|Commander|Lieutenant|Subedar Major|Subedar|Naik|Havildar|Mahatma|Pandit|Dr\.?|Sir)\s+/i,
          ""
        )
        .trim();

      const candidates: {
        hero: HeroReference;
        name: string;
      }[] = [
        {
          hero,
          name: fullName,
        },
      ];

      if (
        personalName &&
        personalName.toLowerCase() !==
          fullName.toLowerCase()
      ) {
        candidates.push({
          hero,
          name: personalName,
        });
      }

      return candidates;
    });

  /*
   * BATTLE CANDIDATES
   */
  const battleCandidates = battles
    .filter(
      (battle) =>
        typeof battle?.battleId === "string" &&
        battle.battleId.trim() !== "" &&
        typeof battle?.name === "string" &&
        battle.name.trim() !== ""
    )
    .map((battle) => ({
      battle,
      name: battle.name.trim(),
    }));

  /*
   * EVENT CANDIDATES
   */
  const eventCandidates = events
    .filter(
      (event) =>
        typeof event?.eventId === "string" &&
        event.eventId.trim() !== "" &&
        typeof event?.name === "string" &&
        event.name.trim() !== ""
    )
    .map((event) => ({
      event,
      name: event.name.trim(),
    }));

  /*
   * LONGEST NAMES FIRST
   *
   * Prevents:
   *
   * "Battle of Plassey"
   *
   * from being partially matched
   * before a longer matching name.
   */
  const candidates = [
    ...heroCandidates.map((candidate) => ({
      type: "hero" as const,
      ...candidate,
    })),

    ...battleCandidates.map((candidate) => ({
      type: "battle" as const,
      ...candidate,
    })),

    ...eventCandidates.map((candidate) => ({
      type: "event" as const,
      ...candidate,
    })),
  ].sort(
    (a, b) =>
      b.name.length - a.name.length
  );

  if (candidates.length === 0) {
    return <>{text}</>;
  }

  const pattern = candidates
    .map((candidate) =>
      escapeRegExp(candidate.name)
    )
    .join("|");

  const regex = new RegExp(
    `(${pattern})`,
    "gi"
  );

  return (
    <>
      {text.split(regex).map(
        (part, index) => {
          const candidate =
            candidates.find(
              (item) =>
                item.name.toLowerCase() ===
                part.trim().toLowerCase()
            );

          if (!candidate) {
            return (
              <span key={index}>
                {part}
              </span>
            );
          }

          /*
           * HERO
           */
          if (candidate.type === "hero") {
            return (
              <Link
                key={`hero-${candidate.hero.heroId}-${index}`}
                href={`/heroes/${encodeURIComponent(
                  candidate.hero.heroId
                )}`}
                className="text-[#D4AF37] hover:text-[#F0D878] underline underline-offset-4 decoration-[#D4AF37]/30 hover:decoration-[#D4AF37] transition-colors"
              >
                {part}
              </Link>
            );
          }

          /*
           * BATTLE
           */
          if (candidate.type === "battle") {
            return (
              <Link
                key={`battle-${candidate.battle.battleId}-${index}`}
                href={`/battles/${encodeURIComponent(
                  candidate.battle.battleId
                )}`}
                className="text-[#D4AF37] hover:text-[#F0D878] underline underline-offset-4 decoration-[#D4AF37]/30 hover:decoration-[#D4AF37] transition-colors"
              >
                {part}
              </Link>
            );
          }

          /*
           * EVENT
           */
          return (
            <Link
              key={`event-${candidate.event.eventId}-${index}`}
              href={`/events/${encodeURIComponent(
                candidate.event.eventId
              )}`}
              className="text-[#D4AF37] hover:text-[#F0D878] underline underline-offset-4 decoration-[#D4AF37]/30 hover:decoration-[#D4AF37] transition-colors"
            >
              {part}
            </Link>
          );
        }
      )}
    </>
  );
}