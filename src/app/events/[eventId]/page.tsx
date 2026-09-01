"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

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
interface HeroReference {
  heroId: string;
  name: string;
}

interface HistoricalPersonalityReference {
  historicalPersonalityId: string;
  name: string;
}

interface ImageData {
  _id: string;
  imageId: string;

  title: string;
  url: string;

  altText?: string;
  imageType?: string;
  description?: string;
}

interface EventImage {
  _id: string;

  imageId: string;

  title: string;
  url: string;

  altText?: string;
  imageType?: string;
  description?: string;

  relatedSection?: string;
}

interface EventImageRelation {
  _id: string;

  imageId?: ImageData | ImageData[];

  relatedSection?: string;
}

interface LinkedEventReference {
  eventId: string;
  name: string;
}

interface HistoricalEvent {
  _id: string;
  eventId: string;
  linkedEventId?: LinkedEventReference | null;
  imageUrl?: string;
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

  relatedPeople?: string[];

  heroIds?: HeroReference[];
  historicalPersonalityIds?: HistoricalPersonalityReference[];

  imageIds?: EventImageRelation[];
}

interface HistoricalSubsection {
  title: string;
  content: string;
}

interface HistoricalSection {
  title: string;
  content: string;
  subsections: HistoricalSubsection[];
}

/* =====================================================
   LINK CANDIDATE TYPES
===================================================== */

interface HeroLinkCandidate {
  type: "hero";
  hero: HeroReference;
  name: string;
}

interface HistoricalPersonalityLinkCandidate {
  type: "historicalPersonality";
  person: HistoricalPersonalityReference;
  name: string;
}

type HistoricalLinkCandidate =
  | HeroLinkCandidate
  | HistoricalPersonalityLinkCandidate;

