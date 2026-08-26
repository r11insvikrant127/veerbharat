"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  Calendar,
  Landmark,
  ScrollText,
  Sword,
  Shield,
  MapPin,
  BookOpen,
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/* =====================================================
   TYPES
===================================================== */

interface ImageData {
  _id: string;
  imageId?: string;

  title: string;
  url: string;

  altText?: string;
  imageType?: string;
  description?: string;
}


/*
  This is the shape actually used by the frontend
  after flattening the EventImageRelation.
*/

interface EventImage extends ImageData {
  relatedSection?: string;
}

interface EventImageRelation extends ImageData {
  relatedSection?: string;
}

interface HistoricalEvent {
    _id: string;
    eventId: string;

    name: string;
    nativeName?: string;

    eventDate: string | null;
    eventDateAccuracy?: string;

    description: string;
    shortDescription?: string;
    details?: string;
    significance?: string;

    type?: string;
    tags?: string[];

    imageIds?: EventImageRelation[];
  }

interface HistoricalSection {
  title: string;
  content: string;
}

/* =====================================================
   PAGE
===================================================== */

export default function EventDetailsPage() {
  const params = useParams();

  const eventId = params.eventId as string;

  const [event, setEvent] =
    useState<HistoricalEvent | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =====================================================
     FETCH EVENT
  ===================================================== */

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/events/${eventId}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Event not found."
          );
        }

        const eventData =
          result.data ?? result;
        console.log(
          "EVENT API DATA:",
          eventData
        );

        setEvent(eventData);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load this event."
        );
      } finally {
        setLoading(false);
      }
    }

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  /* =====================================================
     LOADING
  ===================================================== */

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

  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !event) {
    return (
      <main className="min-h-screen bg-[#0F0F0F] text-[#F8F5F0]">
        <Navbar />

        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-lg w-full text-center section-card-hover p-10">
            <Shield className="w-12 h-12 mx-auto text-[#D4AF37]/60 mb-6" />

            <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]/60 mb-3">
              Historical Record
            </p>

            <h1 className="font-serif text-3xl font-bold mb-4">
              Event Not Found
            </h1>

            <p className="text-[#A09682] mb-8">
              {error ||
                "The requested historical record could not be found."}
            </p>

            <Link
              href="/events"
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

  /* =====================================================
     PREPARE EVENT DATA
  ===================================================== */

  const year = event.eventDate
    ? new Date(
        event.eventDate
      ).getFullYear()
    : null;

  /*
    Convert:

    {
      relatedSection: "The Wagon Tragedy",
      imageId: {
        title: "Wagon Tragedy",
        url: "..."
      }
    }

    INTO:

    {
      title: "Wagon Tragedy",
      url: "...",
      relatedSection: "The Wagon Tragedy"
    }

    This keeps the rendering code simple.
  */

  const images: EventImage[] =
    (event.imageIds ?? [])
      .filter(
        (image): image is EventImageRelation =>
          image !== null &&
          typeof image === "object" &&
          Boolean(image.url)
      )
      .map((image) => ({
        ...image,
        relatedSection:
          image.relatedSection ?? "",
      }));
      
  const sections = event.details
    ? parseHistoricalSections(
        event.details
      )
    : [];

  /*
    IMPORTANT:

    No hardcoding.

    Every image is matched dynamically:

    relatedSection
          ↓
    section title
  */

  function getSectionImages(
    sectionTitle: string
  ): EventImage[] {
    return images.filter(
      (
        image
      ): image is EventImage =>
        image !== null &&
        normalizeText(
          image.relatedSection || ""
        ) ===
          normalizeText(sectionTitle)
    );
  }

  const galleryImages = images.filter(
    (
      image
    ): image is EventImage =>
      image !== null &&
      (
        !image.relatedSection ||
        image.relatedSection.trim() === ""
      )
  );
  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F8F5F0]">
      <Navbar />

      {/* =====================================================
          EVENT HEADER
      ===================================================== */}

      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[#D4AF37]/5 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-[#A09682] hover:text-[#D4AF37] transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />

            Back to Historical Events
          </Link>

          <div className="max-w-6xl mx-auto">
            <div className="text-center">

              <div className="flex flex-wrap items-center justify-center gap-4">
                {event.type && (
                  <span className="px-4 py-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-xs uppercase tracking-[0.2em] text-[#D7C9A5]">
                    {event.type}
                  </span>
                )}

                {year && (
                  <div className="flex items-center gap-2 text-sm text-[#A09682]">
                    <Calendar className="w-4 h-4 text-[#D4AF37]" />

                    {year}
                  </div>
                )}
              </div>

              <h1 className="mt-7 font-serif text-5xl md:text-7xl font-bold text-gold-gradient">
                {event.name}
              </h1>

              {event.nativeName && (
                <p className="mt-4 text-lg text-[#A09682]">
                  {event.nativeName}
                </p>
              )}

              <div className="flex items-center justify-center gap-4 mt-7">
                <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#D4AF37]/40" />

                <span className="text-[#D4AF37]/40">
                  ✦ ✦ ✦
                </span>

                <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
              </div>

              {event.shortDescription && (
                <p className="max-w-2xl mt-7 mx-auto text-[#D7C9A5] leading-relaxed">
                  {event.shortDescription}
                </p>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="section-dark pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* EVENT OVERVIEW */}

            <HistoricalCard
              eyebrow="Historical Overview"
              title="The Event"
              icon={
                <Landmark className="w-5 h-5 text-[#D4AF37]" />
              }
            >
              <OverviewContent
                content={event.description}
              />
            </HistoricalCard>

            {/* DETAILS WITHOUT HEADINGS */}

            {event.details &&
              sections.length === 0 && (
                <HistoricalCard
                  eyebrow="Detailed Historical Record"
                  title="What Happened"
                  icon={
                    <ScrollText className="w-5 h-5 text-[#D4AF37]" />
                  }
                >
                  <HistoricalContent
                    content={event.details}
                  />
                </HistoricalCard>
              )}

            {/* EVERY SECTION */}

            {sections.map(
              (section, index) => {
                const sectionImages =
                  getSectionImages(
                    section.title
                  );

                return (
                  <SectionWithImages
                    key={`${section.title}-${index}`}
                    images={sectionImages}
                  >
                    <HistoricalCard
                      eyebrow={
                        index === 0
                          ? "Detailed Historical Record"
                          : "Historical Record"
                      }
                      title={section.title}
                      icon={
                        <ScrollText className="w-5 h-5 text-[#D4AF37]" />
                      }
                    >
                      <HistoricalContent
                        content={
                          section.content
                        }
                      />
                    </HistoricalCard>
                  </SectionWithImages>
                );
              }
            )}

            {/* SIGNIFICANCE */}

            {event.significance && (
              <HistoricalCard
                eyebrow="Historical Significance"
                title="Why This Event Matters"
                icon={
                  <Landmark className="w-5 h-5 text-[#D4AF37]" />
                }
              >
                <HistoricalContent
                  content={
                    event.significance
                  }
                />
              </HistoricalCard>
            )}

            {/* UNASSIGNED IMAGES */}

            {galleryImages.length > 0 && (
              <HistoricalCard
                eyebrow="Historical Visual Record"
                title="Images & Artefacts"
                icon={
                  <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                }
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {galleryImages.map(
                    (image) => (
                      <ImageCard
                        key={image._id}
                        image={image}
                      />
                    )
                  )}
                </div>
              </HistoricalCard>
            )}

            {/* TAGS */}

            {event.tags &&
              event.tags.length > 0 && (
                <HistoricalCard
                  eyebrow="Related History"
                  title="Explore Further"
                  icon={
                    <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  }
                >
                  <div className="flex flex-wrap gap-3">
                    {event.tags.map(
                      (tag) => (
                        <span
                          key={tag}
                          className="px-4 py-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-sm text-[#D7C9A5]"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </HistoricalCard>
              )}

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* =====================================================
   SECTION WITH IMAGES
===================================================== */

function SectionWithImages({
  images,
  children,
}: {
  images: EventImage[];
  children: ReactNode;
}) {
  if (images.length === 0) {
    return <div>{children}</div>;
  }

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:gap-8 items-start">

      <div className="min-w-0">
        {children}
      </div>

      <div className="space-y-6">
        {images.map(
          (image, index) => (
            <RelatedImage
              key={`${image._id}-${index}`}
              image={image}
            />
          )
        )}
      </div>

    </div>
  );
}

/* =====================================================
   HISTORICAL CARD
===================================================== */

function HistoricalCard({
  eyebrow,
  title,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="section-card-hover p-8 md:p-10">

      <div className="flex items-start gap-3 mb-8">

        <div className="mt-1 shrink-0">
          {icon}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/60 mb-3">
            {eyebrow}
          </p>

          <h2 className="font-serif text-3xl font-bold">
            {title}
          </h2>
        </div>

      </div>

      {children}

    </article>
  );
}

/* =====================================================
   RELATED IMAGE
===================================================== */

function RelatedImage({
  image,
}: {
  image: EventImage;
}) {
  return (
    <article className="section-card-hover overflow-hidden">

      <div className="relative aspect-[4/3] bg-[#17130F]">
        <Image
          src={image.url}
          alt={
            image.altText ||
            image.title
          }
          fill
          sizes="(max-width: 1024px) 100vw, 360px"
          className="object-cover"
        />
      </div>

      <div className="p-6">

        <h3 className="font-serif text-xl font-bold">
          {image.title}
        </h3>

        {image.imageType && (
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#D4AF37]/60">
            {image.imageType}
          </p>
        )}

        {image.description && (
          <p className="mt-4 text-sm leading-7 text-[#A09682]">
            {image.description}
          </p>
        )}

      </div>
    </article>
  );
}

/* =====================================================
   GALLERY IMAGE
===================================================== */

function ImageCard({
  image,
}: {
  image: EventImage;
}) {
  return (
    <article className="group overflow-hidden rounded-xl border border-[#D4AF37]/15 bg-[#120F0C]">

      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image.url}
          alt={
            image.altText ||
            image.title
          }
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-6">

        <h3 className="font-serif text-xl font-bold">
          {image.title}
        </h3>

        {image.imageType && (
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#D4AF37]/60">
            {image.imageType}
          </p>
        )}

        {image.description && (
          <p className="mt-4 text-sm leading-7 text-[#A09682]">
            {image.description}
          </p>
        )}

      </div>
    </article>
  );
}

/* =====================================================
   EVENT OVERVIEW
===================================================== */

function OverviewContent({
  content,
}: {
  content: string;
}) {
  const points = content
    .split(/(?<=[.!?])\s+/)
    .map(
      (point) =>
        point.trim()
    )
    .filter(Boolean);

  return (
    <div className="space-y-7">
      {points.map(
        (point, index) => (
          <p
            key={index}
            className="text-[#D7C9A5] leading-8"
          >
            {point}
          </p>
        )
      )}
    </div>
  );
}

/* =====================================================
   PARSE HISTORICAL SECTIONS
===================================================== */

function parseHistoricalSections(
  content: string
): HistoricalSection[] {
  const lines =
    content.split("\n");

  const sections:
    HistoricalSection[] = [];

  let currentTitle =
    "What Happened";

  let currentContent:
    string[] = [];

  function saveSection() {
    const cleanedContent =
      currentContent
        .join("\n")
        .trim();

    if (cleanedContent) {
      sections.push({
        title: currentTitle,
        content: cleanedContent,
      });
    }
  }

  lines.forEach((line) => {
    const trimmed =
      line.trim();

    const headingMatch =
      trimmed.match(
        /^(#{2,3})\s+(.+)$/
      );

    if (headingMatch) {
      saveSection();

      currentTitle =
        headingMatch[2].trim();

      currentContent = [];

      return;
    }

    currentContent.push(line);
  });

  saveSection();

  return sections;
}

/* =====================================================
   HISTORICAL CONTENT
===================================================== */

function HistoricalContent({
  content,
}: {
  content: string;
}) {
  const blocks =
    parseContentBlocks(content);

  return (
    <div className="space-y-7 text-[#D7C9A5]">
      {blocks.map(
        (block, index) => {
          if (
            block.type ===
            "paragraph"
          ) {
            return (
              <p
                key={index}
                className="leading-8"
              >
                {block.text}
              </p>
            );
          }

          if (
            block.type ===
            "bullets"
          ) {
            const items =
              block.items ?? [];

            return (
              <ul
                key={index}
                className="space-y-4"
              >
                {items.map(
                  (
                    item,
                    itemIndex
                  ) => (
                    <li
                      key={itemIndex}
                      className="flex gap-4"
                    >
                      <Sword className="w-4 h-4 shrink-0 mt-2 text-[#D4AF37]" />

                      <span className="leading-8">
                        {item}
                      </span>
                    </li>
                  )
                )}
              </ul>
            );
          }

          if (
            block.type ===
            "numbered"
          ) {
            const items =
              block.items ?? [];

            return (
              <ol
                key={index}
                className="space-y-4"
              >
                {items.map(
                  (
                    item,
                    itemIndex
                  ) => (
                    <li
                      key={itemIndex}
                      className="flex gap-4"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/30 text-xs text-[#D4AF37]">
                        {itemIndex + 1}
                      </span>

                      <span className="leading-8">
                        {item}
                      </span>
                    </li>
                  )
                )}
              </ol>
            );
          }

          return null;
        }
      )}
    </div>
  );
}

/* =====================================================
   CONTENT BLOCK TYPES
===================================================== */

type ContentBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "bullets";
      items: string[];
    }
  | {
      type: "numbered";
      items: string[];
    };

/* =====================================================
   CONTENT BLOCK PARSER
===================================================== */

function parseContentBlocks(
  content: string
): ContentBlock[] {
  const lines =
    content.split("\n");

  const blocks:
    ContentBlock[] = [];

  let paragraph:
    string[] = [];

  let bullets:
    string[] = [];

  let numbered:
    string[] = [];

  function saveParagraph() {
    if (
      paragraph.length > 0
    ) {
      const text =
        paragraph
          .join(" ")
          .replace(
            /\s+/g,
            " "
          )
          .trim();

      if (text) {
        blocks.push({
          type: "paragraph",
          text,
        });
      }

      paragraph = [];
    }
  }

  function saveBullets() {
    if (
      bullets.length > 0
    ) {
      blocks.push({
        type: "bullets",
        items: bullets,
      });

      bullets = [];
    }
  }

  function saveNumbered() {
    if (
      numbered.length > 0
    ) {
      blocks.push({
        type: "numbered",
        items: numbered,
      });

      numbered = [];
    }
  }

  lines.forEach((line) => {
    const trimmed =
      line.trim();

    if (!trimmed) {
      saveParagraph();
      saveBullets();
      saveNumbered();

      return;
    }

    if (
      /^[-*]\s+/.test(
        trimmed
      )
    ) {
      saveParagraph();
      saveNumbered();

      bullets.push(
        trimmed.replace(
          /^[-*]\s+/,
          ""
        )
      );

      return;
    }

    if (
      /^\d+\.\s+/.test(
        trimmed
      )
    ) {
      saveParagraph();
      saveBullets();

      numbered.push(
        trimmed.replace(
          /^\d+\.\s+/,
          ""
        )
      );

      return;
    }

    saveBullets();
    saveNumbered();

    paragraph.push(trimmed);
  });

  saveParagraph();
  saveBullets();
  saveNumbered();

  return blocks;
}

/* =====================================================
   NORMALIZE TEXT
===================================================== */

function normalizeText(
  value: string
): string {
  return value
    .toLowerCase()
    .replace(
      /[^a-z0-9\s]/g,
      " "
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
}