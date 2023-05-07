import { SearchOptions } from "../interfaces/search-options.interface";

export async function getSearchOptions(): Promise<SearchOptions[]> {
  process.env.REACT_APP_BACKEND_URL ??= "http://localhost:3001";
  if (!process.env.REACT_APP_BACKEND_URL) return [];
  try {
    const url = new URL(
      "/products/search-options",
      process.env.REACT_APP_BACKEND_URL
    );
    const request = await fetch(url);
    if (request.headers.get("content-type")?.includes("application/json")) {
      const parsedJson = await request.json();
      return parsedJson.search;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
  return [];
}
