// src/services/event.service.ts

import Event from "@/models/event";
import ApiError from "@/lib/ApiError";
import BaseService from "./base.service";
import Hero from "@/models/hero";
import Image from "@/models/image";
import Battle from "@/models/battle";
import HistoricalPersonality from "@/models/historicalPersonality";
import Place from "@/models/place";
import Kingdom from "@/models/kingdom";

import {
  buildSearchFilter,
  escapeRegex,
} from "@/helpers/search";

import {
  getPagination,
  getPaginationMeta,
} from "@/helpers/pagination";

import { getSort } from "@/helpers/sorting";

import {
  CreateEventInput,
  UpdateEventInput,
  EventQuery,
} from "@/validations/event";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class EventService extends BaseService {
  async createEvent(
    data: CreateEventInput
  ) {
    await this.connect();

    const existing =
      await Event.findOne({
        name: new RegExp(
          `^${escapeRegex(data.name)}$`,
          "i"
        ),
      });

    if (existing) {
      throw new ApiError(
        409,
        `Event '${data.name}' already exists.`
      );
    }

    const eventId =
      await generateNextId(
        ID_PREFIXES.EVT
      );

    const event =
      await Event.create({
        ...data,
        eventId,
      });

    return event;
  }

  async getEvents(
    query: EventQuery
  ) {
    await this.connect();

    const {
      page,
      limit,
      search,
      status,
      type,
      historicalPeriodId,
      locationId,
      heroId,
      isOnThisDayEligible,
      isPersonalMilestone,
      sort,
    } = query;

    const filter: Record<
      string,
      unknown
    > = {};

    Object.assign(
      filter,
      buildSearchFilter(search, [
        "name",
        "nativeName",
        "description",
        "tags",
      ])
    );

    if (status) {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    if (historicalPeriodId) {
      filter.historicalPeriodId =
        historicalPeriodId;
    }

    if (locationId) {
      filter.locationId =
        locationId;
    }

    if (heroId) {
      filter.heroIds = heroId;
    }

    if (
      isOnThisDayEligible !==
      undefined
    ) {
      filter.isOnThisDayEligible =
        isOnThisDayEligible;
    }

    if (
      isPersonalMilestone !==
      undefined
    ) {
      filter.isPersonalMilestone =
        isPersonalMilestone;
    }

    const {
      page: currentPage,
      limit: currentLimit,
      skip,
    } = getPagination(
      page,
      limit
    );

    const sortOption =
      getSort(sort);

    const [events, total] =
      await Promise.all([
        Event.find(filter)
        .populate({
          path: "linkedEventId",
          model: Event,
          select: `
            _id
            eventId
            name
          `,
        })
        .populate({
          path: "imageIds.imageId",
            model: Image,
            select: `
              imageId
              title
              url
              altText
              imageType
              description
            `,
          })
          .populate({
            path: "heroIds",
            model: Hero,
            select: `
              heroId
              name
              nativeName
              title
              shortDescription
              biography
              status
              imageIds
            `,
            populate: {
              path: "imageIds",
              model: Image,
              select: "imageId title url altText imageType",
            },
          })
          .populate({
            path: "historicalPersonalityIds",
            model: HistoricalPersonality,
            select: `
              historicalPersonalityId
              name
              alternativeNames
              nativeName
              title
              shortDescription
              biography
              status
              imageIds
            `,
          })
          .populate({
            path: "crossReferences.relatedBattles",
            model: Battle,
            select: `
              battleId
              name
              shortDescription
            `,
          })
          .populate({
            path: "crossReferences.relatedPlaces",
            model: Place,
            select: `
              placeId
              name
              nativeName
              alternativeNames
              type
              state
              country
              description
            `,
          })
          .populate({
            path: "crossReferences.relatedKingdoms",
            model: Kingdom,
            select: `
              kingdomId
              name
              nativeName
              alternativeNames
              description
              status
            `,
          })
          .sort(sortOption)
          .skip(skip)
          .limit(currentLimit),

        Event.countDocuments(filter),
      ]);

    return {
      data: events,
      pagination:
        getPaginationMeta(
          currentPage,
          currentLimit,
          total
        ),
    };
  }

  async getEventById(
    eventId: string
  ) {
    await this.connect();

    const event = await Event.findOne({
      eventId,
    })
      .populate({
        path: "linkedEventId",
        model: Event,
        select: `
          _id
          eventId
          name
        `,
      })
      .populate({
        path: "imageIds.imageId",
        model: Image,
        select: {
          imageId: 1,
          title: 1,
          url: 1,
          altText: 1,
          imageType: 1,
          description: 1,
        },
      })
      .populate({
        path: "heroIds",
        model: Hero,
        select: `
          heroId
          name
          nativeName
          title
          shortDescription
          biography
          status
          imageIds
        `,
        populate: {
          path: "imageIds",
          model: Image,
          select:
            "imageId title url altText imageType",
        },
      })
      .populate({
        path: "historicalPersonalityIds",
        model: HistoricalPersonality,
        select: `
          historicalPersonalityId
          name
          alternativeNames
          nativeName
          title
          shortDescription
          biography
          status
          imageIds
        `,
      })
      .populate({
        path: "crossReferences.relatedBattles",
        model: Battle,
        select: `
          battleId
          name
          shortDescription
        `,
      })
      .populate({
        path: "crossReferences.relatedPlaces",
        model: Place,
        select: `
          placeId
          name
          nativeName
          alternativeNames
          type
          state
          country
          description
        `,
      })
      .populate({
        path: "crossReferences.relatedKingdoms",
        model: Kingdom,
        select: `
          kingdomId
          name
          nativeName
          alternativeNames
          description
          status
        `,
      });

    if (!event) {
      throw new ApiError(
        404,
        "Event not found."
      );
    }

    const groupRootId = event.linkedEventId
      ? event.linkedEventId._id
      : event._id;

    const relatedLinkedEvents = await Event.find({
      $or: [
        { _id: groupRootId },
        { linkedEventId: groupRootId },
      ],
      _id: { $ne: event._id },
    })
      .select(
        "eventId name shortDescription eventDate type imageUrl"
      )
      .sort({ eventDate: 1, name: 1 })
      .lean();

    return {
      ...event.toObject(),
      relatedLinkedEvents,
    };

  }

  async updateEvent(
    eventId: string,
    data: UpdateEventInput
  ) {
    await this.connect();

    const event =
      await this.findByPublicIdOrThrow(
        Event,
        "eventId",
        eventId,
        "Event"
      );

    if (
      data.name &&
      data.name !== event.name
    ) {
      const existing =
        await Event.findOne({
          name: new RegExp(
            `^${escapeRegex(
              data.name
            )}$`,
            "i"
          ),
        });

      if (
        existing &&
        existing.eventId !== eventId
      ) {
        throw new ApiError(
          409,
          `Event '${data.name}' already exists.`
        );
      }
    }

    Object.assign(
      event,
      data
    );

    await event.save();

    return event;
  }

  async deleteEvent(
    eventId: string
  ) {
    await this.connect();

    const event =
      await this.findByPublicIdOrThrow(
        Event,
        "eventId",
        eventId,
        "Event"
      );

    await event.deleteOne();

    return {
      deleted: true,
      eventId,
    };
  }
}

const EventServiceInstance = new EventService();

export default EventServiceInstance;
