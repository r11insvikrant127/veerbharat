import Event from "@/models/event";
import Battle from "@/models/battle";
import Hero from "@/models/hero";
import HistoricalPersonality from "@/models/historicalPersonality";
import { connectDB } from "@/lib/mongoose";

export interface OnThisDayItem {
  id: string;
  name: string;
  year: number | null;
  description: string;
  href: string;
  type:
    | "event"
    | "battle"
    | "hero"
    | "personality";
}

/**
 * Get the current month and day in Indian Standard Time.
 *
 * This ensures that "On This Day" changes according to
 * India time even if the Render server is running in UTC.
 */
function getIndiaMonthDay() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());

  const month = Number(
    parts.find((part) => part.type === "month")?.value
  );

  const day = Number(
    parts.find((part) => part.type === "day")?.value
  );

  return { month, day };
}

/**
 * Extract year from a Date.
 */
function getYear(date: Date | null | undefined): number | null {
  if (!date) return null;

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.getUTCFullYear();
}

/**
 * Returns all published historical records associated
 * with today's month/day.
 */
export async function getOnThisDayHistory(): Promise<
  OnThisDayItem[]
> {
  await connectDB();

  const { month, day } = getIndiaMonthDay();

  /*
   * MongoDB's $month and $dayOfMonth operate on dates.
   *
   * timezone is explicitly set to Asia/Kolkata so that
   * the anniversary date is interpreted according to
   * Indian time rather than the Render server timezone.
   */
  const dateExpression = (field: string) => ({
    $and: [
      { $ne: [`$${field}`, null] },
      {
        $eq: [
          {
            $month: {
              date: `$${field}`,
              timezone: "Asia/Kolkata",
            },
          },
          month,
        ],
      },
      {
        $eq: [
          {
            $dayOfMonth: {
              date: `$${field}`,
              timezone: "Asia/Kolkata",
            },
          },
          day,
        ],
      },
    ],
  });

  /*
   * Fetch all four categories in parallel.
   */
  const [
    events,
    battles,
    heroes,
    personalities,
  ] = await Promise.all([
    Event.find({
      status: "Published",
      $or: [
        {
          $expr: dateExpression("eventDate"),
        },
        {
          $expr: dateExpression("eventEndDate"),
        },
      ],
    })
      .select(
        "eventId name type eventDate eventEndDate description shortDescription heroIds"
      )
      .populate({
        path: "heroIds",
        select: "heroId name",
      })
      .lean(),

    Battle.find({
      status: "Published",
      $or: [
        {
          $expr: dateExpression("battleDate"),
        },
        {
          $expr: dateExpression("battleEndDate"),
        },
      ],
    })
      .select(
        "battleId name battleDate battleEndDate shortDescription description"
      )
      .lean(),

    Hero.find({
      status: "Published",
      $or: [
        {
          $expr: dateExpression("birthDate"),
        },
        {
          $expr: dateExpression("deathDate"),
        },
      ],
    })
      .select(
        "heroId name birthDate deathDate shortDescription biography causeOfDeath tags"
      )
      .lean(),

    HistoricalPersonality.find({
      status: {
        $regex: /^published$/i,
      },
      $or: [
        {
          $expr: dateExpression("birthDate"),
        },
        {
          $expr: dateExpression("deathDate"),
        },
      ],
    })
      .select(
        "historicalPersonalityId name birthDate deathDate shortDescription biography"
      )
      .lean(),
  ]);

  const items: OnThisDayItem[] = [];

  /*
   * EVENTS
   */
  for (const event of events) {
    const eventDate = event.eventDate
      ? new Date(event.eventDate)
      : null;

    const eventEndDate = event.eventEndDate
      ? new Date(event.eventEndDate)
      : null;

    const matchingDate =
      eventDate &&
      new Date(eventDate).getUTCMonth() + 1 === month &&
      new Date(eventDate).getUTCDate() === day
        ? eventDate
        : eventEndDate;

    let description =
      event.shortDescription ||
      event.description ||
      "";

    /*
     * If this is a personal event and a Hero is linked,
     * preserve the existing "Birth of X / Death of X /
     * Martyrdom of X" style.
     */
    const hero =
      Array.isArray(event.heroIds) &&
      event.heroIds.length > 0
        ? event.heroIds[0]
        : null;

    if (
      hero &&
      typeof hero === "object" &&
      "name" in hero
    ) {
      if (event.type === "Birth") {
        description = `Birth of ${hero.name}.`;
      } else if (event.type === "Death") {
        description = `Death of ${hero.name}.`;
      } else if (event.type === "Martyrdom") {
        description = `Martyrdom of ${hero.name}.`;
      }
    }

    items.push({
      id: event.eventId,
      name: event.name,
      year: matchingDate
        ? getYear(matchingDate)
        : null,
      description,
      href: `/events/${event.eventId}`,
      type: "event",
    });
  }

  /*
   * BATTLES
   */
  for (const battle of battles) {
    const battleDate = battle.battleDate
      ? new Date(battle.battleDate)
      : null;

    const battleEndDate = battle.battleEndDate
      ? new Date(battle.battleEndDate)
      : null;

    const matchingDate =
      battleDate &&
      new Date(battleDate).getUTCMonth() + 1 === month &&
      new Date(battleDate).getUTCDate() === day
        ? battleDate
        : battleEndDate;

    items.push({
      id: battle.battleId,
      name: battle.name,
      year: matchingDate
        ? getYear(matchingDate)
        : null,
      description:
        battle.shortDescription ||
        battle.description ||
        "",
      href: `/battles/${battle.battleId}`,
      type: "battle",
    });
  }

  /*
   * HEROES
   */
  for (const hero of heroes) {
    const birthDate = hero.birthDate
      ? new Date(hero.birthDate)
      : null;

    const deathDate = hero.deathDate
      ? new Date(hero.deathDate)
      : null;

    const birthMatches =
      birthDate &&
      birthDate.getUTCMonth() + 1 === month &&
      birthDate.getUTCDate() === day;

    const deathMatches =
      deathDate &&
      deathDate.getUTCMonth() + 1 === month &&
      deathDate.getUTCDate() === day;

    /*
     * Prefer death date when both dates somehow
     * fall on the same month/day.
     */
    const matchingDate = deathMatches
      ? deathDate
      : birthMatches
        ? birthDate
        : null;

    if (!matchingDate) continue;

    const isDeath = Boolean(deathMatches);

    const isMartyrdom =
      isDeath &&
      (
        /martyr|martyred|killed in action|died in battle|battlefield/i.test(
          hero.causeOfDeath || ""
        ) ||
        (hero.tags || []).some((tag: string) =>
          /martyr|martyrdom/i.test(tag)
        )
      );

    let description =
      hero.shortDescription ||
      (
        typeof hero.biography === "string"
          ? hero.biography
          : ""
      ) ||
      "";

    if (isMartyrdom) {
      description = `Martyrdom of ${hero.name}.`;
    } else if (isDeath) {
      description = `Death of ${hero.name}.`;
    } else {
      description = `Birth of ${hero.name}.`;
    }

    items.push({
      id: hero.heroId,
      name: hero.name,
      year: getYear(matchingDate),
      description,
      href: `/heroes/${hero.heroId}`,
      type: "hero",
    });
  }

  /*
   * HISTORICAL PERSONALITIES
   */
  for (const personality of personalities) {
    const birthDate = personality.birthDate
      ? new Date(personality.birthDate)
      : null;

    const deathDate = personality.deathDate
      ? new Date(personality.deathDate)
      : null;

    const birthMatches =
      birthDate &&
      birthDate.getUTCMonth() + 1 === month &&
      birthDate.getUTCDate() === day;

    const deathMatches =
      deathDate &&
      deathDate.getUTCMonth() + 1 === month &&
      deathDate.getUTCDate() === day;

    const matchingDate = deathMatches
      ? deathDate
      : birthMatches
        ? birthDate
        : null;

    if (!matchingDate) continue;

    const description =
      personality.shortDescription ||
      (
        typeof personality.biography === "string"
          ? personality.biography
          : ""
      ) ||
      (
        deathMatches
          ? `Death of ${personality.name}.`
          : `Birth of ${personality.name}.`
      );

    items.push({
      id: personality.historicalPersonalityId,
      name: personality.name,
      year: getYear(matchingDate),
      description,
      href: `/historical-personalities/${personality.historicalPersonalityId}`,
      type: "personality",
    });
  }

  /*
   * Oldest historical year first.
   *
   * Records without a year are placed at the end.
   */
  items.sort((a, b) => {
    if (a.year === null && b.year === null) {
      return a.name.localeCompare(b.name);
    }

    if (a.year === null) return 1;
    if (b.year === null) return -1;

    return a.year - b.year;
  });

  return items;
}