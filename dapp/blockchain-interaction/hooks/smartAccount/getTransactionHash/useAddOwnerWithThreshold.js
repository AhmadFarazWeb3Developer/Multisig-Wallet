import { ethers } from "ethers";

import Interfaces from "../../../helper/interfaces";

import useSafeInstance from "../useSafeInstance";
import { toast } from "sonner";
import { isAddress } from "ethers/lib/utils";

const useAddOwnerWithThreshold = (safeAddress) => {
  const { safeSingltonInterface } = Interfaces();
  const { safeReadInstance } = useSafeInstance(safeAddress);

  const addOwnerWithThreshold = async (metadata) => {
    try {
      if (!safeReadInstance) {
        toast.error("Safe is not ready");
        return;
      }

      if (!metadata.newOwner_with_threshold || !metadata.new_threshold1) {
        toast.error("Fill the form before proceeding");
        return;
      }

      if (!isAddress(metadata.newOwner_with_threshold)) {
        toast.error("owner must be a valid address");
        return;
      }

      const data = safeSingltonInterface.encodeFunctionData(
        "addOwnerWithThreshold",
        [metadata.newOwner_with_threshold, metadata.new_threshold1]
      );

      const to = safeAddress;
      const value = 0;
      const operation = 0;
      const safeTxGas = 0;
      const baseGas = 0;
      const gasPrice = 0;
      const gasToken = ethers.constants.AddressZero;
      const refundReceiver = ethers.constants.AddressZero;
      const nonce = await safeReadInstance.nonce();

      // transaction hash
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
      toast.error(`Error sending tokens: ${error.message || error}`);
    }
  };

  return addOwnerWithThreshold;
};

export default useAddOwnerWithThreshold;
