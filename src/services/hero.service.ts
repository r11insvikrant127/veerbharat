// src/services/hero.service.ts

import Hero from "@/models/hero";
import "@/models/image";
import ApiError from "@/lib/ApiError";
import BaseService from "./base.service";
import { getSearchRegex,escapeRegex,} from "@/helpers/search";
import { getPagination } from "@/helpers/pagination";
import { getSort } from "@/helpers/sorting";
import Event from "@/models/event";
import HistoricalPersonality from "@/models/historicalPersonality";

import {
  CreateHeroInput,
  HeroQuery,
  UpdateHeroInput,
} from "@/validations/hero";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class HeroService extends BaseService {
    async createHero(
        data: CreateHeroInput
    ) {
    // Ensure database connection
    await this.connect();

    // Check for duplicate name (case-insensitive)
    const existingHero = await Hero.findOne({
    name: new RegExp(
        `^${escapeRegex(data.name)}$`,
        "i"
    ),
    });

    if (existingHero) {
    throw new ApiError(
        409,
        `Hero '${data.name}' already exists.`
    );
    }

    // Generate unique hero ID
    const heroId = await generateNextId(ID_PREFIXES.HERO);

    // Create the document
    const hero =
        await Hero.create({
        ...data,
        heroId,
        });

    return hero;
    }

    async getHeroes(
    query: HeroQuery
    ) {
    await this.connect();

    const {
        page,
        limit,
        search,
        status,
        sort,
    } = query;

    const filter: Record<string, unknown> = {};

    // Search by name
    const regex = getSearchRegex(search);

    if (regex) {
    filter.name = regex;
    }

    // Filter by status
    if (status) {
        filter.status = status;
    }

    const {
    page: currentPage,
    limit: currentLimit,
    skip,
    } = getPagination(page, limit);

    const sortOption = getSort(sort);

    const [heroes, total] = await Promise.all([
        Hero.find(filter)
        .populate({
            path: "imageIds",
            select: "imageId title url altText imageType",
        })
        .sort(sortOption)
        .skip(skip)
        .limit(currentLimit),

        Hero.countDocuments(filter),
    ]);

    return {
    data: heroes,
    pagination: {
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages: Math.ceil(total / currentLimit),
    },
    };
    }

    private async findHeroOrThrow(
    heroId: string
    ) {
    const hero = await Hero.findOne({
        heroId,
    });

    if (!hero) {
        throw new ApiError(
        404,
        "Hero not found."
        );
    }

    return hero;
    }

    async getHeroById(heroId: string) {
        await this.connect();

        const hero = await Hero.findOne({ heroId })
            .populate({
                path: "imageIds",
                select:
                    "imageId title url altText imageType",
            })
            .populate({
                path: "historicalArtifacts.imageId",
                select:
                    "imageId title url altText imageType description",
            })
            .populate({
                path: "brothers",
                select:
                    "heroId name",
            })
            .populate({
            path: "relatedHeroes",
            select: "heroId name alternativeNames",
            });

        if (!hero) {
            throw new ApiError(
                404,
                "Hero not found."
            );
        }

        const relatedEvents = await Event.find({
            heroIds: hero._id,
        })
            .populate({
                path: "historicalPersonalityIds",
                model: HistoricalPersonality,
                select: `
                historicalPersonalityId
                name
                alternativeNames
                `,
            })
            .select(
                "eventId name historicalPersonalityIds"
            )
            .lean();

        const relatedHistoricalPersonalities = Array.from(
            new Map(
                relatedEvents
                    .flatMap(
                        (event) =>
                            event.historicalPersonalityIds || []
                    )
                    .map((person: any) => [
                        String(person._id),
                        person,
                    ])
            ).values()
        );

        return {
            ...hero.toObject(),
            relatedHistoricalPersonalities,
        };
    }
   
    async updateHero(
    heroId: string,
    data: UpdateHeroInput
    ) {
    await this.connect();

    const hero =
        await this.findHeroOrThrow(heroId);

    Object.assign(
        hero,
        data
    );

    await hero.save();

    return hero;
    }

    async deleteHero(
    heroId: string
    ) {
    await this.connect();

    const hero =
        await this.findHeroOrThrow(heroId);

    await hero.deleteOne();

    return {
        deleted: true,
        heroId,
    };
    }
}

const HeroServiceInstance = new HeroService();

export default HeroServiceInstance;


