import { ethers } from "ethers";

import Interfaces from "../../../helper/interfaces";

import useSafeInstance from "../useSafeInstance";
import { toast } from "sonner";

const useChangeThreshold = (safeAddress) => {
  const { safeSingltonInterface } = Interfaces();
  const { safeReadInstance } = useSafeInstance(safeAddress);

  const changeThreshold = async (metadata) => {
    try {
      if (!safeReadInstance) {
        toast.error("Safe is not ready");
        return;
      }

      if (metadata.new_threshold2 == "0" || !metadata.new_threshold2) {
        toast.error("0 or undefined threshold cannot be set");
        return;
      }

      // data
      const data = safeSingltonInterface.encodeFunctionData("changeThreshold", [
        metadata.new_threshold2,
      ]);

      const to = safeAddress;
      const value = 0;
      const operation = 0;
      const safeTxGas = 0;
      const baseGas = 0;
      const gasPrice = 0;
      const gasToken = ethers.constants.AddressZero;
      const refundReceiver = ethers.constants.AddressZero;
      const nonce = await safeReadInstance.nonce();

      const txHash = await safeReadInstance.getTransactionHash(
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
