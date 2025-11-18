import { ethers } from "ethers";

import Interfaces from "../../../blockchain-interaction/helper/interfaces";

import useSafeInstance from "./useSafeInstance";
import { toast } from "sonner";

const useChangeThreshold = (safeAddress) => {
  const iface = Interfaces();
  const safeInstance = useSafeInstance(safeAddress);

  const changeThreshold = async (formData) => {
    try {
      if (!safeInstance) {
        toast.error("Safe is not ready");
        return;
      }

      const interfaceOf = iface.safeSingltonInterface;

      // data
      const data = interfaceOf.encodeFunctionData("changeThreshold", [
        formData.newThreshold,
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

  return changeThreshold;
};

export default useChangeThreshold;
