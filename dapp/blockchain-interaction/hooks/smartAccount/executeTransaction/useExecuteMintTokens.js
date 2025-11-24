import { toast } from "sonner";
import { ethers, utils } from "ethers";
import { SAFE_ERRORS } from "../../../helper/safeErrorCodes";
import Interfaces from "@/blockchain-interaction/helper/interfaces";

const useExecuteMintTokens = () => {
  const { safeSingltonInterface } = Interfaces();

  const executeMintTokens = async (
    safeWriteInstace,
    metadata,
    aggregatedSignature,
    tx_hash,
    safeAddress
  ) => {
    try {
      const to = safeAddress;
      const value = 0;
      const data = safeSingltonInterface.encodeFunctionData("mint", [
        safeAddress,
        formData.mint_token_amount,
      ]);
      const operation = 0; // Enum.Operation.Call
      const safeTxGas = 0;
      const baseGas = 0;
      const gasPrice = 0;
      const gasToken = ethers.constants.AddressZero;
      const refundReceiver = ethers.constants.AddressZero;

      // Get current nonce
      const nonce = await safeWriteInstace.nonce();
      console.log("Current Safe nonce:", nonce.toString());

      // Recalculate hash with current nonce to verify
      const currentHash = await safeWriteInstace.getTransactionHash(
        to,
        value,
        data,
        operation,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        refundReceiver,
        nonce
      );

      console.log("Stored tx_hash:     ", tx_hash);
      console.log("Recalculated hash:  ", currentHash);
      console.log("Aggregated signature:", utils.hexlify(aggregatedSignature));

      if (currentHash !== tx_hash) {
        toast.error(
          "Transaction hash mismatch! The nonce may have changed. Please create a new transaction.",
          {
            action: { label: "Close" },
          }
        );
        return;
      }

      const tx = await safeWriteInstace.execTransaction(
        to,
        value,
        data,
        operation,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        refundReceiver,
        aggregatedSignature
      );

      const receipt = await tx.wait();

      const payload = {
        tx_hash: tx_hash,
      };

      const response = await fetch(
        "/api/transactions/store-executed-transaction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const getData = await response.json();

      if (receipt && getData.ok) {
        toast.success(`${metadata.mint_token_amount} tokens minted!`, {
          action: {
            label: "Close",
          },
        });
      }

      return receipt;
    } catch (error) {
      let capturedErrorCode = "Unknown";

      const data =
        error?.error?.data?.data?.data ||
        error?.error?.data?.data ||
        error?.error?.data ||
        error?.data ||
        error?.reason;

      console.log("Error data:", data);

      if (data) {
        if (typeof data === "string" && data.startsWith("0x08c379a0")) {
          try {
            const reason = ethers.utils.defaultAbiCoder.decode(
              ["string"],
              "0x" + data.slice(10)
            );
            capturedErrorCode = reason[0];
          } catch (e) {
            console.log("Failed to decode error:", e);
          }
        } else if (typeof data === "string") {
          capturedErrorCode = data;
        }
      }

      console.error("Execution error:", error);
      console.error("Captured error code:", capturedErrorCode);

      const errorMessage =
        SAFE_ERRORS[capturedErrorCode] ||
        capturedErrorCode ||
        "Transaction execution failed";

      toast.error(`Execution failed: ${errorMessage}`, {
        action: {
          label: "Close",
        },
      });

      throw error;
    }
  };

  return executeMintTokens;
};

export default useExecuteMintTokens;
