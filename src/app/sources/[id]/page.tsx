"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  FileText,
  Globe,
  MapPin,
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

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function getSourceFromResponse(payload: any): Source | null {
  if (!payload) {
    return null;
  }

  if (payload.data && !Array.isArray(payload.data)) {
    return payload.data;
  }

  if (
    payload.data?.source &&
    !Array.isArray(payload.data.source)
  ) {
    return payload.data.source;
  }

  if (
    payload.source &&
    !Array.isArray(payload.source)
  ) {
    return payload.source;
  }

  if (payload.sourceId) {
    return payload;
  }

  return null;
}

function MetadataRow({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-[180px_1fr]
        gap-2
        md:gap-6
        border-b
        border-[#2A2722]
        py-4
        last:border-b-0
      "
    >
      <div
        className="
          text-sm
          font-medium
          text-[#6F695E]
        "
      >
        {label}
      </div>

      <div
        className="
          break-words
          text-sm
          leading-6
          text-[#C5BBA9]
        "
      >
        {value}
      </div>
    </div>
  );
}

export default function SourceDetailPage({
  params,
}: PageProps) {
  const [source, setSource] = useState<Source | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSource() {
      try {
        setLoading(true);
        setError("");

        const { id } = await params;

        const response = await fetch(
          `/api/sources/${encodeURIComponent(id)}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              result?.error ||
              "Source not found."
          );
        }

        const sourceData =
          getSourceFromResponse(result);

        if (!sourceData) {
          throw new Error(
            "The source data returned by the server is invalid."
          );
        }

        setSource(sourceData);
      } catch (err) {
        console.error("Failed to load source:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load this source."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSource();
  }, [params]);

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
          <div className="max-w-5xl mx-auto">
            {/* Back button */}
            <Link
              href="/sources"
              className="
                inline-flex
                items-center
                gap-2
                mb-10
                text-sm
                text-[#A09682]
                transition-colors
                hover:text-[#D4AF37]
              "
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sources
            </Link>

            {/* Loading */}
            {loading && (
              <div
                className="
                  rounded-2xl
                  border
                  border-[#3A352D]
                  bg-[#121212]
                  py-24
                  text-center
                "
              >
                <div
                  className="
                    mx-auto
                    mb-5
                    h-10
                    w-10
                    animate-spin
                    rounded-full
                    border-2
                    border-[#3A352D]
                    border-t-[#D4AF37]
                  "
                />

                <p className="text-[#A09682]">
                  Loading source...
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div
                className="
                  rounded-2xl
                  border
                  border-red-900/50
                  bg-red-950/20
                  p-8
                "
              >
                <h1
                  className="
                    mb-3
                    text-2xl
                    font-semibold
                    text-red-300
                  "
                >
                  Source Not Found
                </h1>

                <p className="text-sm leading-6 text-red-200/80">
                  {error}
                </p>
              </div>
            )}

            {/* Source */}
            {!loading && !error && source && (
              <>
                {/* Header card */}
                <section
                  className="
                    rounded-2xl
                    border
                    border-[#3A352D]
                    bg-[#121212]
                    p-8
                    md:p-12
                    shadow-[0_20px_70px_rgba(0,0,0,0.25)]
                  "
                >
                  <div
                    className="
                      mb-8
                      flex
                      flex-col
                      gap-6
                      md:flex-row
                      md:items-start
                      md:justify-between
                    "
                  >
                    <div className="flex gap-5">
                      <div
                        className="
                          flex
                          h-14
                          w-14
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-[#D4AF37]/20
                          bg-[#D4AF37]/5
                        "
                      >
                        <BookOpen
                          className="
                            h-7
                            w-7
                            text-[#D4AF37]
                          "
                        />
                      </div>

                      <div>
                        <div
                          className="
                            mb-2
                            font-mono
                            text-xs
                            tracking-wider
                            text-[#6F695E]
                          "
                        >
                          {source.sourceId}
                        </div>

                        <h1
                          className="
                            text-3xl
                            font-serif
                            font-semibold
                            leading-tight
                            text-[#F5F1E8]
                            md:text-5xl
                          "
                        >
                          {source.title}
                        </h1>
                      </div>
                    </div>

                    {source.type && (
                      <span
                        className="
                          inline-flex
                          w-fit
                          rounded-full
                          border
                          border-[#D4AF37]/30
                          bg-[#D4AF37]/5
                          px-4
                          py-2
                          text-xs
                          uppercase
                          tracking-[0.15em]
                          text-[#D4AF37]
                        "
                      >
                        {source.type}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {source.description && (
                    <div
                      className="
                        border-t
                        border-[#2A2722]
                        pt-8
                      "
                    >
                      <h2
                        className="
                          mb-4
                          text-sm
                          font-semibold
                          uppercase
                          tracking-[0.15em]
                          text-[#D4AF37]
                        "
                      >
                        Description
                      </h2>

                      <p
                        className="
                          text-base
                          leading-8
                          text-[#B4AB9A]
                        "
                      >
                        {source.description}
                      </p>
                    </div>
                  )}
                </section>

                {/* Bibliographic Information */}
                <section
                  className="
                    mt-8
                    rounded-2xl
                    border
                    border-[#3A352D]
                    bg-[#121212]
                    p-8
                    md:p-10
                  "
                >
                  <div className="mb-6 flex items-center gap-3">
                    <FileText
                      className="
                        h-5
                        w-5
                        text-[#D4AF37]
                      "
                    />

                    <h2
                      className="
                        text-2xl
                        font-serif
                        font-semibold
                        text-[#F5F1E8]
                      "
                    >
                      Bibliographic Information
                    </h2>
                  </div>

                  <div>
                    <MetadataRow
                      label="Title"
                      value={source.title}
                    />

                    <MetadataRow
                      label="Source ID"
                      value={source.sourceId}
                    />

                    <MetadataRow
                      label="Type"
                      value={source.type}
                    />

                    <MetadataRow
                      label="Author"
                      value={source.author}
                    />

                    <MetadataRow
                      label="Language"
                      value={source.language}
                    />

                    <MetadataRow
                      label="Year"
                      value={source.year}
                    />

                    <MetadataRow
                      label="Publication Year"
                      value={source.publicationYear}
                    />

                    <MetadataRow
                      label="Publisher"
                      value={source.publisher}
                    />

                    <MetadataRow
                      label="Edition"
                      value={source.edition}
                    />

                    <MetadataRow
                      label="Volume"
                      value={source.volume}
                    />

                    <MetadataRow
                      label="Pages"
                      value={source.pages}
                    />

                    <MetadataRow
                      label="ISBN"
                      value={source.isbn}
                    />
                  </div>
                </section>

                {/* Additional Information */}
                <section
                  className="
                    mt-8
                    rounded-2xl
                    border
                    border-[#3A352D]
                    bg-[#121212]
                    p-8
                    md:p-10
                  "
                >
                  <div className="mb-6 flex items-center gap-3">
                    <Globe
                      className="
                        h-5
                        w-5
                        text-[#D4AF37]
                      "
                    />

                    <h2
                      className="
                        text-2xl
                        font-serif
                        font-semibold
                        text-[#F5F1E8]
                      "
                    >
                      Additional Information
                    </h2>
                  </div>

                  <MetadataRow
                    label="Reliability"
                    value={source.reliability}
                  />

                  <MetadataRow
                    label="Location"
                    value={source.location}
                  />

                  <MetadataRow
                    label="Status"
                    value={source.status}
                  />
                </section>

                {/* Location */}
                {source.location && (
                  <section
                    className="
                      mt-8
                      rounded-2xl
                      border
                      border-[#3A352D]
                      bg-[#121212]
                      p-8
                    "
                  >
                    <div className="flex items-start gap-4">
                      <MapPin
                        className="
                          mt-1
                          h-5
                          w-5
                          shrink-0
                          text-[#D4AF37]
                        "
                      />

                      <div>
                        <h2
                          className="
                            mb-2
                            text-lg
                            font-semibold
                            text-[#F5F1E8]
                          "
                        >
                          Location
                        </h2>

                        <p className="text-sm leading-6 text-[#A09682]">
                          {source.location}
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                {/* Tags */}
                {source.tags &&
                  source.tags.length > 0 && (
                    <section
                      className="
                        mt-8
                        rounded-2xl
                        border
                        border-[#3A352D]
                        bg-[#121212]
                        p-8
                      "
                    >
                      <h2
                        className="
                          mb-5
                          text-2xl
                          font-serif
                          font-semibold
                          text-[#F5F1E8]
                        "
                      >
                        Tags
                      </h2>

                      <div className="flex flex-wrap gap-3">
                        {source.tags.map((tag) => (
                          <span
                            key={tag}
                            className="
                              rounded-lg
                              border
                              border-[#3A352D]
                              bg-[#1A1815]
                              px-3
                              py-2
                              text-sm
                              text-[#A09682]
                            "
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                {/* External Source */}
                {source.url && (
                  <section
                    className="
                      mt-8
                      rounded-2xl
                      border
                      border-[#D4AF37]/20
                      bg-[#D4AF37]/[0.03]
                      p-8
                      md:p-10
                    "
                  >
                    <div
                      className="
                        flex
                        flex-col
                        gap-6
                        md:flex-row
                        md:items-center
                        md:justify-between
                      "
                    >
                      <div>
                        <h2
                          className="
                            mb-2
                            text-xl
                            font-semibold
                            text-[#F5F1E8]
                          "
                        >
                          Original Source
                        </h2>

                        <p
                          className="
                            max-w-2xl
                            text-sm
                            leading-6
                            text-[#8D8679]
                          "
                        >
                          Open the original publication,
                          archive, document, or webpage
                          associated with this source.
                        </p>
                      </div>

                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          inline-flex
                          shrink-0
                          items-center
                          justify-center
                          gap-2
                          rounded-lg
                          bg-[#D4AF37]
                          px-5
                          py-3
                          text-sm
                          font-semibold
                          text-[#0B0B0B]
                          transition
                          hover:bg-[#E5C45A]
                        "
                      >
                        Open Original Source
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </section>
                )}

                {/* Bottom navigation */}
                <div
                  className="
                    mt-10
                    flex
                    justify-start
                  "
                >
                  <Link
                    href="/sources"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-lg
                      border
                      border-[#3A352D]
                      px-5
                      py-3
                      text-sm
                      text-[#A09682]
                      transition
                      hover:border-[#D4AF37]/50
                      hover:text-[#D4AF37]
                    "
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to All Sources
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}