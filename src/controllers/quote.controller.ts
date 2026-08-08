import { NextRequest, NextResponse } from "next/server";

import quoteService from "@/services/quote.service";

import {
  createQuoteSchema,
  quoteQuerySchema,
  quoteIdSchema,
  updateQuoteSchema,
} from "@/validations/quote";

export default class QuoteController {
  static async create(request: NextRequest) {
    const body = await request.json();

    const data =
      createQuoteSchema.parse(body);

    const quote =
      await quoteService.createQuote(data);

    return NextResponse.json(quote);
  }

  static async getAll(request: NextRequest) {
    const query =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const validatedQuery =
      quoteQuerySchema.parse(query);

    const quotes =
      await quoteService.getQuotes(
        validatedQuery
      );

    return NextResponse.json(quotes);
  }

  static async getById(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      quoteIdSchema.parse(params);

    const quote =
      await quoteService.getQuoteById(
        validated.id
      );

    return NextResponse.json(quote);
  }

  static async update(
    request: NextRequest,
    params: { id: string }
  ) {
    const validatedId =
      quoteIdSchema.parse(params);

    const body =
      await request.json();

    const validatedBody =
      updateQuoteSchema.parse(body);

    const quote =
      await quoteService.updateQuote(
        validatedId.id,
        validatedBody
      );

    return NextResponse.json(quote);
  }

  static async delete(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      quoteIdSchema.parse(params);

    const result =
      await quoteService.deleteQuote(
        validated.id
      );

    return NextResponse.json(result);
  }
}