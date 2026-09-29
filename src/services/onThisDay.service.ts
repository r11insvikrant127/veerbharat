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
 * Extract year safely from a Date.
 */
function getYear(
  date: Date | null | undefined
): number | null {
  if (!date) return null;

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.getUTCFullYear();
}

/**
 * Safely match a BSON Date against today's
 * month/day in Asia/Kolkata.
 *
 * Important:
 * Some older records may contain an object instead
 * of a BSON Date. We must NOT pass those objects to
 * $month / $dayOfMonth.
 */
function dateExpression(
  field: string,
  month: number,
  day: number
) {
  return {
    $cond: [
      {
        $eq: [
          { $type: `$${field}` },
          "date",
        ],
      },

      {
        $and: [
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
      },

      false,
    ],
  };
}


/**
 * Get all published records associated
 * with today's month/day.
 */
export async function getOnThisDayHistory(): Promise<
  OnThisDayItem[]
> {
  await connectDB();

  const { month, day } =
    getIndiaMonthDay();

  /*
   * ----------------------------------------------------------
   * FETCH EVENTS
   * ----------------------------------------------------------
   */

  const events = await Event.find({
    status: "Published",

    $or: [
      {
        $expr: dateExpression(
          "eventDate",
          month,
          day
        ),
      },

      {
        $expr: dateExpression(
          "eventEndDate",
          month,
          day
        ),
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
    .lean();


  /*
   * ----------------------------------------------------------
   * FETCH BATTLES
   * ----------------------------------------------------------
   */

  const battles = await Battle.find({
    status: "Published",

    $or: [
      {
        $expr: dateExpression(
          "battleDate",
          month,
          day
        ),
      },

      {
        $expr: dateExpression(
          "battleEndDate",
          month,
          day
        ),
      },
    ],
  })
    .select(
      "battleId name battleDate battleEndDate shortDescription description"
    )
    .lean();


  /*
   * ----------------------------------------------------------
   * FETCH HEROES
   * ----------------------------------------------------------
   */

  const heroes = await Hero.find({
    status: "Published",

    $or: [
      {
        $expr: dateExpression(
          "birthDate",
          month,
          day
        ),
      },

      {
        $expr: dateExpression(
          "deathDate",
          month,
          day
        ),
      },
    ],
  })
    .select(
      "heroId name birthDate deathDate shortDescription biography causeOfDeath tags"
    )
    .lean();


  /*
   * ----------------------------------------------------------
   * FETCH HISTORICAL PERSONALITIES
   * ----------------------------------------------------------
   */

  const personalities =
    await HistoricalPersonality.find({
      status: {
        $regex: /^published$/i,
      },

      $or: [
        {
          $expr: dateExpression(
            "birthDate",
            month,
            day
          ),
        },

        {
          $expr: dateExpression(
            "deathDate",
            month,
            day
          ),
        },
      ],
    })
      .select(
        "historicalPersonalityId name birthDate deathDate shortDescription biography"
      )
      .lean();


  /*
   * ----------------------------------------------------------
   * BUILD RESULT
   * ----------------------------------------------------------
   */

  const items: OnThisDayItem[] = [];


  /*
   * EVENTS
   */

  for (const event of events) {

    const eventDate =
      event.eventDate instanceof Date
        ? event.eventDate
        : null;

    const eventEndDate =
      event.eventEndDate instanceof Date
        ? event.eventEndDate
        : null;

    const startMatches =
      eventDate &&
      eventDate.getUTCMonth() + 1 === month &&
      eventDate.getUTCDate() === day;

    const endMatches =
      eventEndDate &&
      eventEndDate.getUTCMonth() + 1 === month &&
      eventEndDate.getUTCDate() === day;

    const matchingDate =
      startMatches
        ? eventDate
        : endMatches
          ? eventEndDate
          : null;

    let description =
      event.shortDescription ||
      event.description ||
      "";

    /*
     * Preserve existing Birth / Death /
     * Martyrdom presentation when a hero is linked.
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
        description =
          `Birth of ${hero.name}.`;
      } else if (event.type === "Death") {
        description =
          `Death of ${hero.name}.`;
      } else if (event.type === "Martyrdom") {
        description =
          `Martyrdom of ${hero.name}.`;
      }
    }

    items.push({
      id: event.eventId,
      name: event.name,

      year: matchingDate
        ? getYear(matchingDate)
        : null,

      description,

      href:
        `/events/${event.eventId}`,

      type: "event",
    });
  }


  /*
   * BATTLES
   */

  for (const battle of battles) {

    const battleDate =
      battle.battleDate instanceof Date
        ? battle.battleDate
        : null;

    const battleEndDate =
      battle.battleEndDate instanceof Date
        ? battle.battleEndDate
        : null;

    const startMatches =
      battleDate &&
      battleDate.getUTCMonth() + 1 === month &&
      battleDate.getUTCDate() === day;

    const endMatches =
      battleEndDate &&
      battleEndDate.getUTCMonth() + 1 === month &&
      battleEndDate.getUTCDate() === day;

    const matchingDate =
      startMatches
        ? battleDate
        : endMatches
          ? battleEndDate
          : null;

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

      href:
        `/battles/${battle.battleId}`,

      type: "battle",
    });
  }


  /*
   * HEROES
   */

  for (const hero of heroes) {

    const birthDate =
      hero.birthDate instanceof Date
        ? hero.birthDate
        : null;

    const deathDate =
      hero.deathDate instanceof Date
        ? hero.deathDate
        : null;

    const birthMatches =
      birthDate &&
      birthDate.getUTCMonth() + 1 === month &&
      birthDate.getUTCDate() === day;

    const deathMatches =
      deathDate &&
      deathDate.getUTCMonth() + 1 === month &&
      deathDate.getUTCDate() === day;

    const matchingDate =
      deathMatches
        ? deathDate
        : birthMatches
          ? birthDate
          : null;

    if (!matchingDate) {
      continue;
    }

    const isDeath =
      Boolean(deathMatches);

    const isMartyrdom =
      isDeath &&
      (
        /martyr|martyred|killed in action|died in battle|battlefield/i.test(
          hero.causeOfDeath || ""
        ) ||

        (hero.tags || []).some(
          (tag: string) =>
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

      description =
        `Martyrdom of ${hero.name}.`;

    } else if (isDeath) {

      description =
        `Death of ${hero.name}.`;

    } else {

      description =
        `Birth of ${hero.name}.`;
    }

    items.push({
      id: hero.heroId,

      name: hero.name,

      year:
        getYear(matchingDate),

      description,

      href:
        `/heroes/${hero.heroId}`,

      type: "hero",
    });
  }


  /*
   * HISTORICAL PERSONALITIES
   */

  for (const personality of personalities) {

    const birthDate =
      personality.birthDate instanceof Date
        ? personality.birthDate
        : null;

    const deathDate =
      personality.deathDate instanceof Date
        ? personality.deathDate
        : null;

    const birthMatches =
      birthDate &&
      birthDate.getUTCMonth() + 1 === month &&
      birthDate.getUTCDate() === day;

    const deathMatches =
      deathDate &&
      deathDate.getUTCMonth() + 1 === month &&
      deathDate.getUTCDate() === day;

    const matchingDate =
      deathMatches
        ? deathDate
        : birthMatches
          ? birthDate
          : null;

    if (!matchingDate) {
      continue;
    }

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
      id:
        personality.historicalPersonalityId,

      name:
        personality.name,

      year:
        getYear(matchingDate),

      description,

      href:
        `/historical-personalities/${personality.historicalPersonalityId}`,

      type: "personality",
    });
  }


  /*
   * Oldest historical year first.
   * Records without a year go at the end.
   */

  items.sort((a, b) => {

    if (
      a.year === null &&
      b.year === null
    ) {
      return a.name.localeCompare(
        b.name
      );
    }

    if (a.year === null) {
      return 1;
    }

    if (b.year === null) {
      return -1;
    }

    return a.year - b.year;
  });


  return items;
}