export const escapeRegex = (text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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