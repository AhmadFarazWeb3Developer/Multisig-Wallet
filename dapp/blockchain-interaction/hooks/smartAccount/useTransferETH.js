import { toast } from "sonner";
import Interfaces from "../../helper/interfaces";
import useSafeInstance from "./useSafeInstance";
import { ethers } from "ethers";
import { isAddress } from "ethers/lib/utils";

const useTransferETH = (safeAddress) => {
  const safeInstance = useSafeInstance(safeAddress);
  const transferETH = async (formData) => {
    if (!safeInstance) {
      toast.error("safe is not ready");
    }

    try {
      const to = formData.recipient;
      const value = ethers.utils.parseEther(formData.amount.toString());
      const data = "0x";
      const operation = 0; // Enum.Operation.Call
      const safeTxGas = 0;
      const baseGas = 0;
      const gasPrice = 0;
      const gasToken = ethers.constants.AddressZero;
      const refundReceiver = ethers.constants.AddressZero;
      const nonce = await safeInstance.nonce();

      const txHash = await safeInstance.getTransactionHash(
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

      toast.success(`Transaction Hash: ${txHash}`);
      return txHash;
    } catch (error) {
      if (!isAddress(formData.recipient)) {
        toast.error("Invalid address", {
          action: {
            label: "Close",
            onClick: () => console.log("Toast closed"),
          },
        });
      }
      console.error("Error preparing transaction hash:", error);
      toast.error("Failed to create transaction hash.", {
        action: {
          label: "Close",

          onClick: () => console.log("Toast closed"),
        },
      });
    }
  };
  return transferETH;
};

export default useTransferETH;
