"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Swords,
  Shield,
  Crown,
  BookOpen,
  ScrollText,
  Users,
  Landmark,
  ExternalLink,
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface Reference {
  _id?: string;
  name?: string;
  title?: string;

  heroId?: string;
  historicalPersonalityId?: string;
  kingdomId?: string;
  eventId?: string;
  battleId?: string;
  bookId?: string;
  sourceId?: string;
  weaponId?: string;
  placeId?: string;
  imageId?: string;
}

interface Battle {
  _id: string;
  battleId: string;
  name: string;
  description: string;
  nativeName?: string;
  alternativeNames?: string[];

  battleDate?: string | null;
  battleDateAccuracy?: string;

  locationId?: Reference;
  historicalPeriodId?: Reference;

  kingdomIds?: Reference[];

  commanderIds?: Reference[];
  commanderPersonalityIds?: Reference[];

  opposingCommanderIds?: Reference[];
  opposingCommanderPersonalityIds?: Reference[];

  victorId?: Reference;
  victorModel?: "Hero" | "Kingdom";

    armySizes?: {
    attackers?: string;
    defenders?: string;
  };

  casualties?: {
    attackers?: string;
    defenders?: string;
  };

  weapons?: string[];

  tactics?: string[];

  terrain?: string;

  outcome?: string;

  keyEvents?: string[];

  significance?: string;

  aftermath?: string;

  imageIds?: Reference[];
  sourceIds?: Reference[];

  tags?: string[];

    crossReferences?: {
    relatedHeroes?: Reference[];
    relatedHistoricalPersonalities?: Reference[];
    relatedKingdoms?: Reference[];
    relatedWeapons?: Reference[];
    relatedPlaces?: Reference[];
    relatedEvents?: Reference[];
    relatedBattles?: Reference[];
    relatedBooks?: Reference[];
    relatedSources?: Reference[];
    relatedImages?: Reference[];
  };

  status: string;
}

function formatDate(
  date?: string | null,
  accuracy?: string
) {
  if (!date) {
    return "Date Unknown";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Date Unknown";
  }

  const formatted = parsed.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  if (accuracy && accuracy !== "Exact") {
    return `${formatted} (${accuracy})`;
  }

  return formatted;
}

function ReferenceCard({
  item,
  href,
  type,
}: {
  item: Reference;
  href?: string;
  type: string;
}) {
  const content = (
    <div className="group rounded-xl border border-[#D4AF37]/10 bg-[#1C1410]/60 p-4 transition-all duration-300 hover:border-[#D4AF37]/30 hover:bg-[#1C1410]">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/50 mb-1">
        {type}
      </p>

      <div className="flex items-center justify-between gap-3">
        <p className="font-serif text-lg text-[#F8F5F0] group-hover:text-[#D4AF37] transition-colors">
          {item.name || item.title || "Unnamed record"}
        </p>

        {href && (
          <ExternalLink className="w-4 h-4 shrink-0 text-[#D4AF37]/40 group-hover:text-[#D4AF37]" />
        )}
      </div>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href}>
      {content}
    </Link>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-center justify-center text-[#D4AF37]">
          {icon}
        </div>

        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#F8F5F0]">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function ReferenceGrid({
  items,
  type,
  hrefBuilder,
}: {
  items?: Reference[];
  type: string;
  hrefBuilder?: (item: Reference) => string | undefined;
}) {
  if (!items || items.length === 0) {
    return (
      <p className="text-sm text-[#A09682]">
        No records available.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <ReferenceCard
          key={
            item._id ||
            `${item.name}-${index}`
          }
          item={item}
          type={type}
          href={
            hrefBuilder
              ? hrefBuilder(item)
              : undefined
          }
        />
      ))}
    </div>
  );
}

