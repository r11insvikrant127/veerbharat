"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Swords,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ScrollText,
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface Battle {
  _id: string;
  battleId: string;
  name: string;
  nativeName?: string;
  battleDate?: string | null;
  battleDateAccuracy?: string;
  significance?: string;
  description: string;
  aftermath?: string;
  tags?: string[];
  status: string;

  crossReferences?: {
    relatedEvents?: {
      eventId: string;
      name: string;
    }[];
  };
}

interface BattlesResponse {
  data: Battle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function BattlesPage() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] =
    useState<BattlesResponse["pagination"] | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const limit = 9;

  useEffect(() => {
    async function fetchBattles() {
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
          `/api/battles?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch battles.");
        }

        const result: BattlesResponse =
          await response.json();

        setBattles(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error(error);

        setError(
          "Unable to load the battles archive."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBattles();
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

  function formatBattleDate(
    date?: string | null
  ) {
    if (!date) {
      return "Date Unknown";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date Unknown";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F8F5F0]">
      <Navbar />

      {/* =====================================================
          HERO HEADER
      ====================================================== */}

      <section className="relative pt-36 pb-20 overflow-hidden">

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] rounded-full bg-[#D4AF37]/5 blur-3xl" />

          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-[#8B1E1E]/10 blur-3xl" />

          <div className="absolute top-40 right-20 w-72 h-72 rounded-full bg-[#D4AF37]/5 blur-3xl" />

        </div>

        <div className="relative container mx-auto px-6">

          <div className="max-w-4xl mx-auto text-center">

            {/* Icon */}
            <div className="flex justify-center mb-6">

              <div className="w-16 h-16 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.08)]">

                <Swords className="w-8 h-8 text-[#D4AF37]" />

              </div>

            </div>

            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/70 mb-4">
              The Veer Bharat Archive
            </p>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#F8F5F0]">
              Battles
            </h1>

            <div className="flex items-center justify-center gap-4 mt-6">

              <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />

              <span className="text-[#D4AF37]/50 text-sm">
                ⚔ ✦ ⚔
              </span>

              <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />

            </div>

            <p className="mt-6 text-[#D7C9A5] text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Explore the battles, strategies and turning
              points that shaped kingdoms, changed destinies
              and altered the course of history.
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
                placeholder="Search battles, campaigns or historical conflicts..."
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
          BATTLES ARCHIVE
      ====================================================== */}

      <section className="section-dark pb-24">

        <div className="container mx-auto px-6">

          {/* Heading */}

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">

            <div>

              <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/60 mb-2">
                Historical Archive
              </p>

              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F8F5F0]">
                Where History Was Decided
              </h2>

            </div>

            {pagination && (

              <p className="text-sm text-[#A09682]">

                {pagination.total}{" "}

                {pagination.total === 1
                  ? "battle"
                  : "battles"}{" "}

                in archive

              </p>

            )}

          </div>


          {/* Loading */}

          {loading && (

            <div className="flex flex-col items-center justify-center py-24">

              <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />

              <p className="mt-5 text-[#A09682]">
                Opening the battlefield archives...
              </p>

            </div>

          )}


          {/* Error */}

          {!loading && error && (

            <div className="max-w-xl mx-auto text-center py-20 section-card p-10">

              <Swords className="w-10 h-10 text-[#D4AF37] mx-auto mb-5" />

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
            battles.length === 0 && (

              <div className="max-w-xl mx-auto text-center py-20 section-card p-10">

                <Swords className="w-10 h-10 text-[#D4AF37]/50 mx-auto mb-5" />

                <h3 className="font-serif text-2xl font-bold mb-3">
                  No Battles Found
                </h3>

                <p className="text-[#A09682]">

                  {search
                    ? `No battles matched "${search}".`
                    : "The archive currently contains no battles."}

                </p>

              </div>

            )}


          {/* BATTLE CARDS */}

          {!loading &&
            !error &&
            battles.length > 0 && (

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {battles.map((battle) => (

                  <Link
                    key={battle._id}
                    href={`/battles/${battle.battleId}`}
                    className="group block"
                  >

                    <article className="section-card-hover overflow-hidden h-full transition-all duration-300 group-hover:-translate-y-1">

                      {/* Battle stripe */}

                      <div className="relative h-2 bg-gradient-to-r from-[#7A1E1E] via-[#D4AF37] to-[#7A1E1E] opacity-80" />

                      <div className="p-7">

                        {/* ID and Status */}

                        <div className="flex items-center justify-between mb-6">

                          <span className="text-xs tracking-wider text-[#D4AF37]/60">
                            {battle.battleId}
                          </span>

                          <span className="px-3 py-1 rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/5 text-[10px] uppercase tracking-wider text-[#D7C9A5]">
                            {battle.status}
                          </span>

                        </div>


                        {/* Name */}

                        <h3 className="font-serif text-2xl font-bold text-[#F8F5F0] group-hover:text-[#D4AF37] transition-colors duration-300">

                          {battle.name}

                        </h3>


                        {/* Native Name */}

                        {battle.nativeName && (

                          <p className="mt-1 text-sm text-[#A09682]">
                            {battle.nativeName}
                          </p>

                        )}


                        {/* Date */}

                        <div className="flex items-center gap-2 mt-5 text-sm text-[#D4AF37]">

                          <CalendarDays className="w-4 h-4" />

                          <span>
                            {formatBattleDate(
                              battle.battleDate
                            )}
                          </span>

                          {battle.battleDateAccuracy &&
                            battle.battleDateAccuracy !==
                              "Exact" && (

                              <span className="text-[#A09682]">
                                ({battle.battleDateAccuracy})
                              </span>

                            )}

                        </div>


                        {/* Divider */}

                        <div className="my-5 h-px bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/10 to-transparent" />


                        {/* Significance */}

                        {battle.significance && (

                          <div className="flex gap-3 mb-4">

                            <ScrollText className="w-4 h-4 text-[#D4AF37]/70 mt-1 shrink-0" />

                            <p className="text-sm leading-relaxed text-[#D7C9A5] line-clamp-3">

                              {battle.significance}

                            </p>

                          </div>

                        )}


                        {/* Description */}

                        <p className="text-sm leading-relaxed text-[#A09682] line-clamp-3">

                          {battle.description}

                        </p>


                        {/* Tags */}

                        {battle.tags &&
                          battle.tags.length > 0 && (

                            <div className="flex flex-wrap gap-2 mt-6">

                              {battle.tags
                                .slice(0, 3)
                                .map((tag) => (

                                  <span
                                    key={tag}
                                    className="px-2.5 py-1 rounded-full border border-[#D4AF37]/10 bg-[#D4AF37]/5 text-[10px] text-[#D4AF37]/70"
                                  >
                                    {tag}
                                  </span>

                                ))}

                            </div>

                          )}


                        {/* Detail link */}

                        <div className="mt-7 pt-5 border-t border-[#D4AF37]/10">

                          <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/60 group-hover:text-[#D4AF37] transition-colors">

                            View Battle Record →

                          </span>

                        </div>

                      </div>

                    </article>

                  </Link>

                ))}

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

      <Footer />

    </main>
  );
}