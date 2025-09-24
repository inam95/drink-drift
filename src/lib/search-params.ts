import { createLoader, parseAsString } from "nuqs/server";

export const searchParams = {
  query: parseAsString.withDefault("")
};
export const loadSearchParams = createLoader(searchParams);
