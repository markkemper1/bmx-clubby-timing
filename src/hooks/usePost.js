export const usePost = function (url) {
  const post = (item) => {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    }).then((response) => {
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
  };
  return post;
};
