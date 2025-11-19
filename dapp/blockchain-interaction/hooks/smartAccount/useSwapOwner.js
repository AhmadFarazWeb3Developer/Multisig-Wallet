import { ethers } from "ethers";

import Interfaces from "../../helper/interfaces";

import useSafeInstance from "./useSafeInstance";
import { toast } from "sonner";
import { isAddress } from "ethers/lib/utils";

const useSwapOwner = (safeAddress) => {
  const iface = Interfaces();
  const safeInstance = useSafeInstance(safeAddress);

  const swapOwner = async (formData) => {
    try {
      if (!safeInstance) {
        toast.error("Safe is not ready");
        return;
      }

      if (
        !formData.prevOwner_for_swap ||
        !formData.oldOwner_for_swap ||
        !formData.newOwner_for_swap
      ) {
        toast.error("Fill the form before proceeding");
        return;
      }

      if (
        !isAddress(formData.prevOwner_for_swap) ||
        !isAddress(formData.oldOwner_for_swap) ||
        !isAddress(formData.newOwner_for_swap)
      ) {
        toast.error("owners must be a valid addresses");
        return;
      }

      const interfaceOf = iface.safeSingltonInterface;

      // data
      const data = interfaceOf.encodeFunctionData("swapOwner", [
        formData.prevOwner_for_swap,
        formData.oldOwner_for_swap,
        formData.newOwner_for_swap,
      ]);

      const to = safeAddress;
      const value = 0;
      const operation = 0; // Enum.Operation.Call
      const safeTxGas = 0;
      const baseGas = 0;
      const gasPrice = 0;
      const gasToken = ethers.constants.AddressZero;
      const refundReceiver = ethers.constants.AddressZero;
      const nonce = await safeInstance.nonce();

      // transaction hash
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

      toast.success(`Transaction hash generated successfully! ${txHash}`, {
        action: {
          label: "Close",
        },
      });
      return txHash;
    } catch (error) {
      console.error(error);
      toast.error(`Error sending tokens: ${error.message || error}`, {
        action: {
          label: "Close",
        },
      });
    }
  };

  return swapOwner;
};

export default useSwapOwner;
