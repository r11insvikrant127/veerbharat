"use client";

import type { ReactNode } from "react";

interface BiographySectionProps {
  biography?: string;
  heroName: string;
}

/* =====================================================
   CLEAN BIOGRAPHY TEXT
===================================================== */

function cleanBiographyText(text: string): string {
  return text
    // Remove accidental AI/source citation artifacts
    .replace(
      /:contentReference\[oaicite:\d+\]\{index=\d+\}/gi,
      ""
    )
    // Remove any remaining excessive whitespace
    .replace(/[ \t]+/g, " ")
    .trim();
}

/* =====================================================
   HIGHLIGHT HERO NAME + DATES
===================================================== */

function highlightText(
  text: string,
  heroName: string
): ReactNode[] {
  const escapedHeroName = heroName.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const pattern = new RegExp(
    `(${escapedHeroName}|\\b(?:1[0-9]{3}|20[0-9]{2})\\b|\\b\\d{1,2}\\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\\s+\\d{4}\\b)`,
    "gi"
  );

  return text.split(pattern).map((part, index) => {
    const isHero =
      part.toLowerCase() === heroName.toLowerCase();

    const isYear =
      /^(?:1[0-9]{3}|20[0-9]{2})$/.test(part);

    const isFullDate =
      /^\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}$/i.test(
        part
      );

    if (isHero || isYear || isFullDate) {
      return (
        <strong
          key={index}
          className="text-[#D4AF37] font-semibold"
        >
          {part}
        </strong>
      );
    }

    return <span key={index}>{part}</span>;
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
       MARKDOWN HEADING
       ## Heading
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
       REMOVE ANY ACCIDENTAL MARKDOWN HEADING
       SYMBOLS
    ========================================= */

    const cleanedLine = trimmed
      .replace(/^###\s+/, "")
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
          BIOGRAPHY
      ============================================= */}

      <div className="max-w-none min-w-0">

        {blocks.map((block, index) => {

          /* =========================================
             SECTION HEADING
          ========================================= */

          if (block.type === "heading") {
            return (
              <div
                key={`heading-${index}`}
                className="mt-10 mb-5 first:mt-0"
              >
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#F8F5F0] break-words">
                  {block.text}
                </h3>

                <div className="mt-4 h-px w-full bg-gradient-to-r from-[#D4AF37]/40 via-[#D4AF37]/10 to-transparent" />
              </div>
            );
          }

          /* =========================================
             PARAGRAPH
          ========================================= */

          return (
            <p
              key={`paragraph-${index}`}
              className="text-[#D7C9A5] leading-8 mb-7 break-words whitespace-normal overflow-wrap-anywhere"
            >
              {highlightText(
                block.text,
                heroName
              )}
            </p>
          );
        })}

      </div>
    </div>
  );
}