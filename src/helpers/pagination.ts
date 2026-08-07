export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export const getPagination = (
  page?: number,
  limit?: number
): PaginationOptions => {
  const currentPage = Math.max(1, page ?? 1);

  const currentLimit = Math.min(
    Math.max(1, limit ?? 10),
    100
  );

  return {
    page: currentPage,
    limit: currentLimit,
    skip: (currentPage - 1) * currentLimit,
  };
};