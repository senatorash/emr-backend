const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 10;

interface PaginationQuery {
  page?: string | number;
  limit?: string | number;
}

export const getPagination = ({ page, limit }: PaginationQuery) => {
  const pageNumber = Math.abs(Number(page)) || DEFAULT_PAGE_NUMBER;
  const pageLimit = Math.abs(Number(limit)) || DEFAULT_PAGE_LIMIT;

  const skip = (pageNumber - 1) * pageLimit;

  return { skip, limit: pageLimit };
};
