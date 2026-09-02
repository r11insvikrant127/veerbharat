"use client";

import type { ReactNode } from "react";
import Link from "next/link";

interface HistoricalPersonalityReference {
  historicalPersonalityId: string;
  name: string;
  alternativeNames?: string[];
}

interface BiographySectionProps {
  biography?: string;
  heroName: string;
  historicalPersonalities?: HistoricalPersonalityReference[];
}

/* =====================================================
   CLEAN BIOGRAPHY TEXT
===================================================== */

function cleanBiographyText(text: string): string {
  return text
    .replace(
      /:contentReference\[oaicite:\d+\]\{index=\d+\}/gi,
      ""
    )
    .replace(/[ \t]+/g, " ")
    .trim();
}

/* =====================================================
   HIGHLIGHT HERO NAME + DATES
===================================================== */

function highlightText(
  text: string,
  heroName: string,
  historicalPersonalities: HistoricalPersonalityReference[]
): ReactNode[] {
  const escapeRegExp = (value: string) =>
    value.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

  /*
   * HERO NAME
   */
  const heroCandidate = heroName.trim();

  /*
   * HISTORICAL PERSONALITY NAMES + ALIASES
   */
  const personalityCandidates =
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

        const candidates = [
          {
            person,
            name: fullName,
          },
        ];

        if (Array.isArray(person.alternativeNames)) {
          for (const alternativeName of person.alternativeNames) {
            const alias = alternativeName?.trim();

            if (
              alias &&
              alias.toLowerCase() !==
                fullName.toLowerCase()
            ) {
              candidates.push({
                person,
                name: alias,
              });
            }
          }
        }

        return candidates;
      })
      .sort(
        (a, b) =>
          b.name.length - a.name.length
      );

  /*
   * BUILD MATCHING PATTERN
   *
   * Longest names first prevents:
   *
   * "Muhammad Ali Jinnah"
   *
   * being partially matched as:
   *
   * "Ali Jinnah"
   */
  const names = [
    heroCandidate,
    ...personalityCandidates.map(
      (candidate) => candidate.name
    ),
  ].filter(Boolean);

  const uniqueNames = Array.from(
    new Set(
      names.map((name) =>
        name.toLowerCase()
      )
    )
  ).map((lowerName) =>
    names.find(
      (name) =>
        name.toLowerCase() ===
        lowerName
    )!
  );

  uniqueNames.sort(
    (a, b) =>
      b.length - a.length
  );

  const pattern = uniqueNames
    .map(escapeRegExp)
    .join("|");

  /*
   * DATES
   */
  const datePattern =
    "\\b(?:1[0-9]{3}|20[0-9]{2})\\b|\\b\\d{1,2}\\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\\s+\\d{4}\\b";

  const regex = new RegExp(
    `(${pattern}|${datePattern})`,
    "gi"
  );

  return text
    .split(regex)
    .map((part, index) => {
      const normalizedPart =
        part.trim().toLowerCase();

      /*
       * HERO NAME
       */
      if (
        normalizedPart ===
        heroCandidate.toLowerCase()
      ) {
        return (
          <strong
            key={index}
            className="text-[#D4AF37] font-semibold"
          >
            {part}
          </strong>
        );
      }

      /*
       * HISTORICAL PERSONALITY
       */
      const personalityCandidate =
        personalityCandidates.find(
          (candidate) =>
            candidate.name
              .toLowerCase() ===
            normalizedPart
        );

      if (personalityCandidate) {
        return (
          <Link
            key={`person-${personalityCandidate.person.historicalPersonalityId}-${index}`}
            href={`/historical-personalities/${encodeURIComponent(
              personalityCandidate.person
                .historicalPersonalityId
            )}`}
            className="text-[#D4AF37] hover:text-[#F0D878] underline underline-offset-4 decoration-[#D4AF37]/30 hover:decoration-[#D4AF37] transition-colors"
          >
            {part}
          </Link>
        );
      }

      /*
       * YEAR
       */
      const isYear =
        /^(?:1[0-9]{3}|20[0-9]{2})$/.test(
          part
        );

      /*
       * FULL DATE
       */
      const isFullDate =
        /^\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}$/i.test(
          part
        );

      if (isYear || isFullDate) {
        return (
          <strong
            key={index}
            className="text-[#D4AF37] font-semibold"
          >
            {part}
          </strong>
        );
      }

      return (
        <span key={index}>
          {part}
        </span>
      );
    });
}

