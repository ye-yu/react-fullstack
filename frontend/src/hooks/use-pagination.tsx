import { useCallback, useState } from "react";
import { PaginationOption } from "../interfaces/pagination-options.interface";
import { PaginationResults } from "../interfaces/pagination-results.interface";

export function usePagination<T>(
  size: number,
  fetcher: (
    paginationOption?: PaginationOption,
    pageUrl?: string
  ) => Promise<PaginationResults<T>>
) {
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [previousPageUrl, setPreviousPageUrl] = useState<string | null>(null);
  const goToPage = useCallback(
    async (page: number): Promise<PaginationResults<T> | null> => {
      const paginationOption: PaginationOption = {
        page,
        size,
      };

      try {
        const result = await fetcher(paginationOption);
        setNextPageUrl(result.nextPageUrl);
        setPreviousPageUrl(result.previousPageUrl);
        return result;
      } catch {
        return null;
      }
    },
    [fetcher, size]
  );

  const goToUrl = useCallback(
    async (url: string): Promise<PaginationResults<T> | null> => {
      try {
        const result = await fetcher(void 0, url);
        setNextPageUrl(result.nextPageUrl);
        setPreviousPageUrl(result.previousPageUrl);
        return result;
      } catch {
        return null;
      }
    },
    [fetcher]
  );

  const nextPage = () =>
    nextPageUrl ? goToUrl(nextPageUrl) : Promise.resolve(null);
  const previousPage = () =>
    previousPageUrl ? goToUrl(previousPageUrl) : Promise.resolve(null);

  return [nextPage, previousPage, goToPage] as const;
}
