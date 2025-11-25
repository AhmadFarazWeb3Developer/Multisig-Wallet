// import { ethers } from "ethers";
// import { arrayify, joinSignature, splitSignature } from "ethers/lib/utils";
// import { toast } from "sonner";

// import useInstancesSigner from "@/blockchain-interaction/helper/instancesSigner";
// import useTransferETH from "./getTransactionHash/useTransferETH";
// import useTransferSafeTokens from "./getTransactionHash/useTransferSafeTokens";
// import useChangeThreshold from "./getTransactionHash/useChangeThreshold";
// import useAddOwnerWithThreshold from "./getTransactionHash/useAddOwnerWithThreshold";
// import useRemoveOwner from "./getTransactionHash/useRemoveOwner";
// import useSetGuard from "./getTransactionHash/useSetGuard";
// import useMintTokens from "./getTransactionHash/useMintTokens";
// import useSwapOwner from "./getTransactionHash/useSwapOwner";
// import { useState } from "react";

// const useSignTransaction = (safeAddress) => {
//   const [isSigning, setIsSigning] = useState(false);

//   const InstancesSigner = useInstancesSigner();

//   const transferETH = useTransferETH(safeAddress);
//   const transferSafeTokens = useTransferSafeTokens(safeAddress);
//   const changeThreshold = useChangeThreshold(safeAddress);
//   const addOwnerWithThreshold = useAddOwnerWithThreshold(safeAddress);
//   const removeOwner = useRemoveOwner(safeAddress);
//   const setGuard = useSetGuard(safeAddress);
//   const mintTokens = useMintTokens(safeAddress);
//   const swapOwner = useSwapOwner(safeAddress);

//   const submitSignature = async (tx_id, sender_address, signature) => {
//     console.log("tx id  : ", tx_id);

//     const payload = {
//       tx_id: tx_id,
//       owner_address: sender_address,
//       signature: signature,
//     };

//     const response = await fetch("/api/transactions/sign-transaction", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       toast.error(result.error || "Error queueing transaction", {
//         action: { label: "Close" },
//       });
//       return;
//     }

//     toast.success("Transaction Signed!", {
//       action: {
//         label: "Close",
//       },
//     });
//   };

//   const signTransaction = async (tx, sender_address) => {
//     const { signer } = await InstancesSigner();
//     if (!signer) {
//       toast.error("No signer available");
//       return;
//     }

//     let txHash;

//     if (tx.operation_name == "Transfer ETH") {
//       txHash = await transferETH(tx.metadata);
//     }

//     if (tx.operation_name == "Transfer Safe Tokens") {
//       txHash = await transferSafeTokens(tx.metadata);
//     }

//     if (tx.operation_name == "Add Owner with Threshold") {
//       txHash = await addOwnerWithThreshold(tx.metadata);
//     }

//     if (tx.operation_name == "Remove Owner") {
//       txHash = await removeOwner(tx.metadata);
//     }

//     if (tx.operation_name == "Set Guard") {
//       txHash = await setGuard(tx.metadata);
//     }

//     if (tx.operation_name == "Change Threshold") {
//       txHash = await changeThreshold(tx.metadata);
//     }

//     if (tx.operation_name == "Mint Tokens") {
//       txHash = await mintTokens(tx.metadata);
//     }

//     if (tx.operation_name == "Swap Owner") {
//       txHash = await swapOwner(tx.metadata);
//     }

//     const Bytes32Hash = arrayify(txHash);

//     const rawSig = await signer.signMessage(Bytes32Hash);

//     const sigObj = splitSignature(rawSig);
//     console.log(
//       "Split signature - r:",
//       sigObj.r,
//       "s:",
//       sigObj.s,
//       "v:",
//       sigObj.v
//     );

//     // Adjust v value for Safe's eth_sign format
//     let vSafe = sigObj.v;
//     if (vSafe < 27) vSafe += 27;
//     vSafe += 4; // Makes it 31 or 32

//     const r = sigObj.r;
//     const s = sigObj.s;
//     const vHex = ethers.utils.hexZeroPad(ethers.utils.hexlify(vSafe), 1);

