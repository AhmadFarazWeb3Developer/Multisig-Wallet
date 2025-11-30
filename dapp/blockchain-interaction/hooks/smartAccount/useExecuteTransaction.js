import { utils } from "ethers";
import { arrayify } from "ethers/lib/utils";
import useExecuteTransferETH from "../smartAccount/executeTransaction/useExecuteTransferETH";
import useExecuteAddOwnerWithThreshold from "../smartAccount/executeTransaction/useExecuteAddOwnerWithThreshold";
import useExecuteRemoveOwner from "../smartAccount/executeTransaction/useExecuteRemoveOwner";
import useExecuteSetGuard from "../smartAccount/executeTransaction/useExecuteSetGuard";
import useExecuteMintTokens from "../smartAccount/executeTransaction/useExecuteMintTokens";
import useExecuteTransferSafeTokens from "../smartAccount/executeTransaction/useExecuteTransferSafeTokens";
import useExecuteChangeThreshold from "../smartAccount/executeTransaction/useExecuteChangeThreshold";
import useExecuteSwapOwner from "../smartAccount/executeTransaction/useExecuteSwapOwner";

import { toast } from "sonner";
import { useState } from "react";

const useExecuteTransaction = (safeAddress) => {
  const [isApproving, setIsApproving] = useState(false);

  const executeTransferETH = useExecuteTransferETH(safeAddress);
  const executeAddOwnerWithThreshold =
    useExecuteAddOwnerWithThreshold(safeAddress);
  const executeRemoveOwner = useExecuteRemoveOwner(safeAddress);
  const executeSetGuard = useExecuteSetGuard(safeAddress);
  const executeMintTokens = useExecuteMintTokens(safeAddress);
  const executeTransferSafeTokens = useExecuteTransferSafeTokens(safeAddress);
  const executeChangeThreshold = useExecuteChangeThreshold(safeAddress);
  const executeSwapOwner = useExecuteSwapOwner(safeAddress);

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
      console.log("Signatures are correctly ordered ");
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

    if (txOpName === "Transfer ETH") {
      try {
        setIsApproving(false);
        await executeTransferETH(
          safeWriteInstace,
          metadata,
          aggregatedSignature,
          tx
        );
      } catch (error) {
      } finally {
        setIsApproving(false);
      }
    }

    if (txOpName === "Transfer Safe Tokens") {
      try {
        setIsApproving(true);
        await executeTransferSafeTokens(
          safeWriteInstace,
          metadata,
          aggregatedSignature,
          tx
        );
      } catch (error) {
      } finally {
        setIsApproving(false);
      }
    }

    if (txOpName === "Add Owner with Threshold") {
      try {
        setIsApproving(true);
        await executeAddOwnerWithThreshold(
          safeWriteInstace,
          metadata,
          aggregatedSignature,
          tx
        );
      } catch (error) {
      } finally {
        setIsApproving(false);
      }
    }

    if (txOpName === "Remove Owner") {
      await executeRemoveOwner(
        safeWriteInstace,
        metadata,
        aggregatedSignature,
        tx
      );
    }

    if (txOpName === "Change Threshold") {
      try {
        setIsApproving(true);
        await executeChangeThreshold(
          safeWriteInstace,
          metadata,
          aggregatedSignature,
          tx
        );
      } catch (error) {
      } finally {
        setIsApproving(false);
      }
    }

    if (txOpName === "Set Guard") {
      try {
        setIsApproving(true);
        await executeSetGuard(
          safeWriteInstace,
          metadata,
          aggregatedSignature,
          safeAddress,
          tx
        );
      } catch (error) {
      } finally {
        setIsApproving(false);
      }
    }

    if (txOpName === "Mint Tokens") {
      try {
        setIsApproving(true);

        await executeMintTokens(
          safeWriteInstace,
          metadata,
          aggregatedSignature,
          safeAddress,
          tx
        );
      } catch (error) {
      } finally {
        setIsApproving(false);
      }
    }

    if (txOpName === "Swap Owner") {
      try {
        setIsApproving(true);

        await executeSwapOwner(
          safeWriteInstace,
          metadata,
          aggregatedSignature,
          tx
        );
      } catch (error) {
      } finally {
        setIsApproving(false);
      }
    }
  };

  return { executeTransaction, isApproving };
};

export default useExecuteTransaction;
