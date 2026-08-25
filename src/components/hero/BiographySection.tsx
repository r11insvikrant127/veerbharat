"use client";

interface BiographySectionProps {
  biography: string;
  heroName: string;
}

function splitBiography(biography: string) {
  return biography
    .replace(/\s+/g, " ")
    .trim()
    .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
    ?.map((sentence) => sentence.trim())
    .filter(Boolean) ?? [];
}

function highlightText(
  text: string,
  heroName: string
) {
  const parts = text.split(
    new RegExp(
      `(${heroName.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      )}|\\b(?:1[0-9]{3}|20[0-9]{2})\\b|\\b\\d{1,2}\\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\\s+\\d{4}\\b)`,
      "gi"
    )
  );

  return parts.map((part, index) => {
    const isHero =
      part.toLowerCase() === heroName.toLowerCase();

    const isDate =
      /^(?:1[0-9]{3}|20[0-9]{2})$/.test(part) ||
      /^\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}$/i.test(
        part
      );

    if (isHero || isDate) {
      return (
        <strong
          key={index}
          className="text-[#D4AF37] font-semibold"
        >
          {part}
        </strong>
      );
    }

    return part;
  });
}

export function BiographySection({
  biography,
  heroName,
}: BiographySectionProps) {
  const sentences = splitBiography(biography);

  if (!sentences.length) {
    return null;
  }

  return (
    <div className="section-card-hover p-8 md:p-10 mt-6">
      <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/60 mb-3">
        Chronicle
      </p>

      <h2 className="font-serif text-3xl font-bold mb-8">
        Biography
      </h2>

      <div className="relative space-y-5">
        <div className="absolute left-[15px] top-3 bottom-3 w-px bg-[#D4AF37]/20" />

        {sentences.map((sentence, index) => (
          <div
            key={`${index}-${sentence.slice(0, 20)}`}
            className="relative flex gap-5"
          >
            <div className="relative z-10 shrink-0 w-8 h-8 rounded-full border border-[#D4AF37]/40 bg-[#17130F] flex items-center justify-center">
              <span className="text-[10px] text-[#D4AF37] font-semibold">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="pb-2 pt-1">
              <p className="text-[#D7C9A5] leading-8">
                {highlightText(sentence, heroName)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}