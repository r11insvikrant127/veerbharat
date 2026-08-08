// src/helpers/search.ts

export const escapeRegex = (
  text: string
): string => {
  return text.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

export const getSearchRegex = (
  search?: string
): RegExp | undefined => {
  if (!search?.trim()) {
    return undefined;
  }

  return new RegExp(
    escapeRegex(search.trim()),
    "i"
  );
};

/* =====================================================
   BUILD SEARCH FILTER
===================================================== */

export const buildSearchFilter = (
  search: string | undefined,
  fields: string[]
): Record<string, unknown> => {
  const regex = getSearchRegex(search);

  if (!regex) {
    return {};
  }

  return {
    $or: fields.map((field) => ({
      [field]: regex,
    })),
  };
};