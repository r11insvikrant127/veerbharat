// src/services/book.service.ts

import Book from "@/models/book";
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
  CreateBookInput,
  UpdateBookInput,
  BookQuery,
} from "@/validations/book";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class BookService extends BaseService {
  async createBook(
    data: CreateBookInput
  ) {
    await this.connect();

    const existing =
      await Book.findOne({
        title: new RegExp(
          `^${escapeRegex(data.title)}$`,
          "i"
        ),
      });

    if (existing) {
      throw new ApiError(
        409,
        `Book '${data.title}' already exists.`
      );
    }

    const bookId =
      await generateNextId(
        ID_PREFIXES.BOK
      );

    const book =
      await Book.create({
        ...data,
        bookId,
      });

    return book;
  }

  async getBooks(
    query: BookQuery
  ) {
    await this.connect();

    const {
      page,
      limit,
      search,
      status,
      bookType,
      author,
      language,
      period,
      sort,
    } = query;

    const filter: Record<
      string,
      unknown
    > = {};

    Object.assign(
      filter,
      buildSearchFilter(search, [
        "title",
        "author",
        "subjects",
        "tags",
      ])
    );

    if (status) {
      filter.status = status;
    }

    if (bookType) {
      filter.bookType = bookType;
    }

    if (author) {
      filter.author = new RegExp(
        `^${escapeRegex(author)}$`,
        "i"
      );
    }

    if (language) {
      filter.language = new RegExp(
        `^${escapeRegex(language)}$`,
        "i"
      );
    }

    if (period) {
      filter.period = new RegExp(
        `^${escapeRegex(period)}$`,
        "i"
      );
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

    const [books, total] =
      await Promise.all([
        Book.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(currentLimit),

        Book.countDocuments(
          filter
        ),
      ]);

    return {
      data: books,
      pagination:
        getPaginationMeta(
          currentPage,
          currentLimit,
          total
        ),
    };
  }

  async getBookById(
    bookId: string
  ) {
    await this.connect();

    return this.findByPublicIdOrThrow(
      Book,
      "bookId",
      bookId,
      "Book"
    );
  }

  async updateBook(
    bookId: string,
    data: UpdateBookInput
  ) {
    await this.connect();

    const book =
      await this.findByPublicIdOrThrow(
        Book,
        "bookId",
        bookId,
        "Book"
      );

    if (
      data.title &&
      data.title !== book.title
    ) {
      const existing =
        await Book.findOne({
          title: new RegExp(
            `^${escapeRegex(
              data.title
            )}$`,
            "i"
          ),
        });

      if (
        existing &&
        existing.bookId !== bookId
      ) {
        throw new ApiError(
          409,
          `Book '${data.title}' already exists.`
        );
      }
    }

    Object.assign(
      book,
      data
    );

    await book.save();

    return book;
  }

  async deleteBook(
    bookId: string
  ) {
    await this.connect();

    const book =
      await this.findByPublicIdOrThrow(
        Book,
        "bookId",
        bookId,
        "Book"
      );

    await book.deleteOne();

    return {
      deleted: true,
      bookId,
    };
  }
}

export default new BookService();