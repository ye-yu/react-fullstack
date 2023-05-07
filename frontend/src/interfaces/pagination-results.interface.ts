export interface PaginationResults<T = any> {
  nextPageUrl: string;
  previousPageUrl: string;
  page: number;
  size: number;
  total: number;
  results: T[];
}
