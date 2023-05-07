import { PaginationOption } from "../interfaces/pagination-options.interface";
import { PaginationResults } from "../interfaces/pagination-results.interface";
import { ProductEntity } from "../interfaces/product.interface";

export async function postSearchProducts(
  searchInputs: Record<string, any>,
  paginationOption?: PaginationOption,
  /** pass here if using nextPageUrl or previousPageUrl */
  pageUrl?: string
): Promise<PaginationResults<ProductEntity>> {
  const emptyPagination: PaginationResults<ProductEntity> = {
    nextPageUrl: "",
    previousPageUrl: "",
    page: 0,
    size: 0,
    total: 0,
    results: [],
  };
  process.env.REACT_APP_BACKEND_URL ??= "http://localhost:3001";
  if (!process.env.REACT_APP_BACKEND_URL) return emptyPagination;
  try {
    const url = pageUrl
      ? new URL(pageUrl, process.env.REACT_APP_BACKEND_URL)
      : new URL("/products", process.env.REACT_APP_BACKEND_URL);
    if (paginationOption) {
      url.searchParams.set("page", `${paginationOption.page}`);
      url.searchParams.set("size", `${paginationOption.size}`);
    }
    const request = await fetch(url, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(searchInputs),
    });
    if (request.headers.get("content-type")?.includes("application/json")) {
      const parsedJson = await request.json();
      return parsedJson;
    } else {
      return emptyPagination;
    }
  } catch (error) {
    console.error(error);
    return emptyPagination;
  }
}
