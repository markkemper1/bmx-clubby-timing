import { useState, useEffect } from "react";

export const useGet = function (request) {
  const [state, setState] = useState({ loading: true, result: null, error: null });
  useEffect(() => {
    fetch(request)
      .then((res) => res.json())
      .then(
        (result) => {
          setState({
            loading: false,
            result: result || { x: 2 },
            x: 1,
          });
        },
        (error) => {
          setState({
            loading: false,
            error,
          });
        }
      );
  }, [request]);
  return state;
};