/* =====================================================
   PARSE BIOGRAPHY
===================================================== */

type BiographyBlock =
  | {
      type: "heading";
      text: string;
    }
  | {
      type: "subheading";
      text: string;
    }
  | {
      type: "paragraph";
      text: string;
    };

function parseBiography(
  biography?: string
): BiographyBlock[] {
  if (!biography) {
    return [];
  }

  const cleaned = cleanBiographyText(biography);

  const lines = cleaned.split("\n");

  const blocks: BiographyBlock[] = [];

  let paragraphLines: string[] = [];

  function saveParagraph() {
    const paragraph = paragraphLines
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (paragraph) {
      blocks.push({
        type: "paragraph",
        text: paragraph,
      });
    }

    paragraphLines = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      saveParagraph();
      continue;
    }

    /* =========================================
       MAIN SECTION
       ##
    ========================================= */

    const headingMatch =
      trimmed.match(/^##\s+(.+)$/);

    if (headingMatch) {
      saveParagraph();

      blocks.push({
        type: "heading",
        text: headingMatch[1].trim(),
      });

      continue;
    }

    /* =========================================
       SUBSECTION
       ###
    ========================================= */

    const subheadingMatch =
      trimmed.match(/^###\s+(.+)$/);

    if (subheadingMatch) {
      saveParagraph();

      blocks.push({
        type: "subheading",
        text: subheadingMatch[1].trim(),
      });

      continue;
    }

    /* =========================================
       NORMAL TEXT
    ========================================= */

    const cleanedLine = trimmed
      .replace(/^#\s+/, "")
      .trim();

    paragraphLines.push(cleanedLine);
  }

  saveParagraph();

  return blocks;
}

/* =====================================================
   COMPONENT
===================================================== */

export function BiographySection({
  biography,
  heroName,
  historicalPersonalities = [],
}: BiographySectionProps) {
  const blocks = parseBiography(biography);

  if (!blocks.length) {
    return null;
  }

  return (
    <div className="section-card-hover p-8 md:p-10 mt-6 overflow-hidden">

      {/* =============================================
          HEADER
      ============================================= */}

      <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/60 mb-3">
        Chronicle
      </p>

      <h2 className="font-serif text-3xl font-bold mb-8">
        Biography
      </h2>

      {/* =============================================
          BIOGRAPHY CONTENT
      ============================================= */}

      <div className="max-w-none min-w-0">

        {blocks.map((block, index) => {

          /* =========================================
             MAIN SECTION HEADING
             ##
          ========================================= */

          if (block.type === "heading") {
            return (
              <div
                key={`heading-${index}`}
                className="
                  mt-12
                  mb-7
                  first:mt-0
                "
              >

                <h3
                  className="
                    font-serif
                    text-2xl
                    md:text-3xl
                    font-bold
                    text-[#F8F5F0]
                    break-words
                  "
                >
                  {block.text}
                </h3>

                {/* MAIN HEADING UNDERLINE */}

                <div
                  className="
                    mt-4
                    h-px
                    w-full
                    bg-gradient-to-r
                    from-[#D4AF37]/40
                    via-[#D4AF37]/10
                    to-transparent
                  "
                />

              </div>
            );
          }

          /* =========================================
             SUBSECTION
             ###
          ========================================= */

          if (block.type === "subheading") {
            return (
              <div
                key={`subheading-${index}`}
                className="
                  mt-8
                  mb-5
                "
              >

                <h4
                  className="
                    inline-block
                    font-serif
                    text-lg
                    md:text-xl
                    font-bold
                    text-[#F8F5F0]
                    break-words
                    underline
                    underline-offset-8
                    decoration-[#D4AF37]/50
                    decoration-1
                  "
                >
                  {block.text}
                </h4>

              </div>
            );
          }

          /* =========================================
             PARAGRAPH
          ========================================= */

          return (
            <p
              key={`paragraph-${index}`}
              className="
                text-[#D7C9A5]
                leading-8
                mb-7
                break-words
                whitespace-normal
                overflow-wrap-anywhere
              "
            >
              {highlightText(
                block.text,
                heroName,
                historicalPersonalities
              )}
            </p>
          );
        })}

      </div>
    </div>
  );
}