export interface PaginationResults<T = any> {
  data: T[];
  page: number;
  size: number;
  total: number;
}
