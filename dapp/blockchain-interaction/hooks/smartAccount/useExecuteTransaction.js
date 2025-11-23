import { utils } from "ethers";
import { arrayify } from "ethers/lib/utils";

import useExecuteTransferETH from "../smartAccount/executeTransaction/useExecuteTransferETH";

const useExecuteTransaction = () => {
  const executeTransferETH = useExecuteTransferETH();

  const executeTransaction = async (tx_hash, safeWriteInstace, data) => {
    const response = await fetch(
      `/api/transactions/get-single-hash-signatures?tx_hash=${encodeURIComponent(
        tx_hash
      )}`,
      {
        method: "GET",
      }
    );

    const { rows } = await response.json();

    const sorted = rows
      .map((row) => ({
        owner: row.owner_address.toLowerCase(),
        sig: arrayify(row.signature),
      }))
      .sort((a, b) => (a.owner > b.owner ? 1 : -1)); // ascending sorting

    const aggregatedSignature = utils.concat(sorted.map((x) => x.sig));

    const transaction = data.filter((tx) => {
      return tx.tx_hash === tx_hash;
    });

    const metadata = transaction[0].metadata;
    const txOpName = transaction[0].operation_name;

    if (txOpName === "Transfer ETH") {
      await executeTransferETH(safeWriteInstace, metadata, aggregatedSignature);
    }

    if (txOpName === "Transfer Safe Tokens") {
    }

    if (txOpName === "Add Owner with Threshold") {
    }
    if (txOpName === "Remove Owner") {
    }

    if (txOpName === "Change Threshold") {
    }

    if (txOpName === "Set Guard") {
    }

    if (txOpName === "Mint Tokens") {
    }

    if (txOpName === "Swap Owner") {
    }
  };

  return executeTransaction;
};

export default useExecuteTransaction;
