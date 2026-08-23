export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  skip: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function getPaginationMetadata(
  total: number,
  page = 1,
  limit = 10
): PaginationMetadata {
  const safeTotal = Math.max(0, Math.floor(total));
  const safeLimit = Math.max(1, Math.floor(limit));
  const safePage = Math.max(1, Math.floor(page));
  const totalPages = Math.ceil(safeTotal / safeLimit);

  return {
    page: safePage,
    limit: safeLimit,
    total: safeTotal,
    totalPages,
    skip: (safePage - 1) * safeLimit,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1 && totalPages > 0
  };
}