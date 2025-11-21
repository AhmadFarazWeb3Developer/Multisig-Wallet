import { arrayify } from "ethers/lib/utils";

const useExecuteTransaction = () => {
  const executeTransaction = async (tx_hash, safeInstance) => {
    const response = await fetch(
      `/api/transactions/get-single-hash-signatures?tx_hash=${encodeURIComponent(
        tx_hash
      )}`,
      {
        method: "GET",
      }
    );

    const { rows } = await response.json();

    const bytesSignatures = rows.map((row) => arrayify(row.signature));

    console.log("data : ", bytesSignatures);
  };

  return executeTransaction;
};
export default useExecuteTransaction;
