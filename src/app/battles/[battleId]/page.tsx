"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
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
  Image as ImageIcon,
  Clock3,
  Flag,
  Target,
  ChevronRight,
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/* =========================================================
   TYPES
========================================================= */

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

  url?: string;
  altText?: string;
  imageType?: string;
  description?: string;
  relatedSection?: string;
  period?: string;
  license?: string;
  copyright?: string;
  photographer?: string;

  tags?: string[];

  searchFields?: {
    keywords?: string[];
    nativeSpellings?: string[];
    alternateSpellings?: string[];
    aliases?: string[];
  };
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

/* =========================================================
   HELPERS
========================================================= */

function formatDate(
  date?: string | null,
  accuracy?: string
) {
  if (!date) return "Date Unknown";

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

function formatShortDate(date?: string | null) {
  if (!date) return "Unknown";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Unknown";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDuration(
  start?: string | null,
  end?: string | null
) {
  if (!start || !end) return null;

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

  return days <= 1
    ? "1 day"
    : `${days} days`;
}

function splitParagraphs(text?: string) {
  if (!text) return [];

  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/*
 * Removes old Markdown heading markers if any
 * still remain in database records.
 */
function cleanHeading(text: string) {
  return text.replace(/^#{1,6}\s*/, "").trim();
}

function isTimelineHeading(text: string) {
  const cleaned = cleanHeading(text);

  /*
   * Examples:
   *
   * 3 May 1999 — Initial Discovery
   * Early May 1999 — Patrols...
   * 11–12 December 1971 — Rapid Advance
   * June 1999 — Major Ground Battles
   */
  return (
    /\b(18|19|20)\d{2}\b/.test(cleaned) &&
    cleaned.length <= 150
  );
}
function normalizeImageKey(value?: string) {
  if (!value) return "";

  return value
    .toLowerCase()
    .replace(/^#{1,6}\s*/, "")
    .replace(/[—–-]/g, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getImagesForSection(
  sectionTitle: string,
  images: Reference[]
) {
  const sectionKey = normalizeImageKey(sectionTitle);

  if (!sectionKey) return [];

  /*
   * 1. Exact relatedSection match
   */
  const exactMatches = images.filter(
    (image) =>
      image.relatedSection &&
      normalizeImageKey(image.relatedSection) === sectionKey
  );

  if (exactMatches.length > 0) {
    return exactMatches;
  }

  /*
   * 2. Partial relatedSection match
   *
   * Example:
   * "High-Altitude Warfare"
   * matches
   * "High Altitude Warfare"
   */
  const relatedSectionMatches = images.filter(
    (image) => {
      if (!image.relatedSection) {
        return false;
      }

      const imageSectionKey =
        normalizeImageKey(image.relatedSection);

      return (
        imageSectionKey.includes(sectionKey) ||
        sectionKey.includes(imageSectionKey)
      );
    }
  );

  if (relatedSectionMatches.length > 0) {
    return relatedSectionMatches;
  }

  /*
   * 3. Keyword/tag fallback
   *
   * Only images without an explicit relatedSection
   * are allowed here.
   */
  const sectionWords = new Set(
    sectionKey
      .split(" ")
      .filter((word) => word.length >= 4)
  );

  return images.filter((image) => {
    if (image.relatedSection) {
      return false;
    }

    const keywords = [
      ...(image.searchFields?.keywords || []),
      ...(image.tags || []),
    ].map(normalizeImageKey);

    return keywords.some(
      (keyword) =>
        keyword === sectionKey ||
        sectionWords.has(keyword) ||
        sectionKey.includes(keyword) ||
        keyword.includes(sectionKey)
    );
  });
}

/* =========================================================
   GENERIC SECTION HEADER
========================================================= */

function Section({
  title,
  eyebrow,
  icon,
  children,
}: {
  title: string;
  eyebrow?: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mt-20">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 shrink-0 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-center justify-center text-[#D4AF37]">
            {icon}
          </div>

          <div>
            {eyebrow && (
              <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]/50">
                {eyebrow}
              </p>
            )}

            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#F8F5F0]">
              {title}
            </h2>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <div className="h-px w-16 bg-[#D4AF37]/40" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]/50" />
          <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/15 to-transparent" />
        </div>
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   FACT CARD
========================================================= */

function FactCard({
  label,
  value,
  subValue,
  icon,
}: {
  label: string;
  value: ReactNode;
  subValue?: ReactNode;
  icon: ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#D4AF37]/10 bg-gradient-to-br from-[#1C1410]/90 to-[#12100E]/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/30 hover:shadow-[0_18px_45px_rgba(0,0,0,0.25)]">
      <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#D4AF37]/5 blur-2xl group-hover:bg-[#D4AF37]/10 transition-colors" />

      <div className="relative">
        <div className="w-10 h-10 rounded-xl border border-[#D4AF37]/10 bg-[#D4AF37]/5 flex items-center justify-center text-[#D4AF37] mb-5">
          {icon}
        </div>

        <p className="text-[9px] uppercase tracking-[0.24em] text-[#A09682]">
          {label}
        </p>

        <div className="mt-2 font-serif text-base leading-snug text-[#F8F5F0]">
          {value}
        </div>

        {subValue && (
          <div className="mt-1 text-[11px] text-[#A09682]">
            {subValue}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   REFERENCE CARDS
========================================================= */

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
    <article className="group relative h-full overflow-hidden rounded-2xl border border-[#D4AF37]/10 bg-[#17120F]/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/30 hover:bg-[#1C1410]">
      <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-[#D4AF37]/5 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between gap-4 mb-4">
          <p className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37]/50">
            {type}
          </p>

          {href && (
            <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]/30 group-hover:text-[#D4AF37] transition-colors" />
          )}
        </div>

        <h3 className="font-serif text-lg md:text-xl leading-snug text-[#F8F5F0] group-hover:text-[#D4AF37] transition-colors">
          {item.name ||
            item.title ||
            "Unnamed record"}
        </h3>

        {href && (
          <div className="mt-5 pt-4 border-t border-[#D4AF37]/10 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#A09682] group-hover:text-[#D4AF37] transition-colors">
            Open archive
            <ArrowRight className="w-3 h-3" />
          </div>
        )}
      </div>
    </article>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
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

/* =========================================================
   STANDARD NARRATIVE
========================================================= */

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
    <div className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/10 bg-[#15110E]/80 p-7 md:p-10">
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl space-y-6">
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

/* =========================================================
   BATTLE NARRATIVE / TIMELINE
========================================================= */
function SectionImages({
  images,
}: {
  images: Reference[];
}) {
  if (!images.length) return null;

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2">
      {images.map((image, index) => (
        <figure
          key={
            image._id ||
            image.imageId ||
            index
          }
          className="group overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-[#100E0C] shadow-[0_18px_50px_rgba(0,0,0,0.28)]"
        >
          {image.url && (
            <div className="relative overflow-hidden bg-black">
              <img
                src={image.url}
                alt={
                  image.altText ||
                  image.title ||
                  "Historical image"
                }
                className="block w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.015]"
              />

              <div className="pointer-events-none absolute inset-0 border border-[#D4AF37]/10 rounded-2xl" />
            </div>
          )}

          <figcaption className="p-5">
            <p className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37]/55 mb-2">
              Historical Image
            </p>

            <h4 className="font-serif text-lg font-bold text-[#F8F5F0]">
              {image.title ||
                "Historical Image"}
            </h4>

            {image.description && (
              <p className="mt-3 text-sm leading-7 text-[#A09682]">
                {image.description}
              </p>
            )}

            {image.relatedSection && (
              <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-[#D4AF37]/45">
                Related to:{" "}
                {image.relatedSection}
              </p>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function BattleNarrative({
  sections,
  fallbackDescription,
  images = [],
}: {
  sections?: BattleSection[];
  fallbackDescription?: string;
  images?: Reference[];
}) {
  const sortedSections =
    sections && sections.length > 0
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
    <div className="space-y-8">
      {sortedSections.map(
        (section, index) => {
          const paragraphs = splitParagraphs(
            section.content
          );
          const sectionImages =
            getImagesForSection(
              section.title,
              images
            );

          const isTimeline =
            section.title
              .toLowerCase()
              .includes("timeline");

          /* =================================================
             TIMELINE SECTION
          ================================================= */

          if (isTimeline) {
            return (
              <article
                key={`${section.order}-${section.title}`}
                className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/25 bg-gradient-to-br from-[#1C1410] via-[#16110E] to-[#0F0D0B] p-7 md:p-11"
              >
                <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

                <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#8B1E1E]/5 blur-3xl pointer-events-none" />

                <div className="relative">
                  <div className="flex items-start gap-4 md:gap-5 mb-10">
                    <div className="w-12 h-12 shrink-0 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                      <Clock3 className="w-5 h-5" />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.32em] text-[#D4AF37]/55 mb-2">
                        Chronological Record
                      </p>

                      <h3 className="font-serif text-2xl md:text-4xl font-bold text-[#D4AF37]">
                        {section.title}
                      </h3>

                      <div className="mt-4 h-px w-32 bg-gradient-to-r from-[#D4AF37]/70 to-transparent" />
                    </div>
                  </div>

                  <div className="relative md:ml-3">
                    <div className="absolute left-[7px] md:left-[9px] top-3 bottom-5 w-px bg-gradient-to-b from-[#D4AF37]/70 via-[#D4AF37]/25 to-transparent" />

                    <div className="space-y-8">
                      {paragraphs.map(
                        (
                          rawParagraph,
                          paragraphIndex
                        ) => {
                          const paragraph =
                            cleanHeading(
                              rawParagraph
                            );

                          if (
                            isTimelineHeading(
                              paragraph
                            )
                          ) {
                            return (
                              <div
                                key={
                                  paragraphIndex
                                }
                                className="relative pl-9 md:pl-12 pt-1"
                              >
                                <div className="absolute left-0 md:left-[2px] top-[10px] w-[15px] h-[15px] rounded-full border-2 border-[#D4AF37] bg-[#15110E] shadow-[0_0_18px_rgba(212,175,55,0.35)]" />

                                <h4 className="inline font-serif text-lg md:text-xl lg:text-[22px] font-bold leading-relaxed text-[#D4AF37] border-b border-[#D4AF37]/35 pb-1">
                                  {paragraph}
                                </h4>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={
                                paragraphIndex
                              }
                              className="relative pl-9 md:pl-12"
                            >
                              <p className="max-w-4xl text-base md:text-lg leading-8 text-[#D7C9A5]">
                                {paragraph}
                              </p>
                            </div>
                          );
                        }
                      )}
                    </div>
                    
                  </div>
                </div>
              </article>
            );
          }

          /* =================================================
             NORMAL ARCHIVE SECTION
          ================================================= */

          return (
            <article
              key={`${section.order}-${section.title}`}
              className="group relative overflow-hidden rounded-2xl border border-[#D4AF37]/10 bg-[#15110E]/75 p-7 md:p-10 transition-all duration-300 hover:border-[#D4AF37]/20"
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#D4AF37]/[0.035] blur-3xl pointer-events-none" />

              <div className="relative flex gap-5 md:gap-7">
                <div className="hidden sm:flex shrink-0 flex-col items-center">
                  <div className="w-11 h-11 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-center justify-center font-serif text-sm font-bold text-[#D4AF37]">
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div className="mt-3 w-px flex-1 bg-gradient-to-b from-[#D4AF37]/15 to-transparent" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-6">
                    <p className="text-[9px] uppercase tracking-[0.28em] text-[#D4AF37]/45 mb-2">
                      Battle Record
                    </p>

                    <h3 className="font-serif text-xl md:text-2xl font-bold text-[#F8F5F0]">
                      {section.title}
                    </h3>
                  </div>

                  <div className="max-w-4xl space-y-6">
                    {paragraphs.map(
                      (
                        paragraph,
                        paragraphIndex
                      ) => (
                        <p
                          key={
                            paragraphIndex
                          }
                          className="text-base md:text-lg leading-8 text-[#D7C9A5]"
                        >
                          {cleanHeading(
                            paragraph
                          )}
                        </p>
                      )
                    )}
                  </div>
                  {sectionImages.length > 0 && (
                    <SectionImages
                      images={sectionImages}
                    />
                  )}
                </div>
              </div>
            </article>
          );
        }
      )}
    </div>
  );
}

/* =========================================================
   TWO-SIDE INFORMATION PANEL
========================================================= */

function TwoSidePanel({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
}: {
  leftLabel: string;
  leftValue?: string;
  rightLabel: string;
  rightValue?: string;
}) {
  return (
    <div className="grid md:grid-cols-2 overflow-hidden rounded-2xl border border-[#D4AF37]/10 bg-[#15110E]/80">
      {leftValue && (
        <div className="relative p-7 md:p-8 border-b md:border-b-0 md:border-r border-[#D4AF37]/10">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#A09682] mb-4">
            {leftLabel}
          </p>

          <p className="text-base md:text-lg leading-8 text-[#D7C9A5]">
            {leftValue}
          </p>
        </div>
      )}

      {rightValue && (
        <div className="relative p-7 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#A09682] mb-4">
            {rightLabel}
          </p>

          <p className="text-base md:text-lg leading-8 text-[#D7C9A5]">
            {rightValue}
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PILL LIST
========================================================= */

function PillList({
  items,
}: {
  items?: string[];
}) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/5 px-4 py-2 text-sm text-[#D7C9A5] transition-all duration-300 hover:border-[#D4AF37]/35 hover:bg-[#D4AF37]/10 hover:text-[#F8F5F0]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function HistoricalImages({
  images,
}: {
  images?: Reference[];
}) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <div className="flex items-center gap-3 mb-7">
        <div className="w-10 h-10 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-center justify-center text-[#D4AF37]">
          <ImageIcon className="w-5 h-5" />
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]/50 mb-1">
            Visual Record
          </p>

          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#F8F5F0]">
            Historical Images
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {images.map((image, index) => (
          <figure
            key={
              image._id ||
              image.imageId ||
              index
            }
            className="group overflow-hidden rounded-2xl border border-[#D4AF37]/10 bg-[#17120F]"
          >
            {image.url && (
              <div className="relative overflow-hidden rounded-xl bg-black border border-[#D4AF37]/10">
                <img
                  src={image.url}
                  alt={
                    image.altText ||
                    image.title ||
                    "Historical image"
                  }
                  className="block w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.015]"
                />

                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
              </div>
            )}

            <figcaption className="p-6">
              <h3 className="font-serif text-xl font-bold text-[#F8F5F0]">
                {image.title || "Historical Image"}
              </h3>

              {image.description && (
                <p className="mt-3 text-sm leading-7 text-[#A09682]">
                  {image.description}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.16em] text-[#D4AF37]/50">
                {image.imageType && (
                  <span>{image.imageType}</span>
                )}

                {image.period && (
                  <span>{image.period}</span>
                )}

                {image.relatedSection && (
                  <span>
                    {image.relatedSection}
                  </span>
                )}
              </div>

              {(image.photographer ||
                image.copyright ||
                image.license) && (
                <div className="mt-5 pt-4 border-t border-[#D4AF37]/10 text-xs leading-6 text-[#7F776A]">
                  {image.photographer && (
                    <p>
                      Photographer:{" "}
                      {image.photographer}
                    </p>
                  )}

                  {image.copyright && (
                    <p>
                      Copyright:{" "}
                      {image.copyright}
                    </p>
                  )}

                  {image.license && (
                    <p>
                      License: {image.license}
                    </p>
                  )}
                </div>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   PAGE
========================================================= */

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
    if (!battleId) return;

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

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0B0B] text-[#F8F5F0]">
        <Navbar />

        <div className="min-h-[75vh] flex flex-col items-center justify-center px-6">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border border-[#D4AF37]/15" />

            <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-transparent border-t-[#D4AF37] animate-spin" />

            <Swords className="absolute inset-0 m-auto w-5 h-5 text-[#D4AF37]/70" />
          </div>

          <p className="mt-6 text-[11px] uppercase tracking-[0.25em] text-[#A09682] text-center">
            Opening Battlefield Archives
          </p>
        </div>

        <Footer />
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !battle) {
    return (
      <main className="min-h-screen bg-[#0B0B0B] text-[#F8F5F0]">
        <Navbar />

        <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center">
          <div className="w-16 h-16 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-center justify-center mb-6">
            <Swords className="w-7 h-7 text-[#D4AF37]" />
          </div>

          <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]/60 mb-3">
            VeerBharat Archives
          </p>

          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Battle Not Found
          </h1>

          <p className="text-[#A09682] mb-8 max-w-md leading-7">
            {error ||
              "This battle record does not exist."}
          </p>

          <Link
            href="/battles"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Battles
          </Link>
        </div>

        <Footer />
      </main>
    );
  }

  /* =========================================================
     DERIVED DATA
  ========================================================= */

  const refs = battle.crossReferences;

  const battleImages = [
    ...(battle.imageIds || []),
    ...(refs?.relatedImages || []),
  ].filter(
    (image, index, array) =>
      array.findIndex(
        (item) =>
          (item._id && item._id === image._id) ||
          (item.imageId && item.imageId === image.imageId)
      ) === index
  );

  const primaryImage = battleImages[0];

  const galleryImages = battleImages.slice(1);

  const sectionImages = galleryImages.filter(
    (image) => !!image.relatedSection
  );

  const generalImages = galleryImages.filter(
    (image) => !image.relatedSection
  );

  const relatedBattles =
    refs?.relatedBattles?.filter(
      (item) =>
        item.battleId !== battle.battleId
    );

  const duration = getDuration(
    battle.battleDate,
    battle.battleEndDate
  );

  const hasForces = !!(
    battle.armySizes?.attackers ||
    battle.armySizes?.defenders
  );

  const hasCasualties = !!(
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
      battle.commanderPersonalityIds.length > 0
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

  const hasKingdoms = !!(
    battle.kingdomIds &&
    battle.kingdomIds.length > 0
  );

  const hasTactics = !!(
    battle.tactics &&
    battle.tactics.length > 0
  );

  const hasKeyEvents = !!(
    battle.keyEvents &&
    battle.keyEvents.length > 0
  );

  const hasRelatedEvents = !!(
    refs?.relatedEvents &&
    refs.relatedEvents.length > 0
  );

  const hasRelatedBattles = !!(
    relatedBattles &&
    relatedBattles.length > 0
  );

  const hasRelatedHeroes = !!(
    refs?.relatedHeroes &&
    refs.relatedHeroes.length > 0
  );

  const hasRelatedPersonalities = !!(
    refs?.relatedHistoricalPersonalities &&
    refs.relatedHistoricalPersonalities.length >
      0
  );

  const hasRelatedPlaces = !!(
    refs?.relatedPlaces &&
    refs.relatedPlaces.length > 0
  );

  const hasRelatedBooks = !!(
    refs?.relatedBooks &&
    refs.relatedBooks.length > 0
  );

  const hasSources = !!(
    battle.sourceIds &&
    battle.sourceIds.length > 0
  );

  const startYear = battle.battleDate
    ? new Date(
        battle.battleDate
      ).getFullYear()
    : null;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="min-h-screen overflow-hidden bg-[#0B0B0B] text-[#F8F5F0]">
      <Navbar />

      {/* =====================================================
          HERO / BATTLE DOSSIER
      ===================================================== */}

      <section className="relative pt-28 md:pt-36 pb-16 md:pb-20 overflow-hidden border-b border-[#D4AF37]/10">
        {/* Atmospheric background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] rounded-full bg-[#D4AF37]/[0.055] blur-3xl" />

          <div className="absolute top-20 -left-40 w-[500px] h-[500px] rounded-full bg-[#8B1E1E]/10 blur-3xl" />

          <div className="absolute bottom-[-250px] right-[-100px] w-[600px] h-[600px] rounded-full bg-[#D4AF37]/[0.035] blur-3xl" />

          {/* faint horizontal archive lines */}
          <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_bottom,#D4AF37_1px,transparent_1px)] bg-[length:100%_80px]" />
        </div>

        <div className="relative container mx-auto px-6 max-w-6xl">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
            <Link
              href="/battles"
              className="group inline-flex items-center gap-2 text-sm text-[#A09682] hover:text-[#D4AF37] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Battles Archive
            </Link>

            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />

              <span className="text-[9px] uppercase tracking-[0.28em] text-[#A09682]">
                Historical Military Record
              </span>
            </div>
          </div>

          <div className="max-w-5xl">
            {/* Archive metadata */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2">
                <Swords className="w-3.5 h-3.5 text-[#D4AF37]" />

                <span className="text-[10px] uppercase tracking-[0.28em] text-[#D4AF37]">
                  {battle.battleId}
                </span>
              </div>

              <div className="rounded-full border border-[#D4AF37]/10 bg-[#17120F]/80 px-4 py-2">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#A09682]">
                  {battle.status}
                </span>
              </div>

              {battle.type && (
                <div className="rounded-full border border-[#D4AF37]/10 bg-[#17120F]/80 px-4 py-2">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#A09682]">
                    {battle.type}
                  </span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[84px] font-bold leading-[0.98] tracking-tight text-[#F8F5F0]">
              {battle.name}
            </h1>

            {primaryImage?.url && (
              <figure className="mt-12 group">
                <div className="relative mx-auto max-w-5xl">

                  {/* Outer decorative frame */}
                  <div className="relative rounded-[28px] border border-[#D4AF37]/35 bg-gradient-to-br from-[#D4AF37]/10 via-[#17120F] to-[#8B1E1E]/10 p-[5px] shadow-[0_25px_80px_rgba(0,0,0,0.45)]">

                    {/* Inner decorative frame */}
                    <div className="relative rounded-[23px] border border-[#D4AF37]/15 bg-[#0F0D0B] p-2">

                      {/* Corner ornaments */}
                      <div className="absolute -top-2 -left-2 w-7 h-7 border-l-2 border-t-2 border-[#D4AF37]/70 rounded-tl-lg pointer-events-none" />
                      <div className="absolute -top-2 -right-2 w-7 h-7 border-r-2 border-t-2 border-[#D4AF37]/70 rounded-tr-lg pointer-events-none" />
                      <div className="absolute -bottom-2 -left-2 w-7 h-7 border-l-2 border-b-2 border-[#D4AF37]/70 rounded-bl-lg pointer-events-none" />
                      <div className="absolute -bottom-2 -right-2 w-7 h-7 border-r-2 border-b-2 border-[#D4AF37]/70 rounded-br-lg pointer-events-none" />

                      {/* Full image — NO CROPPING */}
                      <div className="relative overflow-hidden rounded-[18px] bg-black">
                        <img
                          src={primaryImage.url}
                          alt={
                            primaryImage.altText ||
                            primaryImage.title ||
                            battle.name
                          }
                          className="block w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.015]"
                        />

                        {/* subtle bottom gradient */}
                        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                        {/* Image title */}
                        <div className="absolute bottom-5 left-6 right-6 md:left-8 md:right-8">
                          <p className="text-[9px] uppercase tracking-[0.28em] text-[#D4AF37] mb-1">
                            Historical Image
                          </p>

                          <h2 className="font-serif text-xl md:text-2xl font-bold text-white">
                            {primaryImage.title || "Kargil War"}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Caption */}
                  {primaryImage.description && (
                    <figcaption className="mt-4 px-2 text-sm leading-7 text-[#8F877A] text-center">
                      {primaryImage.description}
                    </figcaption>
                  )}
                </div>
              </figure>
            )}

            {battle.nativeName &&
              battle.nativeName !== battle.name && (
                <p className="mt-5 font-serif text-xl md:text-2xl text-[#D4AF37]/65">
                  {battle.nativeName}
                </p>
              )}

            {battle.alternativeNames &&
              battle.alternativeNames.length >
                0 && (
                <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#A09682]">
                  <span className="text-[#D4AF37]/45">
                    Also recorded as
                  </span>

                  <span>
                    {battle.alternativeNames.join(
                      " · "
                    )}
                  </span>
                </div>
              )}

            {/* Date line */}
            <div className="my-9 flex items-center max-w-3xl">
              <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/60 to-[#D4AF37]/10" />

              <div className="mx-4 w-2 h-2 rotate-45 border border-[#D4AF37]/70 bg-[#0B0B0B]" />

              <span className="shrink-0 font-serif text-sm md:text-base text-[#D4AF37]/80">
                {startYear || "Historical Record"}
              </span>

              <div className="mx-4 w-2 h-2 rotate-45 border border-[#D4AF37]/70 bg-[#0B0B0B]" />

              <div className="h-px flex-1 bg-gradient-to-l from-[#D4AF37]/60 to-[#D4AF37]/10" />
            </div>

            {/* Description */}
            <p className="max-w-4xl text-lg md:text-xl leading-8 md:leading-9 text-[#D7C9A5]">
              {battle.shortDescription ||
                "A historical military engagement preserved in the VeerBharat archives."}
            </p>

            {/* Date / Location mini dossier */}
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-6">
              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-[#A09682] mb-2">
                  Campaign Period
                </p>

                <p className="font-serif text-base md:text-lg text-[#F8F5F0]">
                  {formatShortDate(
                    battle.battleDate
                  )}

                  {battle.battleEndDate &&
                    ` — ${formatShortDate(
                      battle.battleEndDate
                    )}`}
                </p>
              </div>

              <div className="hidden sm:block w-px bg-[#D4AF37]/15" />

              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-[#A09682] mb-2">
                  Theatre
                </p>

                <p className="font-serif text-base md:text-lg text-[#F8F5F0]">
                  {battle.locationId?.name ||
                    "Location not recorded"}
                </p>
              </div>

              {duration && (
                <>
                  <div className="hidden sm:block w-px bg-[#D4AF37]/15" />

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-[#A09682] mb-2">
                      Duration
                    </p>

                    <p className="font-serif text-base md:text-lg text-[#F8F5F0]">
                      {duration}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      
      {/* =====================================================
          MAIN ARCHIVE
      ===================================================== */}
      <div className="container mx-auto px-6 pb-28 max-w-6xl">

      

      
        {/* ===================================================
            NARRATIVE
        =================================================== */}

        {((battle.battleSections &&
          battle.battleSections.length > 0) ||
          battle.description) && (
          <Section
            title="Battle Narrative"
            eyebrow="Campaign Record"
            icon={
              <ScrollText className="w-4 h-4" />
            }
          >
            <BattleNarrative
              sections={battle.battleSections}
              fallbackDescription={
                battle.description
              }
              images={galleryImages}
            />
          </Section>
        )}

        {/* ===================================================
            COMMAND
        =================================================== */}

        {(hasCommanders ||
          hasOpposingCommanders) && (
          <Section
            title="Command Structure"
            eyebrow="Leadership"
            icon={
              <Users className="w-4 h-4" />
            }
          >
            <div className="space-y-8">
              {hasCommanders && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <Flag className="w-4 h-4 text-[#D4AF37]" />

                    <h3 className="font-serif text-xl font-bold">
                      Commanders
                    </h3>
                  </div>

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

                  {battle.commanderPersonalityIds &&
                    battle
                      .commanderPersonalityIds
                      .length > 0 && (
                      <div className="mt-4">
                        <ReferenceGrid
                          items={
                            battle.commanderPersonalityIds
                          }
                          type="Historical Personality"
                          hrefBuilder={(
                            item
                          ) =>
                            item.historicalPersonalityId
                              ? `/historical-personalities/${encodeURIComponent(
                                  item.historicalPersonalityId
                                )}`
                              : undefined
                          }
                        />
                      </div>
                    )}
                </div>
              )}

              {hasOpposingCommanders && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <Shield className="w-4 h-4 text-[#D4AF37]" />

                    <h3 className="font-serif text-xl font-bold">
                      Opposing Commanders
                    </h3>
                  </div>

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

                  {battle
                    .opposingCommanderPersonalityIds &&
                    battle
                      .opposingCommanderPersonalityIds
                      .length > 0 && (
                      <div className="mt-4">
                        <ReferenceGrid
                          items={
                            battle.opposingCommanderPersonalityIds
                          }
                          type="Historical Personality"
                          hrefBuilder={(
                            item
                          ) =>
                            item.historicalPersonalityId
                              ? `/historical-personalities/${encodeURIComponent(
                                  item.historicalPersonalityId
                                )}`
                              : undefined
                          }
                        />
                      </div>
                    )}
                </div>
              )}
            </div>
          </Section>
        )}

        {/* ===================================================
            KINGDOMS / POWERS
        =================================================== */}

        {hasKingdoms && (
          <Section
            title="Kingdoms and Powers"
            eyebrow="Belligerents"
            icon={
              <Landmark className="w-4 h-4" />
            }
          >
            <ReferenceGrid
              items={battle.kingdomIds}
              type="Kingdom / Power"
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

        {/* ===================================================
            FORCES
        =================================================== */}

        {hasForces && (
          <Section
            title="Forces in the Field"
            eyebrow="Strength"
            icon={
              <Users className="w-4 h-4" />
            }
          >
            <TwoSidePanel
              leftLabel="Attackers"
              leftValue={
                battle.armySizes?.attackers
              }
              rightLabel="Defenders"
              rightValue={
                battle.armySizes?.defenders
              }
            />
          </Section>
        )}

        {/* ===================================================
            TERRAIN
        =================================================== */}

        {battle.terrain && (
          <Section
            title="Battlefield and Terrain"
            eyebrow="Theatre of Operations"
            icon={
              <MapPin className="w-4 h-4" />
            }
          >
            <NarrativeBlock
              text={battle.terrain}
            />
          </Section>
        )}

        {/* ===================================================
            TACTICS
        =================================================== */}

        {hasTactics && (
          <Section
            title="Tactics"
            eyebrow="Operational Methods"
            icon={
              <Target className="w-4 h-4" />
            }
          >
            <div className="rounded-2xl border border-[#D4AF37]/10 bg-[#15110E]/70 p-6 md:p-8">
              <PillList
                items={battle.tactics}
              />
            </div>
          </Section>
        )}

        {/* ===================================================
            KEY EVENTS
        =================================================== */}

        {hasKeyEvents && (
          <Section
            title="Key Events"
            eyebrow="Campaign Highlights"
            icon={
              <Swords className="w-4 h-4" />
            }
          >
            <div className="relative">
              <div className="absolute left-[19px] top-5 bottom-5 w-px bg-gradient-to-b from-[#D4AF37]/30 to-transparent" />

              <div className="space-y-4">
                {battle.keyEvents!.map(
                  (event, index) => (
                    <div
                      key={`${event}-${index}`}
                      className="group relative flex gap-5"
                    >
                      <div className="relative z-10 shrink-0 w-10 h-10 rounded-full border border-[#D4AF37]/25 bg-[#11100E] flex items-center justify-center text-[#D4AF37] font-serif text-xs">
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </div>

                      <div className="flex-1 rounded-2xl border border-[#D4AF37]/10 bg-[#15110E]/70 p-5 md:p-6 transition-all duration-300 group-hover:border-[#D4AF37]/25">
                        <p className="text-[#D7C9A5] leading-8">
                          {event}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </Section>
        )}

        {/* ===================================================
            WEAPONS
        =================================================== */}

        {hasWeapons && (
          <Section
            title="Weapons and Military Technology"
            eyebrow="Arms & Equipment"
            icon={
              <Swords className="w-4 h-4" />
            }
          >
            {battle.weapons &&
              battle.weapons.length > 0 && (
                <div className="rounded-2xl border border-[#D4AF37]/10 bg-[#15110E]/70 p-6 md:p-8">
                  <PillList
                    items={battle.weapons}
                  />
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

        {/* ===================================================
            CASUALTIES
        =================================================== */}

        {hasCasualties && (
          <Section
            title="Casualties"
            eyebrow="Human Cost"
            icon={
              <Shield className="w-4 h-4" />
            }
          >
            <TwoSidePanel
              leftLabel="Attackers"
              leftValue={
                battle.casualties?.attackers
              }
              rightLabel="Defenders"
              rightValue={
                battle.casualties?.defenders
              }
            />
          </Section>
        )}

        {/* ===================================================
            OUTCOME
        =================================================== */}

        {battle.outcome && (
          <Section
            title="Outcome"
            eyebrow="Result of Battle"
            icon={
              <Crown className="w-4 h-4" />
            }
          >
            <div className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#20180F] via-[#18130F] to-[#11100E] p-8 md:p-11">
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 flex items-center justify-center">
                    <Crown className="w-4 h-4 text-[#D4AF37]" />
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]/55">
                      Final Result
                    </p>

                    {battle.victorId?.name && (
                      <p className="mt-1 font-serif text-lg text-[#D4AF37]">
                        {battle.victorId.name}
                      </p>
                    )}
                  </div>
                </div>

                <p className="max-w-4xl whitespace-pre-line text-lg md:text-xl leading-9 text-[#F0E7D0]">
                  {battle.outcome}
                </p>
              </div>
            </div>
          </Section>
        )}

        {/* ===================================================
            AFTERMATH
        =================================================== */}

        {battle.aftermath && (
          <Section
            title="Aftermath"
            eyebrow="What Followed"
            icon={
              <ScrollText className="w-4 h-4" />
            }
          >
            <NarrativeBlock
              text={battle.aftermath}
            />
          </Section>
        )}

        {/* ===================================================
            SIGNIFICANCE
        =================================================== */}

        {battle.significance && (
          <Section
            title="Historical Significance"
            eyebrow="Legacy of the Campaign"
            icon={
              <Landmark className="w-4 h-4" />
            }
          >
            <div className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/15 bg-gradient-to-br from-[#17120F] to-[#100E0C] p-8 md:p-10">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#D4AF37]/70 via-[#D4AF37]/20 to-transparent" />

              <div className="max-w-4xl space-y-6">
                {splitParagraphs(
                  battle.significance
                ).map(
                  (
                    paragraph,
                    index
                  ) => (
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
          </Section>
        )}

        {/* ===================================================
            RELATED ARCHIVES
        =================================================== */}

        {(hasRelatedEvents ||
          hasRelatedBattles ||
          hasRelatedHeroes ||
          hasRelatedPersonalities ||
          hasRelatedPlaces ||
          hasRelatedBooks) && (
          <Section
            title="Connected Archives"
            eyebrow="Explore Further"
            icon={
              <BookOpen className="w-4 h-4" />
            }
          >
            <div className="space-y-12">
              {hasRelatedEvents && (
                <div>
                  <ArchiveSubheading title="Related Historical Events" />

                  <ReferenceGrid
                    items={
                      refs?.relatedEvents
                    }
                    type="Historical Event"
                    hrefBuilder={(item) =>
                      item.eventId
                        ? `/events/${encodeURIComponent(
                            item.eventId
                          )}`
                        : undefined
                    }
                  />
                </div>
              )}

              {hasRelatedBattles && (
                <div>
                  <ArchiveSubheading title="Related Battles" />

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
                </div>
              )}

              {hasRelatedHeroes && (
                <div>
                  <ArchiveSubheading title="Related Heroes" />

                  <ReferenceGrid
                    items={
                      refs?.relatedHeroes
                    }
                    type="Hero"
                    hrefBuilder={(item) =>
                      item.heroId
                        ? `/heroes/${encodeURIComponent(
                            item.heroId
                          )}`
                        : undefined
                    }
                  />
                </div>
              )}

              {hasRelatedPersonalities && (
                <div>
                  <ArchiveSubheading title="Historical Personalities" />

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
                </div>
              )}

              {hasRelatedPlaces && (
                <div>
                  <ArchiveSubheading title="Related Places" />

                  <ReferenceGrid
                    items={
                      refs?.relatedPlaces
                    }
                    type="Place"
                    hrefBuilder={(item) =>
                      item.placeId
                        ? `/places/${encodeURIComponent(
                            item.placeId
                          )}`
                        : undefined
                    }
                  />
                </div>
              )}

              {hasRelatedBooks && (
                <div>
                  <ArchiveSubheading title="Books & Publications" />

                  <ReferenceGrid
                    items={
                      refs?.relatedBooks
                    }
                    type="Book"
                    hrefBuilder={(item) =>
                      item.bookId
                        ? `/books/${encodeURIComponent(
                            item.bookId
                          )}`
                        : undefined
                    }
                  />
                </div>
              )}
            </div>
          </Section>
        )}

        {/* ===================================================
            SOURCES
        =================================================== */}

        {hasSources && (
          <Section
            title="Sources"
            eyebrow="Historical Record"
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

        {/* ===================================================
            TAGS
        =================================================== */}

        {battle.tags &&
          battle.tags.length > 0 && (
            <section className="mt-20 pt-9 border-t border-[#D4AF37]/10">
              <div className="flex flex-wrap items-center justify-between gap-5 mb-6">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]/45 mb-2">
                    VeerBharat Classification
                  </p>

                  <h2 className="font-serif text-xl font-bold text-[#F8F5F0]">
                    Archive Tags
                  </h2>
                </div>

                <span className="text-[10px] tracking-[0.2em] text-[#A09682]">
                  {battle.battleId}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {battle.tags.map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-3.5 py-2 rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/5 text-xs text-[#D4AF37]/70 hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-colors"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </section>
          )}

        {/* ===================================================
            END OF RECORD
        =================================================== */}

        <div className="mt-24 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/15" />

          <div className="flex items-center gap-3 text-[#D4AF37]/40">
            <div className="w-1.5 h-1.5 rotate-45 border border-current" />

            <Swords className="w-4 h-4" />

            <div className="w-1.5 h-1.5 rotate-45 border border-current" />
          </div>

          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/15" />
        </div>

        <p className="mt-5 text-center text-[9px] uppercase tracking-[0.35em] text-[#A09682]/60">
          End of Battle Record · {battle.battleId}
        </p>
      </div>

      <Footer />
    </main>
  );
}

/* =========================================================
   SMALL SUBHEADING
========================================================= */

function ArchiveSubheading({
  title,
}: {
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <ChevronRight className="w-4 h-4 text-[#D4AF37]" />

      <h3 className="font-serif text-xl md:text-2xl font-bold text-[#F8F5F0]">
        {title}
      </h3>

      <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/15 to-transparent" />
    </div>
  );
}