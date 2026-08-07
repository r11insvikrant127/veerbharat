export const getSort = (
  sort?: string,
  defaultSort = "-createdAt"
): string => {
  return sort?.trim() || defaultSort;
};