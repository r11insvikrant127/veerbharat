"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Search,
  Calendar,
  ScrollText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface ImageData {
  _id: string;
  imageId?: string;
  title: string;
  url: string;
  altText?: string;
  imageType?: string;
}

interface EventImageRelation {
  _id: string;
  relatedSection?: string;

  imageId?: ImageData | string | null;
}

interface HistoricalEvent {
  _id: string;
  eventId: string;

  name: string;
  nativeName?: string;

  eventDate?: string | null;

  description?: string;
  shortDescription?: string;

  type?: string;
  status?: string;

  imageIds?: EventImageRelation[];
}

interface EventsResponse {
  data: HistoricalEvent[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function EventsPage() {
  const [events, setEvents] =
    useState<HistoricalEvent[]>([]);

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState<EventsResponse["pagination"] | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const limit = 12;

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        setError("");

        const params =
          new URLSearchParams({
            page: String(page),
            limit: String(limit),
          });

        if (search) {
          params.set(
            "search",
            search
          );
        }

        const response =
          await fetch(
            `/api/events?${params.toString()}`
          );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch historical events."
          );
        }

        const result: EventsResponse =
          await response.json();

        setEvents(result.data);

        setPagination(
          result.pagination
        );
      } catch (error) {
        console.error(error);

        setError(
          "Unable to load the historical events archive."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [page, search]);

  function handleSearch(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setPage(1);

    setSearch(
      searchInput.trim()
    );
  }

  function clearSearch() {
    setSearchInput("");
    setSearch("");
    setPage(1);
  }

  function getEventImage(
    event: HistoricalEvent
  ): ImageData | null {
    const relation =
      event.imageIds?.find(
        (item) =>
          item.imageId &&
          typeof item.imageId !== "string"
      );

    if (
      !relation ||
      !relation.imageId ||
      typeof relation.imageId === "string"
    ) {
      return null;
    }

    return relation.imageId;
  }

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F8F5F0]">
      <Navbar />

      {/* HERO */}

      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#D4AF37]/5 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-6">

          <div className="max-w-4xl mx-auto text-center">

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/5 flex items-center justify-center">
                <ScrollText className="w-7 h-7 text-[#D4AF37]" />
              </div>
            </div>

            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/60 mb-5">
              Historical Archive
            </p>

            <h1 className="font-serif text-4xl md:text-6xl font-bold">
              Events of Bharat
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-[#A09682] leading-8">
              Explore defining rebellions, movements,
              political transformations, cultural milestones,
              and other events that shaped the history of Bharat.
            </p>

          </div>

        </div>
      </section>

      {/* SEARCH */}

      <section className="pb-12">
        <div className="container mx-auto px-6">

          <form
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto relative"
          >

            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]/60" />

            <input
              type="text"
              value={searchInput}
              onChange={(event) =>
                setSearchInput(
                  event.target.value
                )
              }
              placeholder="Search the historical events archive..."
              className="w-full rounded-full border border-[#D4AF37]/20 bg-[#17130F] pl-14 pr-32 py-4 text-[#F8F5F0] placeholder:text-[#A09682]/60 outline-none focus:border-[#D4AF37]/50"
            />

            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 rounded-full bg-[#D4AF37] text-[#0F0F0F] text-sm font-medium hover:bg-[#E2C65C] transition-colors"
            >
              Search
            </button>

          </form>

          {search && (
            <div className="flex justify-center mt-5">

              <button
                onClick={clearSearch}
                className="text-sm text-[#A09682] hover:text-[#D4AF37] transition-colors"
              >
                Clear search for "{search}"
              </button>

            </div>
          )}

        </div>
      </section>

      {/* EVENTS */}

      <section className="pb-24">
        <div className="container mx-auto px-6">

          {loading && (
            <div className="py-24 text-center">

              <div className="w-12 h-12 mx-auto rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />

              <p className="mt-6 text-[#A09682]">
                Opening the historical archive...
              </p>

            </div>
          )}

          {!loading && error && (
            <div className="max-w-xl mx-auto text-center py-20 section-card-hover p-10">

              <h2 className="font-serif text-2xl font-bold">
                Unable to Load Events
              </h2>

              <p className="mt-4 text-[#A09682]">
                {error}
              </p>

            </div>
          )}

          {!loading &&
            !error &&
            events.length === 0 && (
              <div className="text-center py-24">

                <h2 className="font-serif text-3xl font-bold">
                  No Events Found
                </h2>

                <p className="mt-4 text-[#A09682]">
                  {search
                    ? `No historical events matched "${search}".`
                    : "No historical events are currently available."}
                </p>

              </div>
            )}

          {!loading &&
            !error &&
            events.length > 0 && (

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

                {events.map((event) => {
                  const image =
                    getEventImage(event);

                  return (
                    <Link
                      key={event.eventId}
                      href={`/events/${event.eventId}`}
                      className="group overflow-hidden rounded-xl border border-[#D4AF37]/15 bg-[#120F0C] hover:border-[#D4AF37]/40 transition-all duration-300"
                    >

                      {/* IMAGE */}

                      <div className="relative aspect-[16/10] bg-[#17130F] overflow-hidden">

                        {image?.url ? (
                          <Image
                            src={image.url}
                            alt={
                              image.altText ||
                              image.title
                            }
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1C1710] to-[#0F0F0F]">

                            <ScrollText className="w-12 h-12 text-[#D4AF37]/25" />

                          </div>
                        )}

                      </div>

                      {/* CONTENT */}

                      <div className="p-7">

                        <div className="flex flex-wrap gap-3 mb-4">

                          {event.type && (
                            <span className="px-3 py-1 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[10px] uppercase tracking-[0.18em] text-[#D4AF37]/70">
                              {event.type}
                            </span>
                          )}

                          {event.eventDate && (
                            <span className="flex items-center gap-1.5 text-xs text-[#A09682]">

                              <Calendar className="w-3.5 h-3.5" />

                              {new Date(
                                event.eventDate
                              ).getFullYear()}

                            </span>
                          )}

                        </div>

                        <h2 className="font-serif text-2xl font-bold group-hover:text-[#D4AF37] transition-colors">

                          {event.name}

                        </h2>

                        {event.nativeName && (
                          <p className="mt-2 text-sm text-[#D4AF37]/60">
                            {event.nativeName}
                          </p>
                        )}

                        {(event.shortDescription ||
                          event.description) && (
                          <p className="mt-4 text-sm leading-7 text-[#A09682] line-clamp-4">

                            {event.shortDescription ||
                              event.description}

                          </p>
                        )}

                        <div className="mt-6 text-sm text-[#D4AF37]">
                          Explore Event →
                        </div>

                      </div>

                    </Link>
                  );
                })}

              </div>
            )}

          {/* PAGINATION */}

          {pagination &&
            pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-16">

                <button
                  onClick={() =>
                    setPage(
                      Math.max(
                        1,
                        page - 1
                      )
                    )
                  }
                  disabled={page === 1}
                  className="p-3 rounded-full border border-[#D4AF37]/20 text-[#D4AF37] disabled:opacity-30 hover:bg-[#D4AF37]/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-sm text-[#A09682]">
                  Page {pagination.page} of{" "}
                  {pagination.totalPages}
                </span>

                <button
                  onClick={() =>
                    setPage(
                      Math.min(
                        pagination.totalPages,
                        page + 1
                      )
                    )
                  }
                  disabled={
                    page ===
                    pagination.totalPages
                  }
                  className="p-3 rounded-full border border-[#D4AF37]/20 text-[#D4AF37] disabled:opacity-30 hover:bg-[#D4AF37]/10 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

              </div>
            )}

        </div>
      </section>

      <Footer />
    </main>
  );
}