/* =====================================================
   PAGE
===================================================== */

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = params.eventId as string;

  const [event, setEvent] =
    useState<HistoricalEvent | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [heroes, setHeroes] =
  useState<HeroReference[]>([]);
  
  const [historicalPersonalities, setHistoricalPersonalities] =
  useState<HistoricalPersonalityReference[]>([]);

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

        /* =====================================================
          LINKED EVENT REDIRECT
        ===================================================== */

        if (
          eventData.linkedEventId &&
          eventData.linkedEventId.eventId &&
          eventData.linkedEventId.eventId !== eventData.eventId
        ) {
          router.replace(
            `/events/${encodeURIComponent(
              eventData.linkedEventId.eventId
            )}`
          );

          return;
        }

        setEvent(eventData);
        console.log(
          "EVENT HERO REFERENCES:",
          eventData.heroIds
        );

        setHeroes(
          Array.isArray(eventData.heroIds)
            ? eventData.heroIds.filter(
                (hero: HeroReference) =>
                  Boolean(
                    hero?.heroId &&
                    hero?.name
                  )
              )
            : []
        );

        setHistoricalPersonalities(
          Array.isArray(eventData.historicalPersonalityIds)
            ? eventData.historicalPersonalityIds.filter(
                (person: HistoricalPersonalityReference) =>
                  Boolean(
                    person?.historicalPersonalityId &&
                    person?.name
                  )
              )
            : []
        );
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
  }, [eventId, router]);



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
      .flatMap((relation) => {
        if (
          !relation ||
          typeof relation !== "object" ||
          !relation.imageId
        ) {
          return [];
        }

        const imageList = Array.isArray(
          relation.imageId
        )
          ? relation.imageId
          : [relation.imageId];

        return imageList
          .filter(
            (image): image is ImageData =>
              image !== null &&
              typeof image === "object" &&
              Boolean(image.url)
          )
          .map((image) => ({
            _id:
              relation._id ||
              image._id,

            imageId:
              image.imageId,

            title:
              image.title,

            url:
              image.url,

            altText:
              image.altText,

            imageType:
              image.imageType,

            description:
              image.description,

            relatedSection:
              relation.relatedSection ?? "",
          }));
      });
      
  /* =====================================================
    HERO IMAGE
  ===================================================== */

  const heroImageUrl =
    event.imageUrl || null;


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
          â†“
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

              <div
              className={`
                mt-10
                max-w-5xl
                mx-auto
                ${
                  heroImageUrl
                    ? "grid md:grid-cols-[1fr_1fr] lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center text-left"
                    : ""
                }
              `}
            >
              <div>

                {event.shortDescription && (
                  <p className="text-[#D7C9A5] text-base md:text-lg leading-8 md:leading-9">
                    {event.shortDescription}
                  </p>
                )}

              </div>

              {heroImageUrl && (
                <div className="relative w-full max-w-[520px] mx-auto">

                  {/* SOFT GOLDEN GLOW */}

                  <div className="absolute -inset-6 rounded-[2rem] bg-[#D4AF37]/10 blur-3xl" />

                  {/* OUTER HISTORICAL FRAME */}

                  <div className="relative p-2 rounded-2xl border border-[#D4AF37]/30 bg-[#17130F] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

                    {/* INNER GOLD BORDER */}

                    <div className="relative overflow-hidden rounded-xl border border-[#D4AF37]/20 bg-[#120F0C]">

                      {/* IMAGE */}

                      <div className="relative aspect-[5/4] overflow-hidden">

                        <Image
                          src={heroImageUrl}
                          alt={event.name}
                          fill
                          priority
                          sizes="(max-width: 768px) 100vw, 520px"
                          className="object-cover transition-transform duration-700 hover:scale-105"
                        />

                        {/* VIGNETTE */}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/35 via-transparent to-[#D4AF37]/5 pointer-events-none" />

                      </div>
                    </div>

                    {/* TOP LEFT CORNER */}

                    <div className="absolute top-3 left-3 w-7 h-7 border-t border-l border-[#D4AF37]/50 rounded-tl-md pointer-events-none" />

                    {/* TOP RIGHT CORNER */}

                    <div className="absolute top-3 right-3 w-7 h-7 border-t border-r border-[#D4AF37]/50 rounded-tr-md pointer-events-none" />

                    {/* BOTTOM LEFT CORNER */}

                    <div className="absolute bottom-3 left-3 w-7 h-7 border-b border-l border-[#D4AF37]/50 rounded-bl-md pointer-events-none" />

                    {/* BOTTOM RIGHT CORNER */}

                    <div className="absolute bottom-3 right-3 w-7 h-7 border-b border-r border-[#D4AF37]/50 rounded-br-md pointer-events-none" />

                  </div>

                </div>
              )}

            </div>

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
                heroes={heroes}
                historicalPersonalities={historicalPersonalities}
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
                    heroes={heroes}
                    historicalPersonalities={historicalPersonalities}
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
                  <HistoricalArticleSection
                    key={`${section.title}-${index}`}
                    title={section.title}
                    content={section.content}
                    images={sectionImages}
                    index={index}
                    subsections={section.subsections}
                    allImages={images}
                    heroes={heroes}
                    historicalPersonalities={historicalPersonalities}
                  />
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
                   heroes={heroes}
                   historicalPersonalities={historicalPersonalities}
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

function HistoricalArticleSection({
  title,
  content,
  images,
  index,
  subsections,
  allImages,
  heroes,
  historicalPersonalities,
}: {
  title: string;
  content: string;
  images: EventImage[];
  index: number;
  subsections: HistoricalSubsection[];
  allImages: EventImage[];
  heroes: HeroReference[];
  historicalPersonalities: HistoricalPersonalityReference[];
}) {
  const imageOnLeft = index % 2 !== 0;
  const getSubsectionImages = (
    subsectionTitle: string
  ): EventImage[] => {
    return allImages.filter(
      (image) =>
        normalizeText(
          image.relatedSection || ""
        ) ===
        normalizeText(subsectionTitle)
    );
  };
  return (
    <article className="relative">
      
      {/* =============================================
          HISTORICAL CHAPTER
      ============================================= */}

      <div className="relative">

        {/* TIMELINE SPINE */}

        <div className="hidden lg:block absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37]/40 via-[#D4AF37]/15 to-transparent" />

        {/* CHAPTER NUMBER */}

        <div className="relative flex items-start gap-6">

          <div className="hidden lg:flex relative z-10 w-12 h-12 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#0F0F0F] shadow-[0_0_30px_rgba(212,175,55,0.08)]">

            <span className="text-sm font-serif font-bold text-[#D4AF37]">
              {String(index + 1).padStart(2, "0")}
            </span>

          </div>

          {/* CHAPTER CARD */}

          <div className="flex-1 min-w-0 rounded-2xl border border-[#D4AF37]/15 bg-gradient-to-br from-[#17130F] to-[#120F0C] p-6 md:p-10 shadow-[0_15px_50px_rgba(0,0,0,0.25)]">

      {/* SECTION HEADER */}

      <div className="mb-8">

        <div className="flex items-center gap-3 mb-4">

        <div className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/5">
          <ScrollText className="w-4 h-4 text-[#D4AF37]" />
        </div>

        <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/60">
          Chapter {String(index + 1).padStart(2, "0")}
        </p>

      </div>

      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#F8F5F0] leading-tight">
          {title}
      </h2>

        <div className="mt-5 flex items-center gap-3">

        <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/40 to-[#D4AF37]/5" />

        <span className="text-[#D4AF37]/50 text-xs">
          ✦
        </span>

        <div className="h-px w-16 bg-[#D4AF37]/10" />

      </div>

      </div>

      {/* SECTION CONTENT */}

      {images.length === 0 ? (

        content && (
          <HistoricalContent
            content={content}
             heroes={heroes}
             historicalPersonalities={historicalPersonalities}
          />
        )

      ) : (

        <div className="flow-root mt-2">

          <aside
            className={`
              w-full
              mb-6

              lg:w-[300px]
              xl:w-[340px]

              ${
                imageOnLeft
                  ? "lg:float-left lg:mr-8"
                  : "lg:float-right lg:ml-8"
              }

              space-y-5
            `}
          >
            {images.map(
              (image, imageIndex) => (
                <RelatedImage
                  key={`${image._id}-${imageIndex}`}
                  image={image}
                />
              )
            )}
          </aside>

          {content && (
            <HistoricalContent
              content={content}
               heroes={heroes}
               historicalPersonalities={historicalPersonalities}
            />
          )}

        </div>

      )}

      {/* =============================================
          SUBSECTIONS
      ============================================= */}

            {subsections.length > 0 && (
              <div className="mt-10 space-y-8">

                {subsections.map(
                  (subsection, subsectionIndex) => {
                    const subsectionImages =
                      getSubsectionImages(
                        subsection.title
                      );

                    return (
                      <article
                        key={`${subsection.title}-${subsectionIndex}`}
                        className="relative rounded-xl border border-[#D4AF37]/15 bg-[#0F0F0F]/70 p-6 md:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.2)]"
                      >

                        <div className="mb-6">

                          <div className="flex items-center gap-3 mb-3">

                            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D4AF37]/25 text-xs text-[#D4AF37]">
                              {subsectionIndex + 1}
                            </span>

                            <p className="text-xs uppercase tracking-[0.22em] text-[#D4AF37]/60">
                              {title}
                            </p>

                          </div>

                          <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#F8F5F0]">
                            {subsection.title}
                          </h3>

                          <div className="mt-4 h-px w-full bg-gradient-to-r from-[#D4AF37]/25 via-[#D4AF37]/10 to-transparent" />

                        </div>

                        {subsectionImages.length === 0 ? (

                          <HistoricalContent
                            content={subsection.content}
                             heroes={heroes}
                             historicalPersonalities={historicalPersonalities}
                          />

                        ) : (

                          <div className="flow-root">

                            <aside
                              className={`
                                w-full
                                mb-6
                                lg:w-[280px]
                                ${
                                  subsectionIndex % 2 === 0
                                    ? "lg:float-right lg:ml-8"
                                    : "lg:float-left lg:mr-8"
                                }
                                space-y-5
                              `}
                            >
                              {subsectionImages.map(
                                (image, imageIndex) => (
                                  <RelatedImage
                                    key={`${image._id}-${imageIndex}`}
                                    image={image}
                                  />
                                )
                              )}
                            </aside>

                            <HistoricalContent
                              content={subsection.content}
                              heroes={heroes}
                              historicalPersonalities={historicalPersonalities}
                            />

                          </div>

                        )}

                      </article>
                    );
                  }
                )}

              </div>
            )}

                  </div>
                  {/* END CHAPTER CARD */}

                </div>
                {/* END CHAPTER */}

              </div>
              {/* END TIMELINE WRAPPER */}

            </article>
          );
      }


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

      <div className="relative w-full bg-[#17130F]">
        <Image
          src={image.url}
          alt={
            image.altText ||
            image.title
          }
          width={800}
          height={800}
          sizes="(max-width: 1024px) 100vw, 360px"
          className="w-full h-auto object-contain"
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
  heroes,
  historicalPersonalities,
}: {
  content: string;
  heroes: HeroReference[];
  historicalPersonalities: HistoricalPersonalityReference[];
}) {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="space-y-7">
      {paragraphs.map(
        (paragraph, index) => (
          <p
            key={index}
            className="text-[#D7C9A5] leading-8"
          >
            <LinkedHistoricalText
              text={paragraph}
              heroes={heroes}
              historicalPersonalities={historicalPersonalities}
            />
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
  const lines = content.split("\n");

  const sections: HistoricalSection[] = [];

  let currentSection:
    | HistoricalSection
    | null = null;

  let currentSubsection:
    | HistoricalSubsection
    | null = null;

  let currentContent: string[] = [];

  function saveCurrentContent() {
    const cleanedContent =
      currentContent
        .join("\n")
        .trim();

    if (!cleanedContent) {
      currentContent = [];
      return;
    }

    if (currentSubsection) {
      currentSubsection.content =
        cleanedContent;

      currentSection?.subsections.push(
        currentSubsection
      );

      currentSubsection = null;
    } else if (currentSection) {
      currentSection.content =
        cleanedContent;
    }

    currentContent = [];
  }

  function saveSection() {
    if (!currentSection) {
      return;
    }

    saveCurrentContent();

    sections.push(
      currentSection
    );

    currentSection = null;
  }

  lines.forEach((line) => {
    const trimmed = line.trim();

    const mainHeadingMatch =
      trimmed.match(
        /^##\s+(.+)$/
      );

    const subHeadingMatch =
      trimmed.match(
        /^###\s+(.+)$/
      );

    /* ===============================
       MAIN SECTION
       ##
    =============================== */

    if (mainHeadingMatch) {
      saveSection();

      currentSection = {
        title:
          mainHeadingMatch[1].trim(),
        content: "",
        subsections: [],
      };

      return;
    }

    /* ===============================
       SUBSECTION
       ###
    =============================== */

    if (
      subHeadingMatch &&
      currentSection
    ) {
      saveCurrentContent();

      currentSubsection = {
        title:
          subHeadingMatch[1].trim(),
        content: "",
      };

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
  heroes,
  historicalPersonalities,
}: {
  content: string;
  heroes: HeroReference[];
  historicalPersonalities: HistoricalPersonalityReference[];
}) {
  const blocks =
    parseContentBlocks(content);

  return (
    <div className="text-[#D7C9A5]">
      {blocks.map(
        (block, index) => {
          if (
            block.type ===
            "paragraph"
          ) {
            return (
              <p
                key={index}
                className="leading-8 mb-7"
              >
                <LinkedHistoricalText
                  text={block.text}
                  heroes={heroes}
                  historicalPersonalities={historicalPersonalities}
                />
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
                        <LinkedHistoricalText
                          text={item}
                          heroes={heroes}
                          historicalPersonalities={historicalPersonalities}
                        />
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
                        <LinkedHistoricalText
                          text={item}
                          heroes={heroes}
                          historicalPersonalities={historicalPersonalities}
                        />
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
   HISTORICAL TEXT
===================================================== */

function LinkedHistoricalText({
  text,
  heroes,
  historicalPersonalities,
}: {
  text: string;
  heroes: HeroReference[];
  historicalPersonalities: HistoricalPersonalityReference[];
}) {
  if (
    !text ||
    (heroes.length === 0 &&
      historicalPersonalities.length === 0)
  ) {
    return <>{text}</>;
  }

  const escapeRegExp = (value: string) =>
    value.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

  const heroCandidates: HeroLinkCandidate[] = heroes
    .filter(
      (hero) =>
        typeof hero?.heroId === "string" &&
        hero.heroId.trim() !== "" &&
        typeof hero?.name === "string" &&
        hero.name.trim() !== ""
    )
    .flatMap((hero) => {
      const fullName = hero.name.trim();

      /*
        Remove common ranks/titles from the beginning
        of the name.
      */
      const personalName = fullName
        .replace(
          /^(Field Marshal|General|Lieutenant General|Major General|Brigadier|Colonel|Lieutenant Colonel|Major|Captain|Commander|Lieutenant|Subedar Major|Subedar|Naik|Havildar|Mahatma|Pandit|Dr\.?|Sir)\s+/i,
          ""
        )
        .trim();

      const candidates: HeroLinkCandidate[] = [
        {
          type: "hero",
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
          type: "hero",
          hero,
          name: personalName,
        });
      }

      return candidates;
    })
    .sort(
      (a, b) =>
        b.name.length - a.name.length
    );

  const historicalPersonalityCandidates: HistoricalPersonalityLinkCandidate[] =
    historicalPersonalities
      .filter(
        (person) =>
          typeof person?.historicalPersonalityId === "string" &&
          person.historicalPersonalityId.trim() !== "" &&
          typeof person?.name === "string" &&
          person.name.trim() !== ""
      )
      .flatMap((person) => {
        const fullName = person.name.trim();

        return [
          {
            type: "historicalPersonality" as const,
            person,
            name: fullName,
          },
        ];
      })
      .sort(
        (a, b) =>
          b.name.length - a.name.length
      );

  const candidates: HistoricalLinkCandidate[] = [
    ...heroCandidates,
    ...historicalPersonalityCandidates,
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

          return (
            <Link
              key={`person-${candidate.person.historicalPersonalityId}-${index}`}
              href={`/historical-personalities/${encodeURIComponent(
                candidate.person.historicalPersonalityId
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

  // Ignore Markdown horizontal rules such as ---
  if (/^-{3,}$/.test(trimmed)) {
    saveParagraph();
    saveBullets();
    saveNumbered();

    return;
  }

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