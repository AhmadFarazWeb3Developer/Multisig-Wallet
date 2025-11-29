import { utils } from "ethers";
import { arrayify } from "ethers/lib/utils";
import useExecuteTransferETH from "../smartAccount/executeTransaction/useExecuteTransferETH";
import useExecuteAddOwnerWithThreshold from "../smartAccount/executeTransaction/useExecuteAddOwnerWithThreshold";
import useExecuteRemoveOwner from "../smartAccount/executeTransaction/useExecuteRemoveOwner";
import useExecuteSetGuard from "../smartAccount/executeTransaction/useExecuteSetGuard";
import useExecuteMintTokens from "../smartAccount/executeTransaction/useExecuteMintTokens";
import useExecuteTransferSafeTokens from "../smartAccount/executeTransaction/useExecuteTransferSafeTokens";
import useExecuteChangeThreshold from "../smartAccount/executeTransaction/useExecuteChangeThreshold";
import { toast } from "sonner";

const useExecuteTransaction = () => {
  const { executeTransferETH, isApproving } = useExecuteTransferETH();
  const executeAddOwnerWithThreshold = useExecuteAddOwnerWithThreshold();
  const executeRemoveOwner = useExecuteRemoveOwner();
  const executeSetGuard = useExecuteSetGuard();
  const executeMintTokens = useExecuteMintTokens();
  const executeTransferSafeTokens = useExecuteTransferSafeTokens();
  const executeChangeThreshold = useExecuteChangeThreshold();

  const executeTransaction = async (
    tx,
    safeWriteInstace,
    data,
    safeAddress
  ) => {
    const response = await fetch(
      `/api/transactions/get-single-hash-signatures?tx_id=${encodeURIComponent(
        tx.tx_id
      )}`,
      {
        method: "GET",
      }
    );

    const { rows } = await response.json();

    const safeOwners = (await safeWriteInstace.getOwners()).map((o) =>
      o.toLowerCase()
    );

    const sorted = rows
      .map((row) => {
        const sigBytes = arrayify(row.signature);

        return {
          owner: row.owner_address.toLowerCase(),
          sig: sigBytes,
        };
      })
      .sort((a, b) => (a.owner > b.owner ? 1 : -1));

    const aggregatedSignature = utils.concat(sorted.map((x) => x.sig));

    const sortedOwners = sorted.map((x) => x.owner);

    const isOrderedCorrectly = sortedOwners.every(
      (owner, index) => owner === safeOwners[index]
    );

    console.log("Safe owners order:", safeOwners);
    console.log("Sorted signature owners:", sortedOwners);

    if (!isOrderedCorrectly) {
      console.warn(
        "Signatures are NOT in the same order as Safe owners. GS026 may occur!"
      );
    } else {
      console.log("Signatures are correctly ordered ✅");
    }

    const currentTxId = tx.tx_id;
    const transaction = data.filter((tx) => {
      return tx.tx_id === currentTxId;
    });

    if (transaction.length === 0) {
      toast.error("Transaction not found", {
        action: { label: "Close" },
      });
      return;
    }

    const metadata = transaction[0].metadata;
    const txOpName = transaction[0].operation_name;

    const ownersInSignatures = sorted.map((x) => x.owner);

    for (let owner of ownersInSignatures) {
      const isOwner = safeOwners.some(
        (safeOwner) => safeOwner.toLowerCase() === owner
      );
      if (!isOwner) {
        toast.error(`Signature owner not part of Safe: ${owner}`, {
          action: { label: "Close" },
        });
        return;
      }
    }

    console.log("All signature owners verified ✓");

    // Execute based on operation type
    if (txOpName === "Transfer ETH") {
      await executeTransferETH(
        safeWriteInstace,
        metadata,
        aggregatedSignature,
        tx
      );
    }

    if (txOpName === "Transfer Safe Tokens") {
      await executeTransferSafeTokens(
        safeWriteInstace,
        metadata,
        aggregatedSignature,
        tx
      );
    }

    if (txOpName === "Add Owner with Threshold") {
      await executeAddOwnerWithThreshold(
        safeWriteInstace,
        metadata,
        aggregatedSignature,
        safeAddress,
        tx
      );
    }

    if (txOpName === "Remove Owner") {
      await executeRemoveOwner(
        safeWriteInstace,
        metadata,
        aggregatedSignature,
        safeAddress,
        tx
      );
    }

    if (txOpName === "Change Threshold") {
      await executeChangeThreshold(
        safeWriteInstace,
        metadata,
        aggregatedSignature,
        safeAddress,
        tx
      );
    }

    if (txOpName === "Set Guard") {
      await executeSetGuard(
        safeWriteInstace,
        metadata,
        aggregatedSignature,
        safeAddress,
        tx
      );
    }

    if (txOpName === "Mint Tokens") {
      await executeMintTokens(
        safeWriteInstace,
        metadata,
        aggregatedSignature,
        safeAddress,
        tx
      );
    }

    if (txOpName === "Swap Owner") {
    }
  };

  return { executeTransaction, isApproving };
};

export default useExecuteTransaction;
