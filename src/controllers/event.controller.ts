import { NextRequest, NextResponse } from "next/server";

import eventService from "@/services/event.service";

import {
  createEventSchema,
  eventQuerySchema,
  eventIdSchema,
  updateEventSchema,
} from "@/validations/event";

export default class EventController {
  static async create(
    request: NextRequest
  ) {
    const body = await request.json();

    const data =
      createEventSchema.parse(body);

    const event =
      await eventService.createEvent(data);

    return NextResponse.json(event);
  }

  static async getAll(
    request: NextRequest
  ) {
    const query =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const validatedQuery =
      eventQuerySchema.parse(query);

    const events =
      await eventService.getEvents(
        validatedQuery
      );

    return NextResponse.json(events);
  }

  static async getById(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      eventIdSchema.parse(params);

    const event =
      await eventService.getEventById(
        validated.id
      );

    return NextResponse.json(event);
  }

  static async update(
    request: NextRequest,
    params: { id: string }
  ) {
    const validatedId =
      eventIdSchema.parse(params);

    const body =
      await request.json();

    const validatedBody =
      updateEventSchema.parse(body);

    const event =
      await eventService.updateEvent(
        validatedId.id,
        validatedBody
      );

    return NextResponse.json(event);
  }

  static async delete(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      eventIdSchema.parse(params);

    const result =
      await eventService.deleteEvent(
        validated.id
      );

    return NextResponse.json(result);
  }
}