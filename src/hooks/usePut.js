import { fetchJson } from "./";

export const usePut = function (url) {
  return (item) => {
    return fetchJson(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
  };
};
