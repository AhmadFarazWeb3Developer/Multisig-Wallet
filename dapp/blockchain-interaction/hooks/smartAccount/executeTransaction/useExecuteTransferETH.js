import { toast } from "sonner";
import { ethers, utils } from "ethers";
import { SAFE_ERRORS } from "../../../helper/safeErrorCodes";
import { useState } from "react";

const useExecuteTransferETH = () => {
  const [isApproving, setIsApproving] = useState(false);

  const executeTransferETH = async (
    safeWriteInstance,
    metadata,
    aggregatedSignature,
    tx
  ) => {
    setIsApproving(true);
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
      const nonce = await safeWriteInstance.nonce();
      console.log("Current Safe nonce:", nonce.toString());

      // Compute the transaction hash
      const txHash = await safeWriteInstance.getTransactionHash(
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
      console.log("Transaction hash:", txHash);
      console.log("Aggregated signature:", utils.hexlify(aggregatedSignature));

      // Execute transaction
      const execTransaction = await safeWriteInstance.execTransaction(
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

      const receipt = await execTransaction.wait();

      const payload = {
        tx_id: tx.tx_id,
        tx_hash: txHash,
        metadata,
        operation_name: tx.operation_name,
        status: receipt.status,
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
      console.log("get data : ", getData);

      console.log("receppit : ", receipt);

      if (receipt && getData.status === 200) {
        toast.success(
          `${metadata.eth_amount} ETH transferred to ${metadata.eth_recipient}`,
          { action: { label: "Close" } }
        );
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

      console.error("Error data:", data);

      if (data) {
        if (typeof data === "string" && data.startsWith("0x08c379a0")) {
          try {
            const reason = ethers.utils.defaultAbiCoder.decode(
              ["string"],
              "0x" + data.slice(10)
            );
            capturedErrorCode = reason[0];
          } catch (e) {
            console.error("Failed to decode error:", e);
          }
        } else if (typeof data === "string") {
          capturedErrorCode = data;
        }
      }

      const errorMessage =
        SAFE_ERRORS[capturedErrorCode] ||
        capturedErrorCode ||
        "Transaction execution failed";

      toast.error(`Execution failed: ${errorMessage}`, {
        action: { label: "Close" },
      });

      throw error;
    } finally {
      setIsApproving(false);
    }
  };

  return { executeTransferETH, isApproving };
};

export default useExecuteTransferETH;