//     const safeSig = r + s.slice(2) + vHex.slice(2);

//     await submitSignature(tx.tx_id, sender_address, safeSig);
//   };
//   return signTransaction;
// };

// export default useSignTransaction;

import { useState } from "react";
import { ethers } from "ethers";
import { arrayify, splitSignature } from "ethers/lib/utils";
import { toast } from "sonner";

import useInstancesSigner from "@/blockchain-interaction/helper/instancesSigner";
import useTransferETH from "./getTransactionHash/useTransferETH";
import useTransferSafeTokens from "./getTransactionHash/useTransferSafeTokens";
import useChangeThreshold from "./getTransactionHash/useChangeThreshold";
import useAddOwnerWithThreshold from "./getTransactionHash/useAddOwnerWithThreshold";
import useRemoveOwner from "./getTransactionHash/useRemoveOwner";
import useSetGuard from "./getTransactionHash/useSetGuard";
import useMintTokens from "./getTransactionHash/useMintTokens";
import useSwapOwner from "./getTransactionHash/useSwapOwner";

const useSignTransaction = (safeAddress) => {
  const InstancesSigner = useInstancesSigner();

  const transferETH = useTransferETH(safeAddress);
  const transferSafeTokens = useTransferSafeTokens(safeAddress);
  const changeThreshold = useChangeThreshold(safeAddress);
  const addOwnerWithThreshold = useAddOwnerWithThreshold(safeAddress);
  const removeOwner = useRemoveOwner(safeAddress);
  const setGuard = useSetGuard(safeAddress);
  const mintTokens = useMintTokens(safeAddress);
  const swapOwner = useSwapOwner(safeAddress);

  const [isSigning, setIsSigning] = useState(false); // <- loading state

  const submitSignature = async (tx_id, sender_address, signature) => {
    const payload = {
      tx_id,
      owner_address: sender_address,
      signature,
    };

    const response = await fetch("/api/transactions/sign-transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      toast.error(result.error || "Error signing transaction", {
        action: { label: "Close" },
      });
      return;
    }

    toast.success("Transaction Signed!", {
      action: { label: "Close" },
    });
  };

  const signTransaction = async (tx, sender_address) => {
    setIsSigning(true); // start loading
    try {
      const { signer } = await InstancesSigner();
      if (!signer) {
        toast.error("No signer available");
        return;
      }

      let txHash;
      switch (tx.operation_name) {
        case "Transfer ETH":
          txHash = await transferETH(tx.metadata);
          break;
        case "Transfer Safe Tokens":
          txHash = await transferSafeTokens(tx.metadata);
          break;
        case "Add Owner with Threshold":
          txHash = await addOwnerWithThreshold(tx.metadata);
          break;
        case "Remove Owner":
          txHash = await removeOwner(tx.metadata);
          break;
        case "Set Guard":
          txHash = await setGuard(tx.metadata);
          break;
        case "Change Threshold":
          txHash = await changeThreshold(tx.metadata);
          break;
        case "Mint Tokens":
          txHash = await mintTokens(tx.metadata);
          break;
        case "Swap Owner":
          txHash = await swapOwner(tx.metadata);
          break;
        default:
          throw new Error("Unknown operation");
      }

      const Bytes32Hash = arrayify(txHash);
      const rawSig = await signer.signMessage(Bytes32Hash);
      const sigObj = splitSignature(rawSig);

      let vSafe = sigObj.v < 27 ? sigObj.v + 27 : sigObj.v;
      vSafe += 4; // safe eth_sign adjustment

      const r = sigObj.r;
      const s = sigObj.s;
      const vHex = ethers.utils.hexZeroPad(ethers.utils.hexlify(vSafe), 1);
      const safeSig = r + s.slice(2) + vHex.slice(2);

      await submitSignature(tx.tx_id, sender_address, safeSig);
    } catch (err) {
      console.error("Error signing transaction:", err);
      toast.error(err.message || "Signing failed", {
        action: { label: "Close" },
      });
    } finally {
      setIsSigning(false); // stop loading
    }
  };

  return { signTransaction, isSigning }; // return loading state
};

export default useSignTransaction;
