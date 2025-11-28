"use client";
import { useEffect, useState } from "react";
import { CheckCircle, Clock, Loader2 } from "lucide-react";
import useExecutedTxs from "../../app/hooks/useGetExecutedTxs";

interface ExecutedTransaction {
  id: number;
  tx_id: string;
  tx_hash: string;
  operation_name: string;
  status: number;
  executed_at: string;
  metadata: {
    eth_amount?: string;
    eth_recipient?: string;
    token_amount?: string;
    token_recipient?: string;
    mint_token_amount?: string;
    newOwner_with_threshold?: string;
    new_threshold1?: string;
    prevOwner_for_removal?: string;
    newOwner_for_removal?: string;
    newThreshold_for_removal?: string;
    prevOwner_for_swap?: string;
    oldOwner_for_swap?: string;
    newOwner_for_swap?: string;
    new_threshold2?: string;
    guard_address?: string;
  };
}

export default function ExecutedTxCard() {
  const { getExecutedTxs, isLoading } = useExecutedTxs();
  const [executedTransactions, setExecutedTransactions] = useState<
    ExecutedTransaction[]
  >([]);

  useEffect(() => {
    const fetchTxs = async () => {
      const data = await getExecutedTxs();
      setExecutedTransactions(data);
    };
    fetchTxs();
  }, []);

  const formatMetadataKey = (key: string) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="space-y-3  flex items-center flex-col w-full">
      {executedTransactions.map((tx) => (
        <div
          key={tx.tx_id}
          className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 hover:border-[#eb5e28] transition-all w-full "
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-semibold text-sm">
              {tx.operation_name}
            </h3>
            <div className="flex items-center gap-2 text-[#10B981] text-xs font-medium">
              <CheckCircle size={14} />
              Executed
            </div>
          </div>

          <div className="space-y-1 text-[#6B7280] text-[11px]">
            {Object.entries(tx.metadata).map(([key, value]) =>
              value ? (
                <p key={key}>
                  {formatMetadataKey(key)}: {value}
                </p>
              ) : null
            )}
          </div>

          <div className="text-[#A0A0A0] text-xs mt-2 flex justify-between">
            <span>
              Tx Hash: {tx.tx_hash.slice(0, 10)}...{tx.tx_hash.slice(-6)}
            </span>
            <span>
              <Clock size={12} className="inline mr-1" />
              {new Date(tx.executed_at).toLocaleString()}
            </span>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex items-center gap-2 text-[#eb5e28] text-sm">
          <Loader2 className="animate-spin" size={16} />
          <span>Loading executed transactions...</span>
        </div>
      )}

      {executedTransactions.length === 0 && !isLoading && (
        <p className="text-[#A0A0A0] text-sm">
          No executed transactions found.
        </p>
      )}
    </div>
  );
}
