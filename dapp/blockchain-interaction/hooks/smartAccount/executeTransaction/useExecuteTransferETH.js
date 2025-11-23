import { toast } from "sonner";
import { ethers, utils } from "ethers";
import { SAFE_ERRORS } from "../../../helper/safeErrorCodes";

const useExecuteTransferETH = () => {
  const executeTransferETH = async (
    safeWriteInstace,
    metadata,
    aggregatedSignature
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

      const txHash = await safeWriteInstace.execTransaction(
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

      if (txHash) {
        toast.success(`${metadata.eth_amount} transferd to ${to}`, {
          action: {
            label: "Close",
          },
        });
      }

      return txHash;
    } catch (error) {
      let capturedErrorCode = "Unknown";

      const data =
        error?.error?.data?.data?.data ||
        error?.error?.data ||
        error?.data ||
        error?.reason;

      if (!data) return capturedErrorCode;

      if (typeof data === "string" && data.startsWith("0x08c379a0")) {
        const reason = ethers.utils.defaultAbiCoder.decode(
          ["string"],
          "0x" + data.slice(10) // remove selector
        );
        capturedErrorCode = reason[0];
      } else if (typeof data === "string") {
        capturedErrorCode = data;
      }

      console.log("error : ", error);
      const Error = SAFE_ERRORS[capturedErrorCode];
      console.log("error : ", Error);
      toast.error(Error, {
        action: {
          label: "Close",
        },
      });
    }
  };
  return executeTransferETH;
};

export default useExecuteTransferETH;
