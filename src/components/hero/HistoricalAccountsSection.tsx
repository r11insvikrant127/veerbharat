"use client";

import {
  BookOpen,
  Landmark,
  ScrollText,
} from "lucide-react";

interface HistoricalSection {
  heading: string;
  content: string;
}

interface HistoricalAccount {
  title: string;

  period?: string;
  type?: string;
  source?: string;
  reliability?: string;

  description?: string;

  establishes?: string[];

  doesNotEstablish?: string[];

  doesNotMention?: string[];

  sections?: HistoricalSection[];
}

interface HistoricalAccountsSectionProps {
  accounts?: HistoricalAccount[];
}

function AccountIcon({
  type,
}: {
  type?: string;
}) {
  const normalizedType =
    type?.toLowerCase() ?? "";

  if (
    normalizedType.includes("primary") ||
    normalizedType.includes("historical evidence") ||
    normalizedType.includes("inscription")
  ) {
    return (
      <Landmark className="w-5 h-5" />
    );
  }

  if (
    normalizedType.includes("literary") ||
    normalizedType.includes("legend")
  ) {
    return (
      <BookOpen className="w-5 h-5" />
    );
  }

  return (
    <ScrollText className="w-5 h-5" />
  );
}

function BulletList({
  title,
  items,
}: {
  title: string;
  items?: string[];
}) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 rounded-xl border border-[#D4AF37]/15 bg-[#17130F]/60 p-6">
      <h3 className="font-serif text-xl font-bold text-[#F8F5F0] mb-4">
        {title}
      </h3>

      <ul className="space-y-3 list-disc pl-5 text-[#D7C9A5]">
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HistoricalAccountsSection({
  accounts,
}: HistoricalAccountsSectionProps) {
  if (!accounts || accounts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6 mt-6">

      {/* MAIN HEADING */}

      <div className="section-card-hover p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/60 mb-3">
          Sources & Traditions
        </p>

        <h2 className="font-serif text-3xl font-bold">
          Historical Accounts
        </h2>

        <p className="mt-4 text-[#A09682] leading-7">
          Historical figures can be remembered through
          inscriptions, contemporary chronicles, literary works,
          regional traditions and later historical accounts.
          Where different traditions exist, they are presented
          separately to distinguish historical evidence from
          later interpretation and literary memory.
        </p>
      </div>

      {/* ACCOUNTS */}

      {accounts.map((account, index) => (
        <article
          key={`${account.title}-${index}`}
          className="section-card-hover p-8 md:p-10"
        >

          {/* HEADER */}

          <div className="flex items-start gap-4 mb-7">

            <div className="shrink-0 w-11 h-11 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 flex items-center justify-center text-[#D4AF37]">
              <AccountIcon
                type={account.type}
              />
            </div>

            <div className="min-w-0">

              <div className="flex flex-wrap gap-2 mb-3">

                {account.period && (
                  <span className="px-3 py-1 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-xs uppercase tracking-wider text-[#D4AF37]">
                    {account.period}
                  </span>
                )}

                {account.type && (
                  <span className="px-3 py-1 rounded-full border border-[#A09682]/20 text-xs text-[#A09682]">
                    {account.type}
                  </span>
                )}

              </div>

              <h3 className="font-serif text-2xl md:text-3xl font-bold">
                {account.title}
              </h3>

              {account.source && (
                <p className="mt-2 text-sm text-[#D4AF37]/70">
                  Source: {account.source}
                </p>
              )}

            </div>
          </div>

          {/* RELIABILITY */}

          {account.reliability && (
            <div className="mb-6 px-5 py-4 rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/5">
              <p className="text-sm text-[#D7C9A5]">
                <span className="text-[#D4AF37] font-medium">
                  Historical context:
                </span>{" "}
                {account.reliability}
              </p>
            </div>
          )}

          {/* DESCRIPTION */}

          {account.description && (
            <div className="space-y-5 text-[#D7C9A5] leading-8">
              {account.description
                .split(/\n\s*\n/)
                .filter(Boolean)
                .map((paragraph, paragraphIndex) => (
                  <p
                    key={`${paragraphIndex}-${paragraph.slice(0, 20)}`}
                  >
                    {paragraph.trim()}
                  </p>
                ))}
            </div>
          )}

          {/* WHAT IT ESTABLISHES */}

          <BulletList
            title="What this account establishes"
            items={account.establishes}
          />

          {/* WHAT IT DOES NOT ESTABLISH */}

          <BulletList
            title="What this account does not establish"
            items={account.doesNotEstablish}
          />

          {/* WHAT IT DOES NOT MENTION */}

          <BulletList
            title="What this account does not mention"
            items={account.doesNotMention}
          />

          {/* SUBSECTIONS */}

          {account.sections &&
            account.sections.length > 0 && (
              <div className="mt-8 space-y-5">

                {account.sections.map(
                  (section, sectionIndex) => (
                    <div
                      key={`${section.heading}-${sectionIndex}`}
                      className="rounded-xl border border-[#D4AF37]/15 bg-[#17130F]/50 p-6"
                    >
                      <h4 className="font-serif text-xl font-bold mb-4 text-[#F8F5F0]">
                        {section.heading}
                      </h4>

                      <div className="space-y-4 text-[#D7C9A5] leading-8">
                        {section.content
                          .split(/\n\s*\n/)
                          .filter(Boolean)
                          .map(
                            (
                              paragraph,
                              paragraphIndex
                            ) => (
                              <p
                                key={`${paragraphIndex}-${paragraph.slice(
                                  0,
                                  20
                                )}`}
                              >
                                {paragraph.trim()}
                              </p>
                            )
                          )}
                      </div>
                    </div>
                  )
                )}

              </div>
            )}

        </article>
      ))}

    </section>
  );
}