"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Crown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface HistoricalPersonality {
  _id: string;

  historicalPersonalityId?: string;

  // Fallback in case your existing documents
  // still use heroId after being moved from Heroes.
  heroId?: string;

  name: string;
  nativeName?: string;
  title?: string;
  gender?: string;
  shortDescription?: string;
  biography?: string;
  status?: string;
}

interface HistoricalPersonalitiesResponse {
  data: HistoricalPersonality[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function HistoricalPersonalitiesPage() {
  const [personalities, setPersonalities] = useState<
    HistoricalPersonality[]
  >([]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] =
    useState<HistoricalPersonalitiesResponse["pagination"] | null>(
      null
    );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const limit = 10;

  useEffect(() => {
    async function fetchHistoricalPersonalities() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (search) {
          params.set("search", search);
        }

        const response = await fetch(
          `/api/historical-personalities?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch historical personalities."
          );
        }

        const result: HistoricalPersonalitiesResponse =
          await response.json();

        setPersonalities(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error(error);

        setError(
          "Unable to load the historical personalities archive."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchHistoricalPersonalities();
  }, [page, search]);

  function handleSearch(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  }

  function clearSearch() {
    setSearchInput("");
    setSearch("");
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F8F5F0]">
      {/* =====================================================
          HERO HEADER
      ====================================================== */}

      <section className="relative pt-36 pb-20 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#D4AF37]/5 blur-3xl" />

          <div className="absolute inset-0 bg-radial-gradient" />
        </div>

        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">

            {/* Decorative icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.08)]">
                <Crown className="w-8 h-8 text-[#D4AF37]" />
              </div>
            </div>

            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/70 mb-4">
              The Veer Bharat Archive
            </p>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-gold-gradient">
              Historical Personalities
            </h1>

            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />

              <span className="text-[#D4AF37]/50 text-sm">
                ✦ ✦ ✦
              </span>

              <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
            </div>

            <p className="mt-6 text-[#D7C9A5] text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Explore the rulers, commanders, strategists,
              scholars and influential individuals whose lives
              shaped the course of history in complex and lasting ways.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          SEARCH
      ====================================================== */}

      <section className="relative pb-14">
        <div className="container mx-auto px-6">
          <form
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-5 w-5 h-5 text-[#D4AF37]/60" />

              <input
                type="text"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(event.target.value)
                }
                placeholder="Search rulers, commanders, scholars and more..."
                className="w-full h-14 pl-14 pr-32 rounded-full bg-[#1C1410] border border-[#D4AF37]/20 text-[#F8F5F0] placeholder:text-[#A09682] outline-none transition-all duration-300 focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/10"
              />

              <button
                type="submit"
                className="absolute right-2 h-10 px-6 rounded-full bg-[#D4AF37] text-[#0F0F0F] font-medium hover:bg-[#C46A00] transition-all duration-300"
              >
                Search
              </button>
            </div>
          </form>

          {search && (
            <div className="flex justify-center mt-4">
              <button
                onClick={clearSearch}
                className="text-sm text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors"
              >
                Clear search for &quot;{search}&quot;
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          ARCHIVE
      ====================================================== */}

      <section className="section-dark pb-24">
        <div className="container mx-auto px-6">

          {/* Archive heading */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/60 mb-2">
                Historical Archive
              </p>

              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F8F5F0]">
                People Who Shaped History
              </h2>
            </div>

            {pagination && (
              <p className="text-sm text-[#A09682]">
                {pagination.total}{" "}
                {pagination.total === 1
                  ? "personality"
                  : "personalities"}{" "}
                in archive
              </p>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />

              <p className="mt-5 text-[#A09682]">
                Opening the historical archive...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="max-w-xl mx-auto text-center py-20 section-card p-10">
              <Crown className="w-10 h-10 text-[#D4AF37] mx-auto mb-5" />

              <h3 className="font-serif text-2xl font-bold mb-3">
                Archive Unavailable
              </h3>

              <p className="text-[#A09682]">
                {error}
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            personalities.length === 0 && (
              <div className="max-w-xl mx-auto text-center py-20 section-card p-10">
                <Crown className="w-10 h-10 text-[#D4AF37]/50 mx-auto mb-5" />

                <h3 className="font-serif text-2xl font-bold mb-3">
                  No Historical Personalities Found
                </h3>

                <p className="text-[#A09682]">
                  {search
                    ? `No historical personalities matched "${search}".`
                    : "The archive currently contains no historical personalities."}
                </p>
              </div>
            )}

          {/* PERSONALITY CARDS */}
          {!loading &&
            !error &&
            personalities.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {personalities.map((personality) => {
                  const personalityId =
                    personality.historicalPersonalityId ||
                    personality.heroId ||
                    personality._id;

                  return (
                    <Link
                      key={personality._id}
                      href={`/historical-personalities/${personalityId}`}
                      className="group block"
                    >
                      <article className="section-card-hover overflow-hidden h-full transition-all duration-300 group-hover:-translate-y-1">

                        {/* Card top */}
                        <div className="relative h-2 bg-gradient-to-r from-[#D4AF37] via-[#C46A00] to-[#D4AF37] opacity-70" />

                        <div className="p-7">

                          {/* ID + status */}
                          <div className="flex items-center justify-between mb-6">
                            <span className="text-xs tracking-wider text-[#D4AF37]/60">
                              {personalityId}
                            </span>

                            {personality.status && (
                              <span className="px-3 py-1 rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/5 text-[10px] uppercase tracking-wider text-[#D7C9A5]">
                                {personality.status}
                              </span>
                            )}
                          </div>

                          {/* Name */}
                          <h3 className="font-serif text-2xl font-bold text-[#F8F5F0] group-hover:text-[#D4AF37] transition-colors duration-300">
                            {personality.name}
                          </h3>

                          {/* Native name */}
                          {personality.nativeName && (
                            <p className="mt-1 text-sm text-[#A09682]">
                              {personality.nativeName}
                            </p>
                          )}

                          {/* Title */}
                          {personality.title && (
                            <p className="mt-4 text-sm text-[#D4AF37]">
                              {personality.title}
                            </p>
                          )}

                          {/* Divider */}
                          <div className="my-5 h-px bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/10 to-transparent" />

                          {/* Gender */}
                          {personality.gender && (
                            <div className="space-y-2 text-sm">
                              <p className="text-[#A09682]">
                                <span className="text-[#D7C9A5]">
                                  Gender:
                                </span>{" "}
                                {personality.gender}
                              </p>
                            </div>
                          )}

                          {/* Description */}
                          {(personality.shortDescription ||
                            personality.biography) && (
                            <p className="mt-5 text-sm leading-relaxed text-[#A09682] line-clamp-3">
                              {personality.shortDescription ||
                                personality.biography}
                            </p>
                          )}

                          {/* Detail link */}
                          <div className="mt-7 pt-5 border-t border-[#D4AF37]/10">
                            <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/60 group-hover:text-[#D4AF37] transition-colors">
                              View Historical Record →
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}

          {/* =====================================================
              PAGINATION
          ====================================================== */}

          {!loading &&
            !error &&
            pagination &&
            pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">

                <button
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((current) =>
                      Math.max(1, current - 1)
                    )
                  }
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#D4AF37]/20 text-[#D7C9A5] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <span className="text-sm text-[#A09682]">
                  Page{" "}
                  <span className="text-[#D4AF37]">
                    {pagination.page}
                  </span>{" "}
                  of {pagination.totalPages}
                </span>

                <button
                  disabled={
                    page >= pagination.totalPages
                  }
                  onClick={() =>
                    setPage((current) =>
                      Math.min(
                        pagination.totalPages,
                        current + 1
                      )
                    )
                  }
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#D4AF37]/20 text-[#D7C9A5] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>

              </div>
            )}
        </div>
      </section>
    </main>
  );
}