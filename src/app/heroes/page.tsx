"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Search, Shield, ChevronLeft, ChevronRight } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface Hero {
  _id: string;
  heroId: string;
  name: string;
  nativeName: string;
  title: string;
  gender: string;
  shortDescription: string;
  biography: string;
  status: string;
}

interface HeroesResponse {
  data: Hero[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function HeroesPage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] =
    useState<HeroesResponse["pagination"] | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const limit = 10;

  useEffect(() => {
    async function fetchHeroes() {
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
          `/api/heroes?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch heroes.");
        }

        const result: HeroesResponse =
          await response.json();

        setHeroes(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error(error);
        setError(
          "Unable to load the heroes archive."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchHeroes();
  }, [page, search]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
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
      <Navbar />

      {/* HERO HEADER */}
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
                <Shield className="w-8 h-8 text-[#D4AF37]" />
              </div>
            </div>

            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/70 mb-4">
              The Veer Bharat Archive
            </p>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-gold-gradient">
              Bravehearts
            </h1>

            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />

              <span className="text-[#D4AF37]/50 text-sm">
                ✦ ✦ ✦
              </span>

              <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
            </div>

            <p className="mt-6 text-[#D7C9A5] text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Discover the warriors, rulers, commanders,
              and visionaries whose courage shaped the
              history of India.
            </p>
          </div>
        </div>
      </section>

      {/* SEARCH */}
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
                placeholder="Search the bravehearts archive..."
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
                Clear search for "{search}"
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ARCHIVE */}
      <section className="section-dark pb-24">
        <div className="container mx-auto px-6">
          {/* Archive heading */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/60 mb-2">
                Historical Archive
              </p>

              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F8F5F0]">
                Remembered for Their Courage
              </h2>
            </div>

            {pagination && (
              <p className="text-sm text-[#A09682]">
                {pagination.total}{" "}
                {pagination.total === 1
                  ? "braveheart"
                  : "bravehearts"}{" "}
                in archive
              </p>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />

              <p className="mt-5 text-[#A09682]">
                Opening the archive...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="max-w-xl mx-auto text-center py-20 section-card p-10">
              <Shield className="w-10 h-10 text-[#D4AF37] mx-auto mb-5" />

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
            heroes.length === 0 && (
              <div className="max-w-xl mx-auto text-center py-20 section-card p-10">
                <Shield className="w-10 h-10 text-[#D4AF37]/50 mx-auto mb-5" />

                <h3 className="font-serif text-2xl font-bold mb-3">
                  No Bravehearts Found
                </h3>

                <p className="text-[#A09682]">
                  {search
                    ? `No heroes matched "${search}".`
                    : "The archive currently contains no heroes."}
                </p>
              </div>
            )}

          {/* HERO CARDS */}
          {!loading &&
            !error &&
            heroes.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {heroes.map((hero) => (
                <Link
                  key={hero._id}
                  href={`/heroes/${hero.heroId}`}
                  className="group block"
                >
                  <article className="section-card-hover overflow-hidden h-full transition-all duration-300 group-hover:-translate-y-1">
                    {/* Card top */}
                    <div className="relative h-2 bg-gradient-to-r from-[#D4AF37] via-[#C46A00] to-[#D4AF37] opacity-70" />

                    <div className="p-7">
                      {/* ID + status */}
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-xs tracking-wider text-[#D4AF37]/60">
                          {hero.heroId}
                        </span>

                        <span className="px-3 py-1 rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/5 text-[10px] uppercase tracking-wider text-[#D7C9A5]">
                          {hero.status}
                        </span>
                      </div>

                      {/* Name */}
                      <h3 className="font-serif text-2xl font-bold text-[#F8F5F0] group-hover:text-[#D4AF37] transition-colors duration-300">
                        {hero.name}
                      </h3>

                      {/* Native name */}
                      {hero.nativeName && (
                        <p className="mt-1 text-sm text-[#A09682]">
                          {hero.nativeName}
                        </p>
                      )}

                      {/* Title */}
                      {hero.title && (
                        <p className="mt-4 text-sm text-[#D4AF37]">
                          {hero.title}
                        </p>
                      )}

                      {/* Divider */}
                      <div className="my-5 h-px bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/10 to-transparent" />

                      {/* Details */}
                      <div className="space-y-2 text-sm">
                        <p className="text-[#A09682]">
                          <span className="text-[#D7C9A5]">
                            Gender:
                          </span>{" "}
                          {hero.gender}
                        </p>
                      </div>

                      {/* Description */}
                      {(hero.shortDescription || hero.biography) && (
                        <p className="mt-5 text-sm leading-relaxed text-[#A09682] line-clamp-3">
                          {hero.shortDescription || hero.biography}
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
              ))}
              </div>
            )}

          {/* PAGINATION */}
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