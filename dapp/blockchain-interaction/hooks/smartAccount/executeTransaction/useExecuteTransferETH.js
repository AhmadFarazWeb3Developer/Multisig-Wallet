import { toast } from "sonner";
import { ethers, utils } from "ethers";
import { SAFE_ERRORS } from "../../../helper/safeErrorCodes";

const useExecuteTransferETH = () => {
  const executeTransferETH = async (
    safeWriteInstace,
    metadata,
    aggregatedSignature,
    tx_hash
  ) => {
    try {
      const to = metadata.eth_recipient;
      const value = ethers.utils.parseEther(metadata.eth_amount.toString());
      const data = "0x";
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

      console.log("✓ Hash verified! Executing transaction...");

      // Execute the transaction with manual gas limit
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

      console.log("Transaction submitted:", tx.hash);

      toast.info("Transaction submitted! Waiting for confirmation...", {
        action: { label: "Close" },
      });

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed!", receipt);

      toast.success(`${metadata.eth_amount} ETH transferred to ${to}`, {
        action: {
          label: "Close",
        },
      });

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

  return executeTransferETH;
};

export default useExecuteTransferETH;
