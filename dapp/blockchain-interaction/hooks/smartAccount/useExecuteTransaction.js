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

    console.log("data  : ", data);
    console.log("tx  : ", tx);

    const { rows } = await response.json();

    console.log("Fetched signatures from DB:", rows);

    const sorted = rows
      .map((row) => {
        const sigBytes = arrayify(row.signature);

        // Extract v, r, s from the signature
        const r = "0x" + Buffer.from(sigBytes.slice(0, 32)).toString("hex");
        const s = "0x" + Buffer.from(sigBytes.slice(32, 64)).toString("hex");
        const v = sigBytes[64];

        return {
          owner: row.owner_address.toLowerCase(),
          sig: sigBytes,
        };
      })
      .sort((a, b) => (a.owner > b.owner ? 1 : -1));

    console.log("Sorted signatures:", sorted);

    // Concatenate signatures in sorted order
    const aggregatedSignature = utils.concat(sorted.map((x) => x.sig));
    console.log("Aggregated signature:", utils.hexlify(aggregatedSignature));

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

    // Verify signers are Safe owners
    const safeOwners = await safeWriteInstace.getOwners();
    console.log("Safe owners:", safeOwners);

    const ownersInSignatures = sorted.map((x) => x.owner);
    console.log("Signature owners:", ownersInSignatures);

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