export default function BattleDetailPage() {
  const params = useParams();
  const battleId = params?.battleId as string;

  const [battle, setBattle] =
    useState<Battle | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!battleId) {
      return;
    }

    async function fetchBattle() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/battles/${battleId}`
        );

        if (!response.ok) {
          throw new Error(
            "Battle could not be found."
          );
        }

        const result =
            await response.json();

            const battleData =
            result.data ?? result;

            setBattle(battleData);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load this battle record."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBattle();
  }, [battleId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0F0F0F] text-[#F8F5F0]">
        <Navbar />

        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />

          <p className="mt-5 text-[#A09682]">
            Opening the battlefield archives...
          </p>
        </div>

        <Footer />
      </main>
    );
  }

  if (error || !battle) {
    return (
      <main className="min-h-screen bg-[#0F0F0F] text-[#F8F5F0]">
        <Navbar />

        <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
          <Swords className="w-12 h-12 text-[#D4AF37] mb-5" />

          <h1 className="font-serif text-3xl font-bold mb-3">
            Battle Not Found
          </h1>

          <p className="text-[#A09682] mb-7">
            {error ||
              "This battle record does not exist."}
          </p>

          <Link
            href="/battles"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Battles
          </Link>
        </div>

        <Footer />
      </main>
    );
  }

  const refs =
    battle.crossReferences;

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F8F5F0]">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#D4AF37]/5 blur-3xl" />

          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#8B1E1E]/10 blur-3xl" />

          <div className="absolute top-40 right-10 w-72 h-72 rounded-full bg-[#D4AF37]/5 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-6">
          <Link
            href="/battles"
            className="inline-flex items-center gap-2 text-sm text-[#A09682] hover:text-[#D4AF37] transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Battles Archive
          </Link>

          <div className="max-w-5xl">
            <div className="flex items-center gap-3 mb-5">
              <Swords className="w-5 h-5 text-[#D4AF37]" />

              <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]/70">
                {battle.battleId}
              </span>

              <span className="px-3 py-1 rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/5 text-[10px] uppercase tracking-wider text-[#D7C9A5]">
                {battle.status}
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight">
              {battle.name}
            </h1>

            {battle.nativeName && (
              <p className="mt-3 text-xl text-[#A09682]">
                {battle.nativeName}
              </p>
            )}

            {battle.alternativeNames &&
              battle.alternativeNames.length > 0 && (
                <p className="mt-3 text-sm text-[#A09682]">
                  Also known as{" "}
                  {battle.alternativeNames.join(
                    ", "
                  )}
                </p>
              )}

            <div className="h-px w-full max-w-3xl bg-gradient-to-r from-[#D4AF37]/40 to-transparent my-8" />

            <p className="max-w-4xl text-lg leading-relaxed text-[#D7C9A5]">
              {battle.description}
            </p>
          </div>
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="pb-8">
        <div className="container mx-auto px-6">: 
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="section-card p-5">
              <CalendarDays className="w-5 h-5 text-[#D4AF37] mb-3" />

              <p className="text-[10px] uppercase tracking-[0.2em] text-[#A09682]">
                Battle Date
              </p>

              <p className="mt-1 text-[#F8F5F0]">
                {formatDate(
                  battle.battleDate,
                  battle.battleDateAccuracy
                )}
              </p>
            </div>

            <div className="section-card p-5">
              <MapPin className="w-5 h-5 text-[#D4AF37] mb-3" />

              <p className="text-[10px] uppercase tracking-[0.2em] text-[#A09682]">
                Location
              </p>

              <p className="mt-1 text-[#F8F5F0]">
                {battle.locationId?.name ||
                  "Unknown"}
              </p>
            </div>

            <div className="section-card p-5">
              <Shield className="w-5 h-5 text-[#D4AF37] mb-3" />

              <p className="text-[10px] uppercase tracking-[0.2em] text-[#A09682]">
                Historical Period
              </p>

              <p className="mt-1 text-[#F8F5F0]">
                {battle.historicalPeriodId
                  ?.name || "Unknown"}
              </p>
            </div>

            <div className="section-card p-5">
              <Crown className="w-5 h-5 text-[#D4AF37] mb-3" />

              <p className="text-[10px] uppercase tracking-[0.2em] text-[#A09682]">
                Victor
              </p>

              <p className="mt-1 text-[#F8F5F0]">
                {battle.victorId?.name ||
                  "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 pb-24 max-w-6xl">
        {/* COMMANDERS */}
        <Section
          title="Commanders"
          icon={<Users className="w-4 h-4" />}
        >
          <ReferenceGrid
            items={battle.commanderIds}
            type="Commander"
            hrefBuilder={(item) =>
              item.heroId
                ? `/heroes/${item.heroId}`
                : undefined
            }
          />

          {battle.commanderPersonalityIds &&
            battle.commanderPersonalityIds
              .length > 0 && (
              <div className="mt-5">
                <ReferenceGrid
                  items={
                    battle.commanderPersonalityIds
                  }
                  type="Historical Personality"
                  hrefBuilder={(item) =>
                    item.historicalPersonalityId
                      ? `/historical-personalities/${item.historicalPersonalityId}`
                      : undefined
                  }
                />
              </div>
            )}
        </Section>

        {/* OPPOSING COMMANDERS */}
        {((battle.opposingCommanderIds &&
          battle.opposingCommanderIds.length >
            0) ||
          (battle.opposingCommanderPersonalityIds &&
            battle.opposingCommanderPersonalityIds
              .length > 0)) && (
          <Section
            title="Opposing Commanders"
            icon={<Shield className="w-4 h-4" />}
          >
            <ReferenceGrid
              items={
                battle.opposingCommanderIds
              }
              type="Opposing Commander"
            />

            <div className="mt-5">
              <ReferenceGrid
                items={
                    battle.opposingCommanderPersonalityIds
                }
                type="Historical Personality"
                hrefBuilder={(item) =>
                    item.historicalPersonalityId
                    ? `/historical-personalities/${item.historicalPersonalityId}`
                    : undefined
                }
                />
            </div>
          </Section>
        )}

        {/* KINGDOMS */}
        <Section
          title="Kingdoms and Powers"
          icon={<Landmark className="w-4 h-4" />}
        >
          <ReferenceGrid
            items={battle.kingdomIds}
            type="Kingdom"
            hrefBuilder={(item) =>
              item.kingdomId
                ? `/kingdoms/${item.kingdomId}`
                : undefined
            }
          />

          <div className="mt-5">
            <ReferenceGrid
              items={refs?.relatedKingdoms}
              type="Related Kingdom"
              hrefBuilder={(item) =>
                item.kingdomId
                  ? `/kingdoms/${item.kingdomId}`
                  : undefined
              }
            />
          </div>
        </Section>
        
        {/* FORCES */}
        {battle.armySizes &&
          (battle.armySizes.attackers ||
            battle.armySizes.defenders) && (
            <Section
              title="Forces"
              icon={<Users className="w-4 h-4" />}
            >
              <div className="grid gap-4 md:grid-cols-2">
                {battle.armySizes.attackers && (
                  <div className="section-card p-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#A09682] mb-3">
                      Attackers
                    </p>

                    <p className="text-[#D7C9A5] leading-relaxed">
                      {battle.armySizes.attackers}
                    </p>
                  </div>
                )}

                {battle.armySizes.defenders && (
                  <div className="section-card p-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#A09682] mb-3">
                      Defenders
                    </p>

                    <p className="text-[#D7C9A5] leading-relaxed">
                      {battle.armySizes.defenders}
                    </p>
                  </div>
                )}
              </div>
            </Section>
          )}

                {/* CASUALTIES */}
        {battle.casualties &&
          (battle.casualties.attackers ||
            battle.casualties.defenders) && (
            <Section
              title="Casualties"
              icon={<Shield className="w-4 h-4" />}
            >
              <div className="grid gap-4 md:grid-cols-2">
                {battle.casualties.attackers && (
                  <div className="section-card p-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#A09682] mb-3">
                      Attackers
                    </p>

                    <p className="text-[#D7C9A5] leading-relaxed">
                      {battle.casualties.attackers}
                    </p>
                  </div>
                )}

                {battle.casualties.defenders && (
                  <div className="section-card p-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#A09682] mb-3">
                      Defenders
                    </p>

                    <p className="text-[#D7C9A5] leading-relaxed">
                      {battle.casualties.defenders}
                    </p>
                  </div>
                )}
              </div>
            </Section>
          )}

        {/* SIGNIFICANCE */}
        {battle.significance && (
          <Section
            title="Historical Significance"
            icon={
              <ScrollText className="w-4 h-4" />
            }
          >
            <div className="section-card p-7">
              <p className="text-[#D7C9A5] leading-relaxed whitespace-pre-line">
                {battle.significance}
              </p>
            </div>
          </Section>
        )}

        {/* KEY EVENTS */}
        {battle.keyEvents &&
          battle.keyEvents.length > 0 && (
            <Section
              title="Key Events of the Battle"
              icon={
                <Swords className="w-4 h-4" />
              }
            >
              <div className="space-y-3">
                {battle.keyEvents.map(
                  (event, index) => (
                    <div
                      key={`${event}-${index}`}
                      className="section-card p-5 flex gap-4"
                    >
                      <span className="text-[#D4AF37] font-serif text-lg">
                        {index + 1}
                      </span>

                      <p className="text-[#D7C9A5] leading-relaxed">
                        {event}
                      </p>
                    </div>
                  )
                )}
              </div>
            </Section>
          )}

        {/* TACTICS */}
        {battle.tactics &&
          battle.tactics.length > 0 && (
            <Section
              title="Tactics"
              icon={<Swords className="w-4 h-4" />}
            >
              <div className="flex flex-wrap gap-3">
                {battle.tactics.map(
                  (tactic, index) => (
                    <span
                      key={`${tactic}-${index}`}
                      className="px-4 py-2 rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/5 text-sm text-[#D7C9A5]"
                    >
                      {tactic}
                    </span>
                  )
                )}
              </div>
            </Section>
          )}

        {/* TERRAIN */}
        {battle.terrain && (
          <Section
            title="Terrain"
            icon={<MapPin className="w-4 h-4" />}
          >
            <div className="section-card p-7">
              <p className="text-[#D7C9A5] leading-relaxed whitespace-pre-line">
                {battle.terrain}
              </p>
            </div>
          </Section>
        )}

        {/* OUTCOME */}
        {battle.outcome && (
          <Section
            title="Outcome"
            icon={<Crown className="w-4 h-4" />}
          >
            <div className="section-card p-7">
              <p className="text-[#D7C9A5] leading-relaxed whitespace-pre-line">
                {battle.outcome}
              </p>
            </div>
          </Section>
        )}

        {/* AFTERMATH */}
        {battle.aftermath && (
          <Section
            title="Aftermath"
            icon={
              <ScrollText className="w-4 h-4" />
            }
          >
            <div className="section-card p-7">
              <p className="text-[#D7C9A5] leading-relaxed whitespace-pre-line">
                {battle.aftermath}
              </p>
            </div>
          </Section>
        )}

        {/* WEAPONS */}
        <Section
          title="Weapons and Military Technology"
          icon={<Swords className="w-4 h-4" />}
        >
        {battle.weapons &&
            battle.weapons.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {battle.weapons.map(
                  (weapon, index) => (
                    <span
                      key={`${weapon}-${index}`}
                      className="px-4 py-2 rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/5 text-sm text-[#D7C9A5]"
                    >
                      {weapon}
                    </span>
                  )
                )}
              </div>
            )}

          <div className="mt-5">
            <ReferenceGrid
              items={refs?.relatedWeapons}
              type="Related Weapon"
            />
          </div>
        </Section>

        {/* RELATED EVENTS */}
        <Section
          title="Related Historical Events"
          icon={
            <ScrollText className="w-4 h-4" />
          }
        >
          <ReferenceGrid
            items={refs?.relatedEvents}
            type="Event"
            hrefBuilder={(item) =>
              item.eventId
                ? `/events/${item.eventId}`
                : undefined
            }
          />
        </Section>

        {/* RELATED BATTLES */}
        <Section
          title="Related Battles"
          icon={<Swords className="w-4 h-4" />}
        >
          <ReferenceGrid
            items={refs?.relatedBattles}
            type="Battle"
            hrefBuilder={(item) =>
              item.battleId
                ? `/battles/${item.battleId}`
                : undefined
            }
          />
        </Section>
        
        {/* RELATED HEROES */}
        <Section
          title="Related Heroes"
          icon={<Users className="w-4 h-4" />}
        >
          <ReferenceGrid
            items={refs?.relatedHeroes}
            type="Hero"
            hrefBuilder={(item) =>
              item.heroId
                ? `/heroes/${item.heroId}`
                : undefined
            }
          />
        </Section>

        {/* RELATED HISTORICAL PERSONALITIES */}
        <Section
          title="Related Historical Personalities"
          icon={<Users className="w-4 h-4" />}
        >
          <ReferenceGrid
            items={
              refs?.relatedHistoricalPersonalities
            }
            type="Historical Personality"
            hrefBuilder={(item) =>
              item.historicalPersonalityId
                ? `/historical-personalities/${item.historicalPersonalityId}`
                : undefined
            }
          />
        </Section>

        {/* PLACES */}
        <Section
          title="Related Places"
          icon={<MapPin className="w-4 h-4" />}
        >
          <ReferenceGrid
            items={refs?.relatedPlaces}
            type="Place"
            hrefBuilder={(item) =>
              item.placeId
                ? `/places/${item.placeId}`
                : undefined
            }
          />
        </Section>

          {/* BOOKS */}
        <Section
          title="Related Books"
          icon={<BookOpen className="w-4 h-4" />}
        >
          <ReferenceGrid
            items={refs?.relatedBooks}
            type="Book"
            hrefBuilder={(item) =>
              item.bookId
                ? `/books/${item.bookId}`
                : undefined
            }
          />
        </Section>

        {/* SOURCES */}
        <Section
          title="Sources"
          icon={<BookOpen className="w-4 h-4" />}
        >
          <ReferenceGrid
            items={battle.sourceIds}
            type="Source"
            hrefBuilder={(item) =>
              item.sourceId
                ? `/sources/${item.sourceId}`
                : undefined
            }
          />
        </Section>

        {/* TAGS */}
        {battle.tags &&
          battle.tags.length > 0 && (
            <section className="mt-12">
              <div className="flex flex-wrap gap-2">
                {battle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/5 text-xs text-[#D4AF37]/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}
      </div>

      <Footer />
    </main>
  );
}