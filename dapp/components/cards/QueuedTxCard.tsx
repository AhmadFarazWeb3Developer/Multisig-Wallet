import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppKitAccount } from "@reown/appkit/react";
import { useEffect, useState } from "react";
import useGetQueuedTxs from "../../app/hooks/useGetQueuedTxs";
import useGetExecutedTxs from "@/app/hooks/useGetExecutedTxs";

interface Transaction {
  tx_id: string;
  operation_name: string;
  operation_description: string;
  sender_address: string;
  sender_name: string;
  queued_at: string;
  metadata: {
    eth_amount?: string;
    eth_recipient?: string;
    token_amount?: string;
    token_recipient?: string;
  };
}

export default function QueuedTxCard() {
  const { isConnected, address } = useAppKitAccount();
  const { getQueuedTxs, isLoading } = useGetQueuedTxs();
  const { getExecutedTxs } = useGetExecutedTxs();

  const [queuedTransactions, setQueuedTransactions] = useState<Transaction[]>(
    []
  );

  useEffect(() => {
    const init = async () => {
      if (!isConnected || !address) {
        toast.error("Wallet not connected!", {
          action: { label: "Close", onClick: () => {} },
        });
        return;
      }
      const queuedData = await getQueuedTxs();
      const executedData = await getExecutedTxs();

      const executedTxIds = executedData.map((tx: any) => tx.tx_id);
      const queuedTx = queuedData.filter(
        (tx: any) => !executedTxIds.includes(tx.tx_id)
      );

      setQueuedTransactions(queuedTx);
    };
    init();
  }, [isConnected, address]);

  return (
    <div className="w-full space-y-3 flex items-center  flex-col">
      {isLoading && (
        <div className="flex items-center gap-2 text-[#eb5e28] text-sm p-4">
          {" "}
          <Loader2 className="animate-spin" size={16} /> Loading queued
          transactions...{" "}
        </div>
      )}

      {!isLoading && queuedTransactions.length === 0 && (
        <p className="text-[#A0A0A0] text-sm p-4">
          No queued transactions found.
        </p>
      )}
      <div className="flex flex-col gap-2 w-full">
        {queuedTransactions.map((tx) => (
          <div
            key={tx.tx_id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#1A1A1A] rounded-xl border border-[#333333] hover:border-[#eb5e28] hover:bg-[#222222] transition-all shadow-sm "
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 w-full">
              <div className="flex flex-col">
                <h4 className="text-white font-semibold text-sm">
                  {tx.operation_name}
                </h4>
                <span className="text-[#A0A0A0] text-[12px] mt-0.5">
                  {tx.operation_description}
                </span>
              </div>

              {/* Middle: amounts */}
              <div className="flex flex-col sm:flex-row sm:gap-4 mt-2 sm:mt-0 text-[11px] text-[#888]">
                {tx.metadata.eth_amount && tx.metadata.eth_recipient && (
                  <span>
                    ETH: {tx.metadata.eth_amount} →{" "}
                    {shortAddress(tx.metadata.eth_recipient)}
                  </span>
                )}
                {tx.metadata.token_amount && tx.metadata.token_recipient && (
                  <span>
                    Token: {tx.metadata.token_amount} →{" "}
                    {shortAddress(tx.metadata.token_recipient)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:items-end mt-3 sm:mt-0 text-[11px] text-[#888]">
              <span>{timeAgo(tx.queued_at)}</span>
              <span className="mt-1 px-2 py-0.5 bg-[#222222] text-[#888] rounded-full text-[10px] font-medium">
                Queued
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function shortAddress(addr: string) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function timeAgo(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return `${Math.floor(diffMs / (1000 * 60))}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}
