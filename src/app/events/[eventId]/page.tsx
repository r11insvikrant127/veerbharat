'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Calendar,
  ArrowLeft,
  MapPin,
  Landmark,
} from 'lucide-react';

interface HistoricalEvent {
  _id: string;
  eventId: string;
  name: string;
  nativeName?: string;
  eventDate: string | null;
  eventDateAccuracy: string;
  description: string;
  significance?: string;
  type?: string;
  tags?: string[];
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

  return (

    <main className="min-h-screen bg-[#0F0F0F] text-[#F8F5F0]">

      {/* Hero Area */}

      <section className="relative overflow-hidden border-b border-[#D4AF37]/10">

        <div className="absolute inset-0 bg-gradient-to-br from-[#1C1410] via-[#0F0F0F] to-[#1C1410]" />

        <div className="relative max-w-5xl mx-auto px-6 py-24">

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#C46A00] mb-12 transition-colors"
          >

            <ArrowLeft className="w-4 h-4" />

            Back to History

          </Link>

          <div className="flex items-center gap-3 text-[#D4AF37] mb-5">

            <Calendar className="w-5 h-5" />

            <span className="font-medium">

              {year ?? 'Historical Event'}

            </span>

          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight max-w-4xl">

            {event.name}

          </h1>

          {event.nativeName && (

            <p className="text-xl text-[#A09682] mt-4">

              {event.nativeName}

            </p>

          )}

        </div>

      </section>


      {/* Historical Story */}

      <section className="max-w-4xl mx-auto px-6 py-20">

        <div className="border-l-2 border-[#D4AF37]/40 pl-6 mb-12">

          <p className="text-xl md:text-2xl text-[#D7C9A5] leading-relaxed font-light">

            {event.description}

          </p>

        </div>


        {event.significance && (

          <div className="bg-[#1C1410] border border-[#D4AF37]/15 rounded-2xl p-8 mb-12">

            <div className="flex items-center gap-3 mb-4">

              <Landmark className="w-6 h-6 text-[#D4AF37]" />

              <h2 className="text-2xl font-serif font-bold">

                Why This Moment Matters

              </h2>

            </div>

            <p className="text-[#D7C9A5] leading-relaxed">

              {event.significance}

            </p>

          </div>

        )}


        {event.tags &&
          event.tags.length > 0 && (

          <div>

            <h3 className="text-lg font-serif font-bold mb-4">

              Explore Related History

            </h3>

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

          </div>

        )}

      </section>

    </main>

  );
}