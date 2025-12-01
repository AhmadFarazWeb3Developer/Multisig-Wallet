import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Inbox, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppKitAccount } from "@reown/appkit/react";
import { QueuedTxIface } from "../interfaces/Transactions";
import useGetQueuedTxs from "../../app/hooks/useGetQueuedTxs";
import useGetExecutedTxs from "@/app/hooks/useGetExecutedTxs";
import useGetRejectedTxs from "@/app/hooks/useGetRejectedTxs";

type QueuedTxCardProps = {
  setQueuedTxCount: Dispatch<SetStateAction<string>>;
};

export default function QueuedTxCard({ setQueuedTxCount }: QueuedTxCardProps) {
  const { isConnected, address } = useAppKitAccount();
  const { getQueuedTxs, isLoading } = useGetQueuedTxs();
  const { getExecutedTxs } = useGetExecutedTxs();
  const { getRejectedTxs } = useGetRejectedTxs();

  const [queuedTransactions, setQueuedTransactions] = useState<QueuedTxIface[]>(
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
      const rejectedData = await getRejectedTxs();

      const executedTxIds = executedData.map((tx: any) => tx.tx_id);
      const rejectedTxIds = rejectedData.map((tx: any) => tx.tx_id);

      let queuedTx = queuedData.filter(
        (tx: any) =>
          !executedTxIds.includes(tx.tx_id) && !rejectedTxIds.includes(tx.tx_id)
      );

      queuedTx = queuedTx.sort(
        (a: any, b: any) =>
          new Date(a.queued_at).getTime() - new Date(b.queued_at).getTime()
      );

      setQueuedTransactions(queuedTx);
      setQueuedTxCount(queuedTx.length);
    };
    init();
  }, [isConnected, address]);

  return (
    <div className="w-full space-y-3 flex items-center flex-col">
      {!isLoading ? (
        <div className="flex flex-col gap-2 w-full">
          {queuedTransactions.map((tx: QueuedTxIface) => (
            <div
              key={tx.tx_id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#1A1A1A] rounded-xl border border-[#333333] hover:border-[#eb5e28] hover:bg-[#222222] transition-all shadow-sm "
            >
              <p className=" text-[12px] font-medium  text-[#888]">
                {tx.operation_name}
              </p>

              <div className="flex flex-col sm:flex-row sm:gap-4 mt-2 sm:mt-0 text-[11px] text-[#888]">
                {renderMetadata(tx.metadata)}
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
      ) : (
        <div className="flex items-center gap-2 text-[#eb5e28] text-sm pt-4">
          <Loader2 className="animate-spin" size={16} /> Loading queued
          transactions...
        </div>
      )}

      {!isLoading && queuedTransactions.length === 0 && (
        <div className=" flex flex-row gap-2 items-center justify-center pt-4">
          <Inbox size={20} strokeWidth={1} className="text-[#A0A0A0]" />
          <p className="text-[#A0A0A0] text-sm">
            No queued transactions found.
          </p>
        </div>
      )}
    </div>
  );
}

function renderMetadata(metadata: QueuedTxIface["metadata"]) {
  const elements = [];

  if (metadata.eth_amount && metadata.eth_recipient) {
    elements.push(
      <span key="eth">
        ETH: {metadata.eth_amount} → {shortAddress(metadata.eth_recipient)}
      </span>
    );
  }

  if (metadata.token_amount && metadata.token_recipient) {
    elements.push(
      <span key="token">
        Amount: {metadata.token_amount} →
        {shortAddress(metadata.token_recipient)}
      </span>
    );
  }
  if (metadata.mint_token_amount) {
    elements.push(
      <span key="token">Amount: {metadata.mint_token_amount} </span>
    );
  }

  if (metadata.newOwner_for_swap) {
    elements.push(
      <span key="swapOwner">
        Swap Owner → {shortAddress(metadata.newOwner_for_swap)}
      </span>
    );
  }

  if (metadata.newOwner_with_threshold) {
    elements.push(
      <span key="newOwnerWithThreshold">
        New Owner (with threshold) →{" "}
        {shortAddress(metadata.newOwner_with_threshold)}
      </span>
    );
  }

  if (metadata.new_threshold1) {
    elements.push(
      <span key="threshold1">New Threshold 1 → {metadata.new_threshold1}</span>
    );
  }

  if (metadata.new_threshold2) {
    elements.push(
      <span key="threshold2">New Threshold 2 → {metadata.new_threshold2}</span>
    );
  }

  if (metadata.guardAddress) {
    elements.push(
      <span key="guard">Guard → {shortAddress(metadata.guardAddress)}</span>
    );
  }
  if (metadata.owner_for_removal) {
    elements.push(
      <span key="newOwner_for_removal">
        Remove Owner → {shortAddress(metadata.owner_for_removal)}
      </span>
    );
  }

  return elements.length > 0 ? elements : <span>—</span>;
}

function shortAddress(addr: string) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function timeAgo(timestamp?: string) {
  if (!timestamp) return "unknown";

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "unknown";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMinutes < 1) return "just now";
  if (diffHours < 1) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
