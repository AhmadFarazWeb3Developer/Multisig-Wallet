import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "sonner";

const { useState } = require("react");

const useRejectTransaction = () => {
  const [isRejecting, setIsRejecting] = useState(false);

  const { isConnected, address } = useAppKitAccount();

  const rejectTransaction = async (tx) => {
    try {
      setIsRejecting(true);
      if (!isConnected || !address) {
        toast.error("Wallet not ready yet", {
          action: { label: "Close", onClick: () => {} },
        });
        return;
      }

      const payload = {
        tx_id: tx.tx_id,
        operation_name: tx.operation_name,
        sender_name: tx.sender_address,
        rejected_by: address,
        metadata: tx.metadata,
      };
      const res = await fetch(`/api/transactions/store-rejected-transaction`, {
        method: "POST",
        headers: {},
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.status === 200) {
        toast.success("Transaction Rejected!", {
          action: { label: "Close", onClick: () => {} },
        });
      }
    } catch (error) {
    } finally {
      setIsRejecting(false);
    }
  };
  return { rejectTransaction, isRejecting };
};

export default useRejectTransaction;
