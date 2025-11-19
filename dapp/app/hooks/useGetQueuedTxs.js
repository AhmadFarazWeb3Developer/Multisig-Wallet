const useGetQueuedTxs = () => {
  const getQueuedTxs = async () => {
    const response = await fetch("api/transactions", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return await response.json();
  };

  return getQueuedTxs;
};

export default useGetQueuedTxs;
