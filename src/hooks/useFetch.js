export const useFetch = function (url, options = {}) {
  return fetchJson(url, options);
};

export function fetchJson(url, options) {
  return fetch(url, options).then((response) => {
    if (response.status === 204) return null;

    if (response.status >= 200 && response.status < 300) return response.json();

    if (response.status === 400)
      return response.json().then((json) => {
        var error = new Error("Bad Request");
        error.data = json;
        error.status = response.status;
        throw error;
      });

    var error = new Error(`Error fetching resource: ${url}, status: ${response.status}`);
    error.status = response.status;
    throw error;
  });
}
