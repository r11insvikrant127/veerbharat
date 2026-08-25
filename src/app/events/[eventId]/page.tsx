'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import {
  ArrowLeft,
  Calendar,
  Landmark,
  Users,
  ScrollText,
  Sword,
  Shield,
  MapPin,
  BookOpen,
  ChevronRight,
} from 'lucide-react';


interface EventImage {
  _id: string;
  imageId: string;
  title: string;
  url: string;
  altText: string;
  imageType?: string;
  description?: string;
}


interface HistoricalEvent {
  _id: string;
  eventId: string;
  name: string;
  nativeName?: string;
  eventDate: string | null;
  eventDateAccuracy: string;

  description: string;
  shortDescription?: string;
  details?: string;
  significance?: string;

  type?: string;
  tags?: string[];

  imageIds?: EventImage[];
}


export default function EventDetailsPage() {

  const params = useParams();

  const eventId =
    params.eventId as string;


  const [event, setEvent] =
    useState<HistoricalEvent | null>(
      null
    );


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState(false);


  useEffect(() => {

    async function fetchEvent() {

      try {

        const response =
          await fetch(
            `/api/events/${eventId}`
          );


        if (!response.ok) {

          throw new Error(
            'Event not found'
          );

        }


        const data =
          await response.json();


        setEvent(data);

      } catch (error) {

        console.error(
          'Failed to load event:',
          error
        );


        setError(true);

      } finally {

        setLoading(false);

      }

    }


    if (eventId) {

      fetchEvent();

    }

  }, [eventId]);


  if (loading) {

    return (

      <main className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">

        <p className="text-[#D7C9A5]">

          Opening the pages of history...

        </p>

      </main>

    );

  }


  if (error || !event) {

    return (

      <main className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center px-4">

        <h1 className="text-3xl font-serif text-[#F8F5F0] mb-4">

          Event Not Found

        </h1>


        <Link
          href="/"
          className="text-[#D4AF37]"
        >

          Return Home

        </Link>

      </main>

    );

  }


  const year =
    event.eventDate
      ? new Date(
          event.eventDate
        ).getFullYear()
      : null;


  const images =
    event.imageIds || [];


  const mainImage =
    images[0];


  return (

    <main className="min-h-screen bg-[#0F0F0F] text-[#F8F5F0]">


      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-[#D4AF37]/10">

        <div className="absolute inset-0 bg-gradient-to-br from-[#21170F] via-[#0F0F0F] to-[#17110D]" />


        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">


          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#E6C45A] mb-12 transition-colors"
          >

            <ArrowLeft className="w-4 h-4" />

            Back to History

          </Link>


          <div className="max-w-4xl">


            <div className="flex flex-wrap items-center gap-3 mb-6">


              {event.type && (

                <span className="px-4 py-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-xs tracking-[0.18em] uppercase text-[#D4AF37]">

                  {event.type}

                </span>

              )}


              {year && (

                <span className="flex items-center gap-2 text-sm text-[#AFA28A]">

                  <Calendar className="w-4 h-4 text-[#D4AF37]" />

                  {year}

                </span>

              )}

            </div>


            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight">

              {event.name}

            </h1>


            {event.nativeName && (

              <p className="text-xl md:text-2xl text-[#AFA28A] mt-5">

                {event.nativeName}

              </p>

            )}


            {event.shortDescription && (

              <p className="mt-8 max-w-3xl text-lg md:text-xl leading-relaxed text-[#D7C9A5]">

                {event.shortDescription}

              </p>

            )}

          </div>

        </div>

      </section>



      {/* =====================================================
          MAIN EVENT IMAGE
      ===================================================== */}

      {mainImage && (

        <section className="max-w-6xl mx-auto px-6 pt-16">

          <div className="relative w-full overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-[#17130F]">

            <div className="relative aspect-[16/8] md:aspect-[16/7]">

              <Image
                src={mainImage.url}
                alt={mainImage.altText}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1152px"
                className="object-cover"
              />

            </div>


            <div className="border-t border-[#D4AF37]/10 px-6 py-5">

              <p className="font-serif text-lg text-[#F8F5F0]">

                {mainImage.title}

              </p>


              {mainImage.description && (

                <p className="text-sm text-[#AFA28A] mt-2">

                  {mainImage.description}

                </p>

              )}

            </div>

          </div>

        </section>

      )}



      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="max-w-6xl mx-auto px-6 py-20 space-y-12">


        {/* EVENT OVERVIEW */}

        <EventCard
          eyebrow="Historical Overview"
          title="The Event"
          icon={
            <Landmark className="w-6 h-6 text-[#D4AF37]" />
          }
        >

          <p className="text-[#D7C9A5] text-lg leading-8">

            {event.description}

          </p>

        </EventCard>



        {/* WHAT HAPPENED */}

        {event.details && (

          <EventCard
            eyebrow="Detailed Historical Record"
            title="What Happened"
            icon={
              <ScrollText className="w-6 h-6 text-[#D4AF37]" />
            }
          >

            <HistoricalContent
              content={event.details}
            />

          </EventCard>

        )}



        {/* LEADERS */}

        {images.some(
          (image) =>
            image.imageId === "IMG_MOPLAH_002" ||
            image.imageId === "IMG_MOPLAH_003"
        ) && (

          <EventCard
            eyebrow="Key Figures"
            title="Leaders of the Rebellion"
            icon={
              <Users className="w-6 h-6 text-[#D4AF37]" />
            }
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {images
                .filter(
                  (image) =>
                    image.imageId === "IMG_MOPLAH_002" ||
                    image.imageId === "IMG_MOPLAH_003"
                )
                .map(
                  (image) => (

                    <LeaderCard
                      key={image._id}
                      image={image}
                    />

                  )
                )}

            </div>

          </EventCard>

        )}



        {/* IMAGE GALLERY */}

        {images.length > 1 && (

          <EventCard
            eyebrow="Historical Visual Record"
            title="Images & Artefacts"
            icon={
              <BookOpen className="w-6 h-6 text-[#D4AF37]" />
            }
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


              {images
                .filter(
                  (image) =>
                    !image.title
                      .toLowerCase()
                      .includes('ali mus') &&
                    !image.title
                      .toLowerCase()
                      .includes('variyam')
                )
                .map(
                  (image) => (

                    <ImageCard
                      key={image._id}
                      image={image}
                    />

                  )
                )}

            </div>

          </EventCard>

        )}



        {/* HISTORICAL SIGNIFICANCE */}

        {event.significance && (

          <EventCard
            eyebrow="Historical Significance"
            title="Why This Event Matters"
            icon={
              <Landmark className="w-6 h-6 text-[#D4AF37]" />
            }
          >

            <p className="text-[#D7C9A5] text-lg leading-8">

              {event.significance}

            </p>

          </EventCard>

        )}



        {/* TAGS */}

        {event.tags &&
          event.tags.length > 0 && (

            <EventCard
              eyebrow="Related History"
              title="Explore Further"
              icon={
                <MapPin className="w-6 h-6 text-[#D4AF37]" />
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

            </EventCard>

          )}


      </section>



      {/* FOOTER */}

      <section className="border-t border-[#D4AF37]/10">

        <div className="max-w-6xl mx-auto px-6 py-12 flex justify-between items-center">

          <span className="text-sm text-[#756B5B]">

            VeerBharat Historical Archive

          </span>


          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#E6C45A]"
          >

            Continue Exploring

            <ChevronRight className="w-4 h-4" />

          </Link>

        </div>

      </section>


    </main>

  );

}



/* =====================================================
   EVENT CARD
===================================================== */

function EventCard({

  eyebrow,

  title,

  icon,

  children,

}: {

  eyebrow: string;

  title: string;

  icon: React.ReactNode;

  children: React.ReactNode;

}) {

  return (

    <article className="rounded-2xl border border-[#D4AF37]/20 bg-[#17130F] p-6 md:p-10">

      <div className="flex items-start gap-4 mb-8">

        <div className="mt-1">

          {icon}

        </div>


        <div>

          <p className="text-[10px] uppercase tracking-[0.24em] text-[#A58A45] mb-2">

            {eyebrow}

          </p>


          <h2 className="text-2xl md:text-3xl font-serif font-bold">

            {title}

          </h2>

        </div>

      </div>


      {children}

    </article>

  );

}



function ImageCard({
    image,
  }: {
    image: EventImage;
  }) {

    return (

      <article className="group overflow-hidden rounded-xl border border-[#D4AF37]/15 bg-[#120F0C]">

        <div className="relative aspect-[16/10] overflow-hidden bg-[#0B0907]">

          <Image
            src={image.url}
            alt={image.altText || image.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => {
              console.error(
                "Failed to load image:",
                image.title,
                image.url
              );
            }}
          />

        </div>

        <div className="p-6">

          <h3 className="font-serif text-xl text-[#F8F5F0]">

            {image.title}

          </h3>

          {image.imageType && (

            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#A58A45]">

              {image.imageType}

            </p>

          )}

          {image.description && (

            <p className="mt-4 text-sm leading-7 text-[#AFA28A]">

              {image.description}

            </p>

          )}

        </div>

      </article>

    );

  }



/* =====================================================
   LEADER CARD
===================================================== */

function LeaderCard({
    image,
  }: {
    image: EventImage;
  }) {

    return (

      <article className="overflow-hidden rounded-xl border border-[#D4AF37]/20 bg-[#120F0C]">

        <div className="relative aspect-[4/3] bg-[#0B0907]">

          <Image
            src={image.url}
            alt={image.altText || image.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            onError={() => {
              console.error(
                "Failed to load leader image:",
                image.title,
                image.url
              );
            }}
          />

        </div>

        <div className="p-6">

          <div className="flex items-center gap-3 mb-4">

            <Shield className="w-5 h-5 text-[#D4AF37]" />

            <span className="text-xs uppercase tracking-[0.18em] text-[#A58A45]">

              Key Leader

            </span>

          </div>

          <h3 className="text-2xl font-serif font-bold">

            {image.title}

          </h3>

          {image.description && (

            <p className="mt-4 leading-7 text-[#AFA28A]">

              {image.description}

            </p>

          )}

        </div>

      </article>

    );

  }



/* =====================================================
   SIMPLE HISTORICAL CONTENT FORMATTER
===================================================== */

function HistoricalContent({

  content,

}: {

  content: string;

}) {

  const lines =
    content.split('\n');


  return (

    <div className="space-y-5 text-[#D7C9A5] leading-8">


      {lines.map(
        (line, index) => {

          const trimmed =
            line.trim();


          if (!trimmed) {

            return (
              <div
                key={index}
                className="h-2"
              />
            );

          }


          /* HEADINGS */

          if (
            trimmed.startsWith('### ')
          ) {

            return (

              <h3
                key={index}
                className="pt-6 text-2xl font-serif font-bold text-[#E0B84B]"
              >

                {trimmed.replace(
                  '### ',
                  ''
                )}

              </h3>

            );

          }


          if (
            trimmed.startsWith('## ')
          ) {

            return (

              <h3
                key={index}
                className="pt-8 text-3xl font-serif font-bold text-[#F8F5F0]"
              >

                {trimmed.replace(
                  '## ',
                  ''
                )}

              </h3>

            );

          }


          /* BULLET POINTS */

          if (
            trimmed.startsWith('- ') ||
            trimmed.startsWith('* ')
          ) {

            return (

              <div
                key={index}
                className="flex gap-4 pl-2"
              >

                <Sword className="w-4 h-4 shrink-0 mt-2 text-[#D4AF37]" />

                <p>

                  {trimmed.replace(
                    /^[-*]\s/,
                    ''
                  )}

                </p>

              </div>

            );

          }


          /* NUMBERED POINTS */

          if (
            /^\d+\.\s/.test(
              trimmed
            )
          ) {

            const text =
              trimmed.replace(
                /^\d+\.\s/,
                ''
              );


            return (

              <div
                key={index}
                className="flex gap-4"
              >

                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/30 text-xs text-[#D4AF37]">

                  {trimmed.match(
                    /^\d+/
                  )?.[0]}

                </span>


                <p>

                  {text}

                </p>

              </div>

            );

          }


          /* HORIZONTAL DIVIDER */

          if (
            trimmed === '---'
          ) {

            return (

              <hr
                key={index}
                className="border-[#D4AF37]/15 my-8"
              />

            );

          }


          /* NORMAL PARAGRAPH */

          return (

            <p
              key={index}
              className="text-base md:text-lg leading-8"
            >

              {trimmed}

            </p>

          );

        }
      )}

    </div>

  );

}