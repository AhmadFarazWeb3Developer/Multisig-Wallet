import { useState } from "react";

const useGetRejectedTxs = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getRejectedTxs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "/api/transactions/get-rejected-transactions",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return { getRejectedTxs, isLoading };
};

export default useGetRejectedTxs;
