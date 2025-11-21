import { toast } from "sonner";

const useSafeSignatureCount = () => {
  const safeSignatureCount = async (safeInstance, data) => {
    if (!safeInstance) {
      toast.error("wait for instance", { action: { label: "Close" } });
      return { signaturesCount: [], threshold: 0 };
    }

    const threshold = await safeInstance.getThreshold();

    const hashes = data.map((tx) => tx.tx_hash);
    const owners = await safeInstance.getOwners();

    const response = await fetch("/api/transactions/get-sign-transactions", {
      method: "GET",
    });

    const safe_transaction_signatures = await response.json();

    const signaturesCount = hashes.map((hash) => {
      return safe_transaction_signatures.filter((sig) => sig.tx_hash === hash)
        .length;
    });

    console.log("data : ", data);
    console.log("hashes : ", hashes);
    console.log("signature count  : ", signaturesCount);

    console.log("safe signatures :", safe_transaction_signatures);

    return { signaturesCount, threshold, safe_transaction_signatures };
  };

  return safeSignatureCount;
};

export default useSafeSignatureCount;
