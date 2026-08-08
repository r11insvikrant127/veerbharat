import Quote from "@/models/quote";
import ApiError from "@/lib/ApiError";
import BaseService from "./base.service";

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
  CreateQuoteInput,
  UpdateQuoteInput,
  QuoteQuery,
} from "@/validations/quote";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class QuoteService extends BaseService {
  async createQuote(
    data: CreateQuoteInput
  ) {
    await this.connect();

    const existing =
      await Quote.findOne({
        text: new RegExp(
          `^${escapeRegex(data.text)}$`,
          "i"
        ),
      });

    if (existing) {
      throw new ApiError(
        409,
        "This quote already exists."
      );
    }

    const quoteId =
      await generateNextId(
        ID_PREFIXES.QTE
      );

    const quote =
      await Quote.create({
        ...data,
        quoteId,
      });

    return quote;
  }

  async getQuotes(
    query: QuoteQuery
  ) {
    await this.connect();

    const {
      page,
      limit,
      search,
      status,
      language,
      heroId,
      eventId,
      sourceId,
      sort,
    } = query;

    const filter: Record<
      string,
      unknown
    > = {};

    Object.assign(
      filter,
      buildSearchFilter(search, [
        "text",
        "translation",
        "context",
        "tags",
      ])
    );

    if (status) {
      filter.status = status;
    }

    if (language) {
      filter.language = language;
    }

    if (heroId) {
      filter.heroId = heroId;
    }

    if (eventId) {
      filter.eventId = eventId;
    }

    if (sourceId) {
      filter.sourceId = sourceId;
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

    const [quotes, total] =
      await Promise.all([
        Quote.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(currentLimit),

        Quote.countDocuments(
          filter
        ),
      ]);

    return {
      data: quotes,
      pagination:
        getPaginationMeta(
          currentPage,
          currentLimit,
          total
        ),
    };
  }

  async getQuoteById(
    quoteId: string
  ) {
    await this.connect();

    return this.findByPublicIdOrThrow(
      Quote,
      "quoteId",
      quoteId,
      "Quote"
    );
  }

  async updateQuote(
    quoteId: string,
    data: UpdateQuoteInput
  ) {
    await this.connect();

    const quote =
      await this.findByPublicIdOrThrow(
        Quote,
        "quoteId",
        quoteId,
        "Quote"
      );

    if (
      data.text &&
      data.text !== quote.text
    ) {
      const existing =
        await Quote.findOne({
          text: new RegExp(
            `^${escapeRegex(
              data.text
            )}$`,
            "i"
          ),
        });

      if (
        existing &&
        existing.quoteId !== quoteId
      ) {
        throw new ApiError(
          409,
          "This quote already exists."
        );
      }
    }

    Object.assign(
      quote,
      data
    );

    await quote.save();

    return quote;
  }

  async deleteQuote(
    quoteId: string
  ) {
    await this.connect();

    const quote =
      await this.findByPublicIdOrThrow(
        Quote,
        "quoteId",
        quoteId,
        "Quote"
      );

    await quote.deleteOne();

    return {
      deleted: true,
      quoteId,
    };
  }
}

export default new QuoteService();