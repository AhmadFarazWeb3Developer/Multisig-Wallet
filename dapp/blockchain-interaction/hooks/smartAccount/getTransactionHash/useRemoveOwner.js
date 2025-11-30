import { ethers } from "ethers";

import Interfaces from "../../../helper/interfaces";

import useSafeInstance from "../useSafeInstance";
import { toast } from "sonner";

const useRemoveOwner = (safeAddress) => {
  const { safeSingltonInterface } = Interfaces();
  const { safeReadInstance } = useSafeInstance(safeAddress);

  const removeOwner = async (tx) => {
    try {
      if (!safeReadInstance) {
        toast.error("Safe is not ready");
        return;
      }

      if (!tx.metadata.newThreshold_for_removal) {
        toast.error("Fill the form before proceeding");
        return;
      }

      const owners = await safeReadInstance.getOwners();

      const index = owners
        .map((o) => o.toLowerCase())
        .indexOf(String(tx.metadata.owner_for_removal).trim().toLowerCase());

      const SENTINEL = "0x0000000000000000000000000000000000000001";
      const prevOwner = index === 0 ? SENTINEL : owners[index - 1];

      const data = safeSingltonInterface.encodeFunctionData("removeOwner", [
        prevOwner,
        tx.metadata.owner_for_removal,
        tx.metadata.newThreshold_for_removal,
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
      toast.error(`Error sending tokens: ${error.message || error}`, {
        action: {
          label: "Close",
        },
      });
    }
  };

  return removeOwner;
};

export default useRemoveOwner;
