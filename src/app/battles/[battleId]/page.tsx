"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Swords,
  Shield,
  Crown,
  BookOpen,
  ScrollText,
  Users,
  Landmark,
  ExternalLink,
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface Reference {
  _id?: string;
  name?: string;
  title?: string;

  heroId?: string;
  historicalPersonalityId?: string;
  kingdomId?: string;
  eventId?: string;
  battleId?: string;
  bookId?: string;
  sourceId?: string;
  weaponId?: string;
  placeId?: string;
  imageId?: string;
}

interface BattleSection {
  title: string;
  content: string;
  order: number;
}

interface Battle {
  _id: string;
  battleId: string;
  name: string;

  shortDescription?: string;
  description: string;

  battleSections?: BattleSection[];

  nativeName?: string;
  alternativeNames?: string[];

  type?: "battle" | "siege" | "capture" | "engagement";

  battleDate?: string | null;
  battleEndDate?: string | null;
  battleDateAccuracy?: string;

  locationId?: Reference;
  historicalPeriodId?: Reference;

  kingdomIds?: Reference[];

  commanderIds?: Reference[];
  commanderPersonalityIds?: Reference[];

  opposingCommanderIds?: Reference[];
  opposingCommanderPersonalityIds?: Reference[];

  victorId?: Reference;
  victorModel?: "Hero" | "Kingdom";

  armySizes?: {
    attackers?: string;
    defenders?: string;
  };

  casualties?: {
    attackers?: string;
    defenders?: string;
  };

  weapons?: string[];

  tactics?: string[];

  terrain?: string;

  outcome?: string;

  keyEvents?: string[];

  significance?: string;

  aftermath?: string;

  imageIds?: Reference[];
  sourceIds?: Reference[];

  tags?: string[];

  crossReferences?: {
    relatedHeroes?: Reference[];
    relatedHistoricalPersonalities?: Reference[];
    relatedKingdoms?: Reference[];
    relatedWeapons?: Reference[];
    relatedPlaces?: Reference[];
    relatedEvents?: Reference[];
    relatedBattles?: Reference[];
    relatedBooks?: Reference[];
    relatedSources?: Reference[];
    relatedImages?: Reference[];
  };

  status: string;
}

function formatDate(
  date?: string | null,
  accuracy?: string
) {
  if (!date) {
    return "Date Unknown";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Date Unknown";
  }

  const formatted = parsed.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  if (accuracy && accuracy !== "Exact") {
    return `${formatted} (${accuracy})`;
  }

  return formatted;
}

function getDuration(
  start?: string | null,
  end?: string | null
) {
  if (!start || !end) {
    return null;
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    return null;
  }

  const difference =
    endDate.getTime() - startDate.getTime();

  const days =
    Math.floor(
      difference / (1000 * 60 * 60 * 24)
    ) + 1;

  if (days <= 1) {
    return "1 day";
  }

  return `${days} days`;
}

function ReferenceCard({
  item,
  href,
  type,
}: {
  item: Reference;
  href?: string;
  type: string;
}) {
  const content = (
    <div className="group rounded-xl border border-[#D4AF37]/10 bg-[#1C1410]/60 p-5 transition-all duration-300 hover:border-[#D4AF37]/30 hover:bg-[#1C1410]">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/50 mb-2">
        {type}
      </p>

      <div className="flex items-center justify-between gap-3">
        <p className="font-serif text-lg leading-snug text-[#F8F5F0] group-hover:text-[#D4AF37] transition-colors">
          {item.name ||
            item.title ||
            "Unnamed record"}
        </p>

        {href && (
          <ExternalLink className="w-4 h-4 shrink-0 text-[#D4AF37]/40 group-hover:text-[#D4AF37]" />
        )}
      </div>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mt-14">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 shrink-0 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-center justify-center text-[#D4AF37]">
          {icon}
        </div>

        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#F8F5F0]">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function ReferenceGrid({
  items,
  type,
  hrefBuilder,
}: {
  items?: Reference[];
  type: string;
  hrefBuilder?: (
    item: Reference
  ) => string | undefined;
}) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <ReferenceCard
          key={
            item._id ||
            `${item.name || item.title}-${index}`
          }
          item={item}
          type={type}
          href={
            hrefBuilder
              ? hrefBuilder(item)
              : undefined
          }
        />
      ))}
    </div>
  );
}

