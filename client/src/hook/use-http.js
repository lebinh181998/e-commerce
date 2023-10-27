import React, { useState } from "react";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnect, setIsConnect] = useState(true);

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

      if (res.status === 500) {
        throw new Error(data.message);
      }

      resolveFetchData(data, !data.status);
    } catch (error) {
      console.log(error);
      // setIsConnect(false);
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isConnect,
    SendToServer,
  };
};
export default useHttp;
