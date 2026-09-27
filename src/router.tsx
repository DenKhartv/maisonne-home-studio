import { QueryClient } from "@tanstack/react-query";
import { createRouter, stringifySearchWith, parseSearchWith } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    parseSearch: parseSearchWith(JSON.parse),
    stringifySearch: stringifySearchWith(JSON.stringify),
  });

  return router;
};
