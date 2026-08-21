import { ApiPlace } from "@/types/place";
import { MapLocation } from "@/types/map";

const INDIA_BOUNDS = {
  minLatitude: 6,
  maxLatitude: 37,
  minLongitude: 68,
  maxLongitude: 98,
};

function getMapPosition(
  latitude: number,
  longitude: number
) {
  const x =
    ((longitude - INDIA_BOUNDS.minLongitude) /
      (INDIA_BOUNDS.maxLongitude -
        INDIA_BOUNDS.minLongitude)) *
    100;

  const y =
    ((INDIA_BOUNDS.maxLatitude - latitude) /
      (INDIA_BOUNDS.maxLatitude -
        INDIA_BOUNDS.minLatitude)) *
    100;

  return {
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y)),
  };
}

function getMapIcon(
  type: ApiPlace["type"]
): MapLocation["icon"] {
  switch (type) {
    case "Fort":
      return "fort";

    case "City":
    case "Village":
      return "capital";

    case "Hill":
    case "Valley":
    case "Pass":
      return "battle";

    case "River":
    case "Canal":
      return "port";

    default:
      return "capital";
  }
}

function getMapSymbol(
  type: ApiPlace["type"]
): string {
  switch (type) {
    case "Fort":
      return "🏰";

    case "City":
      return "👑";

    case "Village":
      return "🏘️";

    case "Hill":
      return "⛰️";

    case "Valley":
      return "🏞️";

    case "Pass":
      return "⚔️";

    case "River":
      return "🌊";

    case "Canal":
      return "🚢";

    default:
      return "📍";
  }
}

function getPlaceEra(
  place: ApiPlace
): string {
  /*
    Currently, historicalPeriodId stores
    a MongoDB ObjectId.

    The frontend map uses string IDs like:
    ancient
    mauryan
    gupta
    medieval
    rajput
    vijayanagara
    maratha

    Until historical periods are connected
    directly to the map, API places without
    a usable map era will appear in Ancient India.
  */

  return "ancient";
}

export function placeToMapLocation(
  place: ApiPlace
): MapLocation | null {
  if (!place.coordinates) {
    return null;
  }

  const { latitude, longitude } =
    place.coordinates;

  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    return null;
  }

  const { x, y } = getMapPosition(
    latitude,
    longitude
  );

  return {
    id: place.placeId,

    name: place.name,

    nameHindi:
      place.nativeName || undefined,

    x,

    y,

    era: getPlaceEra(place),

    hero:
      place.significance ||
      "Associated historical location",

    description: place.description,

    icon: getMapIcon(place.type),

    symbol: getMapSymbol(place.type),
  };
}

export function placesToMapLocations(
  places: ApiPlace[]
): MapLocation[] {
  return places
    .filter(
      (place) =>
        place.status === "Published"
    )
    .map(placeToMapLocation)
    .filter(
      (
        location
      ): location is MapLocation =>
        location !== null
    );
}