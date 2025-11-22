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

    const bytesSignatures = rows.map((row) => arrayify(row.signature));

    const aggregatedSignature = utils.concat(bytesSignatures);

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
