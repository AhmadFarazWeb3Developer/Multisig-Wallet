import { ethers } from "ethers";
import { toast } from "sonner";

const useSafeSignatureCount = () => {
  const safeSignatureCount = async (safeInstance, data) => {
    if (!safeInstance) {
      toast.error("wait for instance");
      return { signaturesCount: [], threshold: 0 };
    }

    const threshold = await safeInstance.getThreshold();
    const signaturesCount = [];

    const hashes = data.map((tx) => tx.tx_hash);
    const owners = await safeInstance.getOwners();

    for (const owner of owners) {
      for (const hash of hashes) {
        const hashBytes = ethers.utils.arrayify(hash);
        const approved = await safeInstance.approvedHashes(owner, hashBytes);
        console.log(approved);
        signaturesCount.push(approved.toNumber());
      }
    }

    return { signaturesCount, threshold };
  };

  return safeSignatureCount;
};

export default useSafeSignatureCount;
