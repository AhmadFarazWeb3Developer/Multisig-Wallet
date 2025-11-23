// import { utils } from "ethers";
// import { arrayify } from "ethers/lib/utils";

// import useExecuteTransferETH from "../smartAccount/executeTransaction/useExecuteTransferETH";
// import { toast } from "sonner";

// const useExecuteTransaction = () => {
//   const executeTransferETH = useExecuteTransferETH();

//   const executeTransaction = async (tx_hash, safeWriteInstace, data) => {
//     const response = await fetch(
//       `/api/transactions/get-single-hash-signatures?tx_hash=${encodeURIComponent(
//         tx_hash
//       )}`,
//       {
//         method: "GET",
//       }
//     );

//     const { rows } = await response.json();

//     const sorted = rows
//       .map((row) => {
//         let sigBytes = arrayify(row.signature);
//         if (sigBytes.length === 65 && sigBytes[sigBytes.length - 1] !== 0x01) {
//           sigBytes = new Uint8Array([...sigBytes.slice(0, 64), 0x01]);
//         }
//         return {
//           owner: row.owner_address.toLowerCase(),
//           sig: sigBytes,
//         };
//       })
//       .sort((a, b) => (a.owner > b.owner ? 1 : -1));

//     const aggregatedSignature = utils.concat(sorted.map((x) => x.sig));

//     const transaction = data.filter((tx) => {
//       return tx.tx_hash === tx_hash;
//     });

//     const metadata = transaction[0].metadata;
//     const txOpName = transaction[0].operation_name;

//     const safeOwners = await safeWriteInstace.getOwners();
//     const ownersInSignatures = sorted.map((x) => x.owner);

//     for (let owner of ownersInSignatures) {
//       if (!safeOwners.includes(owner)) {
//         toast.error(`Signature owner not part of Safe: ${owner}`, {
//           action: { label: "Close" },
//         });
//       }
//     }

//     if (txOpName === "Transfer ETH") {
//       await executeTransferETH(
//         safeWriteInstace,
//         metadata,
//         aggregatedSignature,
//         tx_hash
//       );
//     }

//     if (txOpName === "Transfer Safe Tokens") {
//     }

//     if (txOpName === "Add Owner with Threshold") {
//     }
//     if (txOpName === "Remove Owner") {
//     }

//     if (txOpName === "Change Threshold") {
//     }

//     if (txOpName === "Set Guard") {
//     }

//     if (txOpName === "Mint Tokens") {
//     }

//     if (txOpName === "Swap Owner") {
//     }
//   };

//   return executeTransaction;
// };

// export default useExecuteTransaction;

import { utils } from "ethers";
import { arrayify } from "ethers/lib/utils";
import useExecuteTransferETH from "../smartAccount/executeTransaction/useExecuteTransferETH";
import { toast } from "sonner";

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

    console.log("Fetched signatures from DB:", rows);

    // Sort by owner address and prepare signatures

    // In useExecuteTransaction.js, after getting signatures:
    const sorted = rows
      .map((row) => {
        const sigBytes = arrayify(row.signature);

        // Extract v, r, s from the signature
        const r = "0x" + Buffer.from(sigBytes.slice(0, 32)).toString("hex");
        const s = "0x" + Buffer.from(sigBytes.slice(32, 64)).toString("hex");
        const v = sigBytes[64];

        console.log("=== SIGNATURE DEBUG ===");
        console.log("Owner:", row.owner_address);
        console.log("Full signature:", row.signature);
        console.log("v value:", v, "(should be 31 or 32)");
        console.log("r:", r);
        console.log("s:", s);
        console.log("=======================");
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

    const transaction = data.filter((tx) => {
      return tx.tx_hash === tx_hash;
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
        tx_hash
      );
    }

    if (txOpName === "Transfer Safe Tokens") {
      // TODO
    }

    if (txOpName === "Add Owner with Threshold") {
      // TODO
    }

    if (txOpName === "Remove Owner") {
      // TODO
    }

    if (txOpName === "Change Threshold") {
      // TODO
    }

    if (txOpName === "Set Guard") {
      // TODO
    }

    if (txOpName === "Mint Tokens") {
      // TODO
    }

    if (txOpName === "Swap Owner") {
      // TODO
    }
  };

  return executeTransaction;
};

export default useExecuteTransaction;
