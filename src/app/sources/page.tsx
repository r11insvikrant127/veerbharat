"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  FileText,
  Search,
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface Source {
  _id?: string;
  sourceId: string;
  title: string;
  type?: string;
  author?: string;
  language?: string;
  year?: string;
  publisher?: string;
  edition?: string;
  isbn?: string;
  pages?: number;
  volume?: string;
  publicationYear?: string;
  description?: string;
  reliability?: string;
  location?: string;
  url?: string;
  tags?: string[];
  status?: string;
}

function getSourceArray(payload: any): Source[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.sources)) {
    return payload.data.sources;
  }

  if (Array.isArray(payload?.sources)) {
    return payload.sources;
  }

  return [];
}

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [filteredSources, setFilteredSources] = useState<Source[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSources() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/sources");

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              result?.error ||
              "Unable to load sources."
          );
        }

        const sourceList = getSourceArray(result);

        setSources(sourceList);
        setFilteredSources(sourceList);
      } catch (err) {
        console.error("Failed to load sources:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load sources."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSources();
  }, []);

  useEffect(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      setFilteredSources(sources);
      return;
    }

    const filtered = sources.filter((source) => {
      return (
        source.title?.toLowerCase().includes(query) ||
        source.sourceId?.toLowerCase().includes(query) ||
        source.author?.toLowerCase().includes(query) ||
        source.publisher?.toLowerCase().includes(query) ||
        source.type?.toLowerCase().includes(query) ||
        source.description?.toLowerCase().includes(query) ||
        source.tags?.some((tag) =>
          tag.toLowerCase().includes(query)
        )
      );
    });

    setFilteredSources(filtered);
  }, [searchTerm, sources]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F1E8]">
      <Navbar />

      <main className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="
              absolute
              top-0
              left-1/2
              -translate-x-1/2
              w-[800px]
              h-[500px]
              rounded-full
              bg-[#D4AF37]/5
              blur-3xl
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-b
              from-[#D4AF37]/[0.02]
              via-transparent
              to-transparent
            "
          />
        </div>

        <div
          className="
            relative
            container
            mx-auto
            px-6
            py-16
            md:py-24
          "
        >
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  mb-4
                  text-sm
                  uppercase
                  tracking-[0.2em]
                  text-[#D4AF37]
                "
              >
                <BookOpen className="w-4 h-4" />
                Historical Sources
              </div>

              <h1
                className="
                  text-4xl
                  md:text-5xl
                  lg:text-6xl
                  font-serif
                  font-semibold
                  text-[#F5F1E8]
                  mb-5
                "
              >
                Sources & References
              </h1>

              <p
                className="
                  max-w-3xl
                  text-base
                  md:text-lg
                  leading-8
                  text-[#A09682]
                "
              >
                Explore the books, archives, publications, records,
                and other historical sources used to document the
                people, events, battles, kingdoms, and stories of
                VeerBharat.
              </p>
            </div>

            {/* Search */}
            <div className="mb-10">
              <div className="relative max-w-2xl">
                <Search
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    w-5
                    h-5
                    text-[#7F7769]
                  "
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search sources by title, author, publisher, type..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#3A352D]
                    bg-[#121212]
                    py-4
                    pl-12
                    pr-4
                    text-[#F5F1E8]
                    placeholder:text-[#6F695E]
                    outline-none
                    transition
                    focus:border-[#D4AF37]
                    focus:ring-1
                    focus:ring-[#D4AF37]/40
                  "
                />
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div
                className="
                  py-24
                  text-center
                  text-[#A09682]
                "
              >
                <div
                  className="
                    mx-auto
                    mb-4
                    h-8
                    w-8
                    animate-spin
                    rounded-full
                    border-2
                    border-[#3A352D]
                    border-t-[#D4AF37]
                  "
                />

                <p>Loading sources...</p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div
                className="
                  rounded-xl
                  border
                  border-red-900/50
                  bg-red-950/20
                  p-6
                  text-red-300
                "
              >
                <h2 className="mb-2 text-lg font-semibold">
                  Unable to load sources
                </h2>

                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Empty */}
            {!loading &&
              !error &&
              filteredSources.length === 0 && (
                <div
                  className="
                    rounded-xl
                    border
                    border-[#3A352D]
                    bg-[#121212]
                    py-20
                    text-center
                  "
                >
                  <FileText
                    className="
                      mx-auto
                      mb-4
                      h-10
                      w-10
                      text-[#6F695E]
                    "
                  />

                  <h2
                    className="
                      mb-2
                      text-xl
                      font-semibold
                      text-[#F5F1E8]
                    "
                  >
                    No sources found
                  </h2>

                  <p className="text-[#8D8679]">
                    {searchTerm
                      ? "Try a different search term."
                      : "No sources are currently available."}
                  </p>
                </div>
              )}

            {/* Source count */}
            {!loading && !error && filteredSources.length > 0 && (
              <div className="mb-6 text-sm text-[#7F7769]">
                Showing{" "}
                <span className="text-[#D4AF37]">
                  {filteredSources.length}
                </span>{" "}
                {filteredSources.length === 1
                  ? "source"
                  : "sources"}
              </div>
            )}

            {/* Source cards */}
            {!loading &&
              !error &&
              filteredSources.length > 0 && (
                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-3
                    gap-6
                  "
                >
                  {filteredSources.map((source) => (
                    <Link
                      key={
                        source.sourceId ||
                        source._id ||
                        source.title
                      }
                      href={`/sources/${encodeURIComponent(
                        source.sourceId
                      )}`}
                      className="
                        group
                        block
                        h-full
                        rounded-2xl
                        border
                        border-[#3A352D]
                        bg-[#121212]
                        p-6
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-[#D4AF37]/50
                        hover:bg-[#171614]
                        hover:shadow-[0_15px_50px_rgba(0,0,0,0.35)]
                      "
                    >
                      {/* Top row */}
                      <div
                        className="
                          mb-5
                          flex
                          items-start
                          justify-between
                          gap-4
                        "
                      >
                        <div
                          className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-[#D4AF37]/20
                            bg-[#D4AF37]/5
                          "
                        >
                          <BookOpen
                            className="
                              h-5
                              w-5
                              text-[#D4AF37]
                            "
                          />
                        </div>

                        {source.type && (
                          <span
                            className="
                              rounded-full
                              border
                              border-[#3A352D]
                              px-3
                              py-1
                              text-xs
                              uppercase
                              tracking-wider
                              text-[#A09682]
                            "
                          >
                            {source.type}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h2
                        className="
                          mb-3
                          line-clamp-2
                          text-xl
                          font-semibold
                          leading-7
                          text-[#F5F1E8]
                          transition-colors
                          group-hover:text-[#D4AF37]
                        "
                      >
                        {source.title}
                      </h2>

                      {/* Source ID */}
                      <p
                        className="
                          mb-4
                          font-mono
                          text-xs
                          text-[#6F695E]
                        "
                      >
                        {source.sourceId}
                      </p>

                      {/* Author */}
                      {source.author && (
                        <p
                          className="
                            mb-3
                            text-sm
                            text-[#B4AB9A]
                          "
                        >
                          <span className="text-[#7F7769]">
                            Author:
                          </span>{" "}
                          {source.author}
                        </p>
                      )}

                      {/* Description */}
                      {source.description && (
                        <p
                          className="
                            mb-6
                            line-clamp-3
                            text-sm
                            leading-6
                            text-[#8D8679]
                          "
                        >
                          {source.description}
                        </p>
                      )}

                      {/* Metadata */}
                      <div
                        className="
                          mb-6
                          space-y-2
                          border-t
                          border-[#2A2722]
                          pt-4
                        "
                      >
                        {source.publisher && (
                          <div className="flex gap-2 text-xs">
                            <span className="text-[#6F695E]">
                              Publisher:
                            </span>

                            <span className="text-[#A09682]">
                              {source.publisher}
                            </span>
                          </div>
                        )}

                        {(source.year ||
                          source.publicationYear) && (
                          <div className="flex gap-2 text-xs">
                            <span className="text-[#6F695E]">
                              Year:
                            </span>

                            <span className="text-[#A09682]">
                              {source.year ||
                                source.publicationYear}
                            </span>
                          </div>
                        )}

                        {source.language && (
                          <div className="flex gap-2 text-xs">
                            <span className="text-[#6F695E]">
                              Language:
                            </span>

                            <span className="text-[#A09682]">
                              {source.language}
                            </span>
                          </div>
                        )}

                        {source.reliability && (
                          <div className="flex gap-2 text-xs">
                            <span className="text-[#6F695E]">
                              Reliability:
                            </span>

                            <span className="text-[#A09682]">
                              {source.reliability}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {source.tags &&
                        source.tags.length > 0 && (
                          <div className="mb-6 flex flex-wrap gap-2">
                            {source.tags
                              .slice(0, 4)
                              .map((tag) => (
                                <span
                                  key={tag}
                                  className="
                                    rounded-md
                                    bg-[#1A1815]
                                    px-2
                                    py-1
                                    text-xs
                                    text-[#8D8679]
                                  "
                                >
                                  {tag}
                                </span>
                              ))}
                          </div>
                        )}

                      {/* Footer */}
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          border-t
                          border-[#2A2722]
                          pt-4
                        "
                      >
                        <span
                          className="
                            text-sm
                            font-medium
                            text-[#D4AF37]
                          "
                        >
                          View Source
                        </span>

                        <ArrowRight
                          className="
                            h-4
                            w-4
                            text-[#D4AF37]
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                          "
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}