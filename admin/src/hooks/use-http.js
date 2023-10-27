import React, { useState } from "react";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const SendToServer = async (url, resolveFetchData, method, body, headers) => {
    try {
      setIsLoading(true);
      const res = await fetch("https://backend-ass3.onrender.com" + url, {
        method: method ? method : "GET",
        body: body ? body : null,
        headers: headers ? headers : {},
        credentials: "include",
      });
      console.log(res);
      const data = await res.json();
      setIsLoading(false);
      console.log(data);

      resolveFetchData(data, !data.status);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    SendToServer,
    isLoading,
  };
};
export default useHttp;
