import { toast } from "sonner";

const useSafeSignatureCount = () => {
  const safeSignatureCount = async (safeInstance, data) => {
    if (!safeInstance) {
      toast.error("wait for instance", { action: { label: "Close" } });
      return { signaturesCount: [], threshold: 0 };
    }

    const threshold = await safeInstance.getThreshold();

    const ids = data.map((tx) => tx.tx_id);

    const response = await fetch("/api/transactions/get-sign-transactions", {
      method: "GET",
    });

    const safe_transaction_signatures = await response.json();

    const signaturesCount = ids.map((id) => {
      return safe_transaction_signatures.filter((sig) => sig.tx_id === id)
        .length;
    });

    return { signaturesCount, threshold, safe_transaction_signatures };
  };

  return safeSignatureCount;
};

export default useSafeSignatureCount;
