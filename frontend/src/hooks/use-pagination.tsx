import { useCallback, useMemo, useState } from "react";
import { PaginationOption } from "../interfaces/pagination-options.interface";
import { PaginationResults } from "../interfaces/pagination-results.interface";

export function usePagination<T>(
  size: number,
  fetcher: (
    paginationOption?: PaginationOption,
    pageUrl?: string
  ) => Promise<PaginationResults<T>>
) {
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [currentData, setCurrentData] = useState<PaginationResults<T>>();
  const goToPage = useCallback(
    async (page: number): Promise<void> => {
      const paginationOption: PaginationOption = {
        page,
        size,
      };

      try {
        const result = await fetcher(paginationOption);
        setCurrentPage(result.page);
        setCurrentData(result);
      } catch {
        setCurrentPage(null);
      }
    },
    [fetcher, size]
  );

  const goToUrl = useCallback(
    async (url: string): Promise<void> => {
      try {
        const result = await fetcher(void 0, url);
        setCurrentPage(result.page);
        setCurrentData(result);
      } catch {
        setCurrentPage(null);
      }
    },
    [fetcher]
  );

  const ready = useMemo(() => {
    const ready = currentPage !== null;
    if (!ready) {
      goToPage(1);
    }
    return ready;
  }, [currentPage, goToPage]);

  const hasNextPage = useMemo(() => {
    return !!currentData?.nextPageUrl;
  }, [currentData]);

  const hasPreviousPage = useMemo(() => {
    return !!currentData?.previousPageUrl;
  }, [currentData]);

  const nextPage = () => hasNextPage && goToUrl(currentData!.nextPageUrl);
  const previousPage = () =>
    hasPreviousPage && goToUrl(currentData!.previousPageUrl);

  return [ready, currentData, nextPage, previousPage, goToPage];
}