function splitParagraphs(text?: string) {
  if (!text) {
    return [];
  }

  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function NarrativeBlock({
  text,
}: {
  text?: string;
}) {
  const paragraphs = splitParagraphs(text);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <div className="section-card p-7 md:p-9">
      <div className="max-w-4xl space-y-6">
        {paragraphs.map(
          (paragraph, index) => (
            <p
              key={index}
              className="text-base md:text-lg leading-8 text-[#D7C9A5]"
            >
              {paragraph}
            </p>
          )
        )}
      </div>
    </div>
  );
}

function BattleNarrative({
  sections,
  fallbackDescription,
}: {
  sections?: BattleSection[];
  fallbackDescription?: string;
}) {
  const sortedSections =
    sections &&
    sections.length > 0
      ? [...sections].sort(
          (a, b) => a.order - b.order
        )
      : [];

  if (sortedSections.length === 0) {
    return (
      <NarrativeBlock
        text={fallbackDescription}
      />
    );
  }

  return (
    <div className="space-y-6">
      {sortedSections.map(
        (section, index) => (
          <article
            key={`${section.order}-${section.title}`}
            className="section-card p-7 md:p-9"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-9 h-9 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-center justify-center text-[#D4AF37] font-serif text-sm">
                {String(index + 1).padStart(
                  2,
                  "0"
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-xl md:text-2xl font-bold text-[#F8F5F0] mb-5">
                  {section.title}
                </h3>

                <div className="space-y-5">
                  {splitParagraphs(
                    section.content
                  ).map(
                    (paragraph, paragraphIndex) => (
                      <p
                        key={paragraphIndex}
                        className="text-base md:text-lg leading-8 text-[#D7C9A5]"
                      >
                        {paragraph}
                      </p>
                    )
                  )}
                </div>
              </div>
            </div>
          </article>
        )
      )}
    </div>
  );
}

export default function BattleDetailPage() {
  const params = useParams();
  const battleId =
    params?.battleId as string;

  const [battle, setBattle] =
    useState<Battle | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!battleId) {
      return;
    }

    async function fetchBattle() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/battles/${encodeURIComponent(
            battleId
          )}`
        );

        if (!response.ok) {
          throw new Error(
            "Battle could not be found."
          );
        }

        const result =
          await response.json();

        const battleData =
          result.data ?? result;

        setBattle(battleData);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load this battle record."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBattle();
  }, [battleId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0F0F0F] text-[#F8F5F0]">
        <Navbar />

        <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
          <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />

          <p className="mt-5 text-[#A09682] text-center">
            Opening the battlefield archives...
          </p>
        </div>

        <Footer />
      </main>
    );
  }

  if (error || !battle) {
    return (
      <main className="min-h-screen bg-[#0F0F0F] text-[#F8F5F0]">
        <Navbar />

        <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
          <Swords className="w-12 h-12 text-[#D4AF37] mb-5" />

          <h1 className="font-serif text-3xl font-bold mb-3">
            Battle Not Found
          </h1>

          <p className="text-[#A09682] mb-7 max-w-md">
            {error ||
              "This battle record does not exist."}
          </p>

          <Link
            href="/battles"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Battles
          </Link>
        </div>

        <Footer />
      </main>
    );
  }

  const refs = battle.crossReferences;

  const relatedBattles =
    refs?.relatedBattles?.filter(
      (item) =>
        item.battleId !== battle.battleId
    );

  const duration = getDuration(
    battle.battleDate,
    battle.battleEndDate
  );

  const hasForces =
    !!(
      battle.armySizes?.attackers ||
      battle.armySizes?.defenders
    );

  const hasCasualties =
    !!(
      battle.casualties?.attackers ||
      battle.casualties?.defenders
    );

  const hasWeapons =
    !!(
      battle.weapons &&
      battle.weapons.length > 0
    ) ||
    !!(
      refs?.relatedWeapons &&
      refs.relatedWeapons.length > 0
    );

  const hasCommanders =
    !!(
      battle.commanderIds &&
      battle.commanderIds.length > 0
    ) ||
    !!(
      battle.commanderPersonalityIds &&
      battle.commanderPersonalityIds.length >
        0
    );

  const hasOpposingCommanders =
    !!(
      battle.opposingCommanderIds &&
      battle.opposingCommanderIds.length > 0
    ) ||
    !!(
      battle.opposingCommanderPersonalityIds &&
      battle.opposingCommanderPersonalityIds
        .length > 0
    );

  const hasKingdoms =
    !!(
      battle.kingdomIds &&
      battle.kingdomIds.length > 0
    );

  const hasTactics =
    !!(
      battle.tactics &&
      battle.tactics.length > 0
    );

  const hasKeyEvents =
    !!(
      battle.keyEvents &&
      battle.keyEvents.length > 0
    );

  const hasRelatedEvents =
    !!(
      refs?.relatedEvents &&
      refs.relatedEvents.length > 0
    );

  const hasRelatedBattles =
    !!(
      relatedBattles &&
      relatedBattles.length > 0
    );

  const hasRelatedHeroes =
    !!(
      refs?.relatedHeroes &&
      refs.relatedHeroes.length > 0
    );

  const hasRelatedPersonalities =
    !!(
      refs?.relatedHistoricalPersonalities &&
      refs.relatedHistoricalPersonalities.length >
        0
    );

  const hasRelatedPlaces =
    !!(
      refs?.relatedPlaces &&
      refs.relatedPlaces.length > 0
    );

  const hasRelatedBooks =
    !!(
      refs?.relatedBooks &&
      refs.relatedBooks.length > 0
    );

  const hasSources =
    !!(
      battle.sourceIds &&
      battle.sourceIds.length > 0
    );

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F8F5F0]">
      <Navbar />

      {/* =========================================================
            HERO
        ========================================================= */}
        <section className="relative pt-32 md:pt-36 pb-12 overflow-hidden">
          {/* Background atmosphere */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#D4AF37]/5 blur-3xl" />

            <div className="absolute top-24 left-0 w-80 h-80 rounded-full bg-[#8B1E1E]/10 blur-3xl" />

            <div className="absolute top-20 right-0 w-80 h-80 rounded-full bg-[#D4AF37]/5 blur-3xl" />
          </div>

          <div className="relative container mx-auto px-6">
            {/* Breadcrumb */}
            <Link
              href="/battles"
              className="inline-flex items-center gap-2 text-sm text-[#A09682] hover:text-[#D4AF37] transition-colors mb-9"
            >
              <ArrowLeft className="w-4 h-4" />
              Battles Archive
            </Link>

            <div className="max-w-5xl">
              {/* ID + STATUS */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <Swords className="w-4 h-4 text-[#D4AF37]" />

                <span className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37]/70">
                  {battle.battleId}
                </span>

                <span className="px-3 py-1 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[10px] uppercase tracking-[0.15em] text-[#D7C9A5]">
                  {battle.status}
                </span>
              </div>

              {/* TITLE */}
              <h1 className="max-w-4xl font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight">
                {battle.name}
              </h1>

              {/* NATIVE NAME */}
              {battle.nativeName && (
                <p className="mt-4 text-xl text-[#A09682]">
                  {battle.nativeName}
                </p>
              )}

              {/* ALTERNATIVE NAMES */}
              {battle.alternativeNames &&
                battle.alternativeNames.length > 0 && (
                  <p className="mt-3 text-sm text-[#A09682]">
                    Also known as{" "}
                    {battle.alternativeNames.join(", ")}
                  </p>
                )}

              {/* Decorative divider */}
              <div className="flex items-center gap-3 my-7 max-w-3xl">
                <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/40 to-transparent" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]/60" />
              </div>

              {/* SHORT DESCRIPTION */}
              <p className="max-w-4xl text-lg md:text-xl leading-8 text-[#D7C9A5]">
                {battle.shortDescription ||
                  "A historical military engagement recorded in the VeerBharat archives."}
              </p>
            </div>
          </div>
        </section>


        {/* =========================================================
              QUICK FACTS
          ========================================================= */}
          <section className="pb-14">
            <div className="container mx-auto px-6">
              {/* Section header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-center justify-center">
                  <Swords className="w-3.5 h-3.5 text-[#D4AF37]" />
                </div>
                <h2 className="text-xs uppercase tracking-[0.25em] text-[#A09682] font-medium">
                  Quick Facts
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/20 to-transparent" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                
                {/* DATE */}
                <div className="group relative overflow-hidden rounded-xl border border-[#D4AF37]/10 bg-gradient-to-br from-[#1C1410]/80 to-[#1C1410]/40 p-5 transition-all duration-300 hover:border-[#D4AF37]/30 hover:shadow-lg hover:shadow-[#D4AF37]/5 hover:-translate-y-0.5">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[#D4AF37]/5 blur-2xl group-hover:bg-[#D4AF37]/10 transition-colors" />
                  
                  <div className="relative">
                    <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-3 group-hover:bg-[#D4AF37]/20 transition-colors">
                      <CalendarDays className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#A09682] font-medium">
                      Battle Date
                    </p>
                    
                    <p className="mt-2 text-sm font-serif text-[#F8F5F0] leading-snug">
                      {battle.battleDate
                        ? battle.battleEndDate
                          ? `${new Date(battle.battleDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })} – ${new Date(battle.battleEndDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}`
                          : formatDate(battle.battleDate, battle.battleDateAccuracy)
                        : "Date Unknown"}
                    </p>
                    
                    {battle.battleDate && !battle.battleEndDate && (
                      <p className="mt-1 text-[10px] text-[#A09682]">
                        {new Date(battle.battleDate).getFullYear()}
                      </p>
                    )}
                  </div>
                </div>

                {/* LOCATION */}
                <div className="group relative overflow-hidden rounded-xl border border-[#D4AF37]/10 bg-gradient-to-br from-[#1C1410]/80 to-[#1C1410]/40 p-5 transition-all duration-300 hover:border-[#D4AF37]/30 hover:shadow-lg hover:shadow-[#D4AF37]/5 hover:-translate-y-0.5">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[#D4AF37]/5 blur-2xl group-hover:bg-[#D4AF37]/10 transition-colors" />
                  
                  <div className="relative">
                    <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-3 group-hover:bg-[#D4AF37]/20 transition-colors">
                      <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#A09682] font-medium">
                      Location
                    </p>
                    
                    <p className="mt-2 text-sm font-serif text-[#F8F5F0] leading-snug">
                      {battle.locationId?.name || "—"}
                    </p>
                    
                    
                  </div>
                </div>

                {/* HISTORICAL PERIOD */}
                <div className="group relative overflow-hidden rounded-xl border border-[#D4AF37]/10 bg-gradient-to-br from-[#1C1410]/80 to-[#1C1410]/40 p-5 transition-all duration-300 hover:border-[#D4AF37]/30 hover:shadow-lg hover:shadow-[#D4AF37]/5 hover:-translate-y-0.5">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[#D4AF37]/5 blur-2xl group-hover:bg-[#D4AF37]/10 transition-colors" />
                  
                  <div className="relative">
                    <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-3 group-hover:bg-[#D4AF37]/20 transition-colors">
                      <Shield className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#A09682] font-medium">
                      Period
                    </p>
                    
                    <p className="mt-2 text-sm font-serif text-[#F8F5F0] leading-snug">
                      {battle.historicalPeriodId?.name || "—"}
                    </p>
                    
                    {battle.type && (
                      <p className="mt-1 text-[10px] text-[#A09682] capitalize">
                        {battle.type}
                      </p>
                    )}
                  </div>
                </div>

                {/* VICTOR */}
                <div className="group relative overflow-hidden rounded-xl border border-[#D4AF37]/10 bg-gradient-to-br from-[#1C1410]/80 to-[#1C1410]/40 p-5 transition-all duration-300 hover:border-[#D4AF37]/30 hover:shadow-lg hover:shadow-[#D4AF37]/5 hover:-translate-y-0.5">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[#D4AF37]/5 blur-2xl group-hover:bg-[#D4AF37]/10 transition-colors" />
                  
                  <div className="relative">
                    <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-3 group-hover:bg-[#D4AF37]/20 transition-colors">
                      <Crown className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#A09682] font-medium">
                      Victor
                    </p>
                    
                    <p className="mt-2 text-sm font-serif text-[#F8F5F0] leading-snug">
                      {battle.victorId?.name || "—"}
                    </p>
                    
                    {battle.victorModel && (
                      <p className="mt-1 text-[10px] text-[#A09682]">
                        {battle.victorModel}
                      </p>
                    )}
                  </div>
                </div>

                {/* DURATION */}
                <div className="group relative overflow-hidden rounded-xl border border-[#D4AF37]/10 bg-gradient-to-br from-[#1C1410]/80 to-[#1C1410]/40 p-5 transition-all duration-300 hover:border-[#D4AF37]/30 hover:shadow-lg hover:shadow-[#D4AF37]/5 hover:-translate-y-0.5">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[#D4AF37]/5 blur-2xl group-hover:bg-[#D4AF37]/10 transition-colors" />
                  
                  <div className="relative">
                    <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-3 group-hover:bg-[#D4AF37]/20 transition-colors">
                      <CalendarDays className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#A09682] font-medium">
                      Duration
                    </p>
                    
                    <p className="mt-2 text-sm font-serif text-[#F8F5F0] leading-snug">
                      {duration || "—"}
                    </p>
                    
                    {battle.battleDate && (
                      <p className="mt-1 text-[10px] text-[#A09682]">
                        {new Date(battle.battleDate).getFullYear()}
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </section>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}
      <div className="container mx-auto px-6 pb-24 max-w-6xl">

        {/* =======================================================
            BATTLE NARRATIVE
        ======================================================= */}
        {(battle.battleSections &&
          battle.battleSections.length > 0) ||
        battle.description ? (
          <Section
            title="Battle Narrative"
            icon={
              <ScrollText className="w-4 h-4" />
            }
          >
            <BattleNarrative
              sections={
                battle.battleSections
              }
              fallbackDescription={
                battle.description
              }
            />
          </Section>
        ) : null}

        {/* =======================================================
            COMMANDERS
        ======================================================= */}
        {hasCommanders && (
          <Section
            title="Commanders"
            icon={
              <Users className="w-4 h-4" />
            }
          >
            {battle.commanderIds &&
              battle.commanderIds.length >
                0 && (
                <ReferenceGrid
                  items={battle.commanderIds}
                  type="Commander"
                  hrefBuilder={(item) =>
                    item.heroId
                      ? `/heroes/${encodeURIComponent(
                          item.heroId
                        )}`
                      : undefined
                  }
                />
              )}

            {battle.commanderPersonalityIds &&
              battle.commanderPersonalityIds
                .length > 0 && (
                <div
                  className={
                    battle.commanderIds &&
                    battle.commanderIds.length >
                      0
                      ? "mt-5"
                      : ""
                  }
                >
                  <ReferenceGrid
                    items={
                      battle.commanderPersonalityIds
                    }
                    type="Historical Personality"
                    hrefBuilder={(item) =>
                      item.historicalPersonalityId
                        ? `/historical-personalities/${encodeURIComponent(
                            item.historicalPersonalityId
                          )}`
                        : undefined
                    }
                  />
                </div>
              )}
          </Section>
        )}

        {/* =======================================================
            OPPOSING COMMANDERS
        ======================================================= */}
        {hasOpposingCommanders && (
          <Section
            title="Opposing Commanders"
            icon={
              <Shield className="w-4 h-4" />
            }
          >
            {battle.opposingCommanderIds &&
              battle.opposingCommanderIds.length >
                0 && (
                <ReferenceGrid
                  items={
                    battle.opposingCommanderIds
                  }
                  type="Opposing Commander"
                  hrefBuilder={(item) =>
                    item.heroId
                      ? `/heroes/${encodeURIComponent(
                          item.heroId
                        )}`
                      : undefined
                  }
                />
              )}

            {battle.opposingCommanderPersonalityIds &&
              battle.opposingCommanderPersonalityIds
                .length > 0 && (
                <div
                  className={
                    battle.opposingCommanderIds &&
                    battle.opposingCommanderIds
                      .length > 0
                      ? "mt-5"
                      : ""
                  }
                >
                  <ReferenceGrid
                    items={
                      battle.opposingCommanderPersonalityIds
                    }
                    type="Historical Personality"
                    hrefBuilder={(item) =>
                      item.historicalPersonalityId
                        ? `/historical-personalities/${encodeURIComponent(
                            item.historicalPersonalityId
                          )}`
                        : undefined
                    }
                  />
                </div>
              )}
          </Section>
        )}

        {/* =======================================================
            KINGDOMS
        ======================================================= */}
        {hasKingdoms && (
          <Section
            title="Kingdoms and Powers"
            icon={
              <Landmark className="w-4 h-4" />
            }
          >
            <ReferenceGrid
              items={battle.kingdomIds}
              type="Kingdom"
              hrefBuilder={(item) =>
                item.kingdomId
                  ? `/kingdoms/${encodeURIComponent(
                      item.kingdomId
                    )}`
                  : undefined
              }
            />
          </Section>
        )}

        {/* =======================================================
            FORCES
        ======================================================= */}
        {hasForces && (
          <Section
            title="Forces"
            icon={
              <Users className="w-4 h-4" />
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              {battle.armySizes?.attackers && (
                <div className="section-card p-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#A09682] mb-3">
                    Attackers
                  </p>

                  <p className="text-[#D7C9A5] leading-relaxed">
                    {battle.armySizes.attackers}
                  </p>
                </div>
              )}

              {battle.armySizes?.defenders && (
                <div className="section-card p-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#A09682] mb-3">
                    Defenders
                  </p>

                  <p className="text-[#D7C9A5] leading-relaxed">
                    {battle.armySizes.defenders}
                  </p>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* =======================================================
            TERRAIN
        ======================================================= */}
        {battle.terrain && (
          <Section
            title="Battlefield and Terrain"
            icon={
              <MapPin className="w-4 h-4" />
            }
          >
            <NarrativeBlock
              text={battle.terrain}
            />
          </Section>
        )}

        {/* =======================================================
            TACTICS
        ======================================================= */}
        {hasTactics && (
          <Section
            title="Tactics"
            icon={
              <Swords className="w-4 h-4" />
            }
          >
            <div className="flex flex-wrap gap-3">
              {battle.tactics!.map(
                (tactic, index) => (
                  <span
                    key={`${tactic}-${index}`}
                    className="px-4 py-2 rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/5 text-sm text-[#D7C9A5]"
                  >
                    {tactic}
                  </span>
                )
              )}
            </div>
          </Section>
        )}

        {/* =======================================================
            KEY EVENTS
        ======================================================= */}
        {hasKeyEvents && (
          <Section
            title="Key Events"
            icon={
              <Swords className="w-4 h-4" />
            }
          >
            <div className="space-y-3">
              {battle.keyEvents!.map(
                (event, index) => (
                  <div
                    key={`${event}-${index}`}
                    className="section-card p-5 flex gap-4"
                  >
                    <span className="shrink-0 text-[#D4AF37] font-serif text-lg">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <p className="text-[#D7C9A5] leading-relaxed">
                      {event}
                    </p>
                  </div>
                )
              )}
            </div>
          </Section>
        )}

        {/* =======================================================
            WEAPONS
        ======================================================= */}
        {hasWeapons && (
          <Section
            title="Weapons and Military Technology"
            icon={
              <Swords className="w-4 h-4" />
            }
          >
            {battle.weapons &&
              battle.weapons.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {battle.weapons.map(
                    (weapon, index) => (
                      <span
                        key={`${weapon}-${index}`}
                        className="px-4 py-2 rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/5 text-sm text-[#D7C9A5]"
                      >
                        {weapon}
                      </span>
                    )
                  )}
                </div>
              )}

            {refs?.relatedWeapons &&
              refs.relatedWeapons.length >
                0 && (
                <div
                  className={
                    battle.weapons &&
                    battle.weapons.length > 0
                      ? "mt-5"
                      : ""
                  }
                >
                  <ReferenceGrid
                    items={
                      refs.relatedWeapons
                    }
                    type="Related Weapon"
                  />
                </div>
              )}
          </Section>
        )}

        {/* =======================================================
            CASUALTIES
        ======================================================= */}
        {hasCasualties && (
          <Section
            title="Casualties"
            icon={
              <Shield className="w-4 h-4" />
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              {battle.casualties?.attackers && (
                <div className="section-card p-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#A09682] mb-3">
                    Attackers
                  </p>

                  <p className="text-[#D7C9A5] leading-relaxed">
                    {battle.casualties.attackers}
                  </p>
                </div>
              )}

              {battle.casualties?.defenders && (
                <div className="section-card p-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#A09682] mb-3">
                    Defenders
                  </p>

                  <p className="text-[#D7C9A5] leading-relaxed">
                    {battle.casualties.defenders}
                  </p>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* =======================================================
            OUTCOME
        ======================================================= */}
        {battle.outcome && (
          <Section
            title="Outcome"
            icon={
              <Crown className="w-4 h-4" />
            }
          >
            <div className="rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-7 md:p-8">
              <p className="text-[#F0E7D0] text-base md:text-lg leading-8 whitespace-pre-line">
                {battle.outcome}
              </p>
            </div>
          </Section>
        )}

        {/* =======================================================
            AFTERMATH
        ======================================================= */}
        {battle.aftermath && (
          <Section
            title="Aftermath"
            icon={
              <ScrollText className="w-4 h-4" />
            }
          >
            <NarrativeBlock
              text={battle.aftermath}
            />
          </Section>
        )}

        {/* =======================================================
            SIGNIFICANCE
        ======================================================= */}
        {battle.significance && (
          <Section
            title="Historical Significance"
            icon={
              <Landmark className="w-4 h-4" />
            }
          >
            <NarrativeBlock
              text={battle.significance}
            />
          </Section>
        )}

        {/* =======================================================
            RELATED EVENTS
        ======================================================= */}
        {hasRelatedEvents && (
          <Section
            title="Related Historical Events"
            icon={
              <ScrollText className="w-4 h-4" />
            }
          >
            <ReferenceGrid
              items={refs?.relatedEvents}
              type="Event"
              hrefBuilder={(item) =>
                item.eventId
                  ? `/events/${encodeURIComponent(
                      item.eventId
                    )}`
                  : undefined
              }
            />
          </Section>
        )}

        {/* =======================================================
            RELATED BATTLES
        ======================================================= */}
        {hasRelatedBattles && (
          <Section
            title="Related Battles"
            icon={
              <Swords className="w-4 h-4" />
            }
          >
            <ReferenceGrid
              items={relatedBattles}
              type="Battle"
              hrefBuilder={(item) =>
                item.battleId
                  ? `/battles/${encodeURIComponent(
                      item.battleId
                    )}`
                  : undefined
              }
            />
          </Section>
        )}

        {/* =======================================================
            RELATED HEROES
        ======================================================= */}
        {hasRelatedHeroes && (
          <Section
            title="Related Heroes"
            icon={
              <Users className="w-4 h-4" />
            }
          >
            <ReferenceGrid
              items={refs?.relatedHeroes}
              type="Hero"
              hrefBuilder={(item) =>
                item.heroId
                  ? `/heroes/${encodeURIComponent(
                      item.heroId
                    )}`
                  : undefined
              }
            />
          </Section>
        )}

        {/* =======================================================
            RELATED PERSONALITIES
        ======================================================= */}
        {hasRelatedPersonalities && (
          <Section
            title="Related Historical Personalities"
            icon={
              <Users className="w-4 h-4" />
            }
          >
            <ReferenceGrid
              items={
                refs?.relatedHistoricalPersonalities
              }
              type="Historical Personality"
              hrefBuilder={(item) =>
                item.historicalPersonalityId
                  ? `/historical-personalities/${encodeURIComponent(
                      item.historicalPersonalityId
                    )}`
                  : undefined
              }
            />
          </Section>
        )}

        {/* =======================================================
            PLACES
        ======================================================= */}
        {hasRelatedPlaces && (
          <Section
            title="Related Places"
            icon={
              <MapPin className="w-4 h-4" />
            }
          >
            <ReferenceGrid
              items={refs?.relatedPlaces}
              type="Place"
              hrefBuilder={(item) =>
                item.placeId
                  ? `/places/${encodeURIComponent(
                      item.placeId
                    )}`
                  : undefined
              }
            />
          </Section>
        )}

        {/* =======================================================
            BOOKS
        ======================================================= */}
        {hasRelatedBooks && (
          <Section
            title="Related Books"
            icon={
              <BookOpen className="w-4 h-4" />
            }
          >
            <ReferenceGrid
              items={refs?.relatedBooks}
              type="Book"
              hrefBuilder={(item) =>
                item.bookId
                  ? `/books/${encodeURIComponent(
                      item.bookId
                    )}`
                  : undefined
              }
            />
          </Section>
        )}

        {/* =======================================================
            SOURCES
        ======================================================= */}
        {hasSources && (
          <Section
            title="Sources"
            icon={
              <BookOpen className="w-4 h-4" />
            }
          >
            <ReferenceGrid
              items={battle.sourceIds}
              type="Source"
              hrefBuilder={(item) =>
                item.sourceId
                  ? `/sources/${encodeURIComponent(
                      item.sourceId
                    )}`
                  : undefined
              }
            />
          </Section>
        )}

        {/* =======================================================
            TAGS
        ======================================================= */}
        {battle.tags &&
          battle.tags.length > 0 && (
            <section className="mt-14 pt-8 border-t border-[#D4AF37]/10">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#A09682] mb-4">
                Archive Tags
              </p>

              <div className="flex flex-wrap gap-2">
                {battle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/5 text-xs text-[#D4AF37]/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}
      </div>

      <Footer />
    </main>
  );
}