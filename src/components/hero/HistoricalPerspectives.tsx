"use client";

import Link from "next/link";
import { Fragment, type ReactNode } from "react";

interface HistoricalDetail {
  label: string;
  content: string;
}

interface HistoricalSource {
  title?: string;
  author?: string;
  date?: string;
  type?: string;
}

export interface HistoricalPerspective {
  title: string;

  source?: HistoricalSource;

  classification?: string;

  description?: string;

  details?: HistoricalDetail[];
}

interface HistoricalPerspectivesProps {
  perspectives?: HistoricalPerspective[];
}

const heroLinks = [
  {
    names: ["Gora Singh", "Gora"],
    displayName: "Gora Singh",
    heroId: "HER0014",
  },
  {
    names: ["Badal Singh", "Badal"],
    displayName: "Badal Singh",
    heroId: "HER0012",
  },
];

function renderHeroLinks(text: string): ReactNode[] {
  const pattern =
    /\bGora Singh\b|\bBadal Singh\b|\bGora\b|\bBadal\b/g;

  const parts = text.split(pattern);

  const matches = text.match(pattern) || [];

  return parts.flatMap((part, index) => {
    const nodes: ReactNode[] = [];

    if (part) {
      nodes.push(
        <Fragment key={`text-${index}`}>
          {part}
        </Fragment>
      );
    }

    const match = matches[index];

    if (match) {
      const hero = heroLinks.find((item) =>
        item.names.includes(match)
      );

      if (hero) {
        nodes.push(
          <Link
            key={`hero-${index}`}
            href={`/heroes/${hero.heroId}`}
            className="text-[#D4AF37] font-medium hover:text-[#F8F5F0] underline underline-offset-4 decoration-[#D4AF37]/40 hover:decoration-[#D4AF37] transition-colors"
          >
            {hero.displayName}
          </Link>
        );
      }
    }

    return nodes;
  });
}

export function HistoricalPerspectives({
  perspectives,
}: HistoricalPerspectivesProps) {
  if (!perspectives || perspectives.length === 0) {
    return null;
  }

  return (
    <section className="section-card-hover p-8 md:p-10 mt-6">
      <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/60 mb-3">
        Historical Record
      </p>

      <h2 className="font-serif text-3xl font-bold mb-4">
        Historical Perspectives & Traditions
      </h2>

      <p className="text-[#A09682] leading-7 mb-10 max-w-4xl">
        Historical figures can be described differently across
        inscriptions, contemporary chronicles, later historical
        accounts, literary traditions, and regional legends. The
        following perspectives are presented separately so that
        historical evidence and later tradition are not confused
        with one another.
      </p>

      <div className="space-y-10">
        {perspectives.map((perspective, index) => (
          <article
            key={`${perspective.title}-${index}`}
            className="relative pl-6 border-l border-[#D4AF37]/30"
          >
            <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-[#D4AF37]" />

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {perspective.classification && (
                <span className="px-3 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[10px] uppercase tracking-[0.18em] text-[#D4AF37]">
                  {perspective.classification}
                </span>
              )}

              {perspective.source?.date && (
                <span className="text-sm text-[#A09682]">
                  {perspective.source.date}
                </span>
              )}
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#F8F5F0]">
              {perspective.title}
            </h3>

            {perspective.source && (
              <div className="mt-3 text-sm text-[#A09682] space-y-1">
                {perspective.source.title && (
                  <p>
                    <span className="text-[#D7C9A5]">
                      Source:
                    </span>{" "}
                    {perspective.source.title}
                  </p>
                )}

                {perspective.source.author && (
                  <p>
                    <span className="text-[#D7C9A5]">
                      Author:
                    </span>{" "}
                    {perspective.source.author}
                  </p>
                )}

                {perspective.source.type && (
                  <p>
                    <span className="text-[#D7C9A5]">
                      Type:
                    </span>{" "}
                    {perspective.source.type}
                  </p>
                )}
              </div>
            )}

            {perspective.description && (
              <p className="mt-5 text-[#D7C9A5] leading-8">
                {renderHeroLinks(perspective.description)}
              </p>
            )}

            {perspective.details &&
              perspective.details.length > 0 && (
                <div className="mt-6 space-y-5">
                  {perspective.details.map(
                    (detail, detailIndex) => (
                      <div
                        key={`${detail.label}-${detailIndex}`}
                        className="rounded-xl border border-[#D4AF37]/10 bg-[#17130F]/60 p-5"
                      >
                        <h4 className="text-sm font-semibold text-[#D4AF37] mb-2">
                          {detail.label}
                        </h4>

                        <p className="text-sm text-[#D7C9A5] leading-7">
                          {renderHeroLinks(detail.content)}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
          </article>
        ))}
      </div>
    </section>
  );
}