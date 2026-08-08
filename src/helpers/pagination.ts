// src/helpers/pagination.ts

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const getPagination = (
  page?: number,
  limit?: number
): PaginationOptions => {
  const currentPage = Math.max(
    1,
    page ?? 1
  );

  const currentLimit = Math.min(
    Math.max(1, limit ?? 10),
    100
  );

  return {
    page: currentPage,
    limit: currentLimit,
    skip:
      (currentPage - 1) *
      currentLimit,
  };
};

/* =====================================================
   PAGINATION METADATA
===================================================== */

export const getPaginationMeta = (
  page: number,
  limit: number,
  total: number
): PaginationMeta => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(
      total / limit
    ),
  };
};