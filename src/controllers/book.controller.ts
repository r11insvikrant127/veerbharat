import { NextRequest, NextResponse } from "next/server";

import bookService from "@/services/book.service";

import {
  createBookSchema,
  bookQuerySchema,
  bookIdSchema,
  updateBookSchema,
} from "@/validations/book";

export default class BookController {
  static async create(request: NextRequest) {
    const body = await request.json();

    const data =
      createBookSchema.parse(body);

    const book =
      await bookService.createBook(data);

    return NextResponse.json(book);
  }

  static async getAll(request: NextRequest) {
    const query =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const validatedQuery =
      bookQuerySchema.parse(query);

    const books =
      await bookService.getBooks(
        validatedQuery
      );

    return NextResponse.json(books);
  }

  static async getById(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      bookIdSchema.parse(params);

    const book =
      await bookService.getBookById(
        validated.id
      );

    return NextResponse.json(book);
  }

  static async update(
    request: NextRequest,
    params: { id: string }
  ) {
    const validatedId =
      bookIdSchema.parse(params);

    const body =
      await request.json();

    const validatedBody =
      updateBookSchema.parse(body);

    const book =
      await bookService.updateBook(
        validatedId.id,
        validatedBody
      );

    return NextResponse.json(book);
  }

  static async delete(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      bookIdSchema.parse(params);

    const result =
      await bookService.deleteBook(
        validated.id
      );

    return NextResponse.json(result);
  }
}