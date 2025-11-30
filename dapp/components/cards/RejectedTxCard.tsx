"use client";

import { useEffect, useState } from "react";
import { XCircle, Clock, Loader2 } from "lucide-react";
import { RejectedTxIface } from "../interfaces/Transactions";
import useGetRejectedTxs from "@/app/hooks/useGetRejectedTxs";

export default function RejectedTxCard() {
  const [rejectedTransactions, setRejectedTransactions] = useState<
    RejectedTxIface[]
  >([]);
  const { getRejectedTxs, isLoading } = useGetRejectedTxs();

  useEffect(() => {
    const init = async () => {
      const data = await getRejectedTxs();
      setRejectedTransactions(data);
    };
    init();
  }, []);

  const sliceAddress = (addr: string) =>
    addr.length > 10 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;

  const safeFormatKey = (key: string) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const renderMetadata = (metadata: any) => {
    if (!metadata) return null;
    const obj = typeof metadata === "string" ? JSON.parse(metadata) : metadata;
    return Object.entries(obj).map(([key, value]) => (
      <p key={key} className="text-[#6B7280] text-[11px]">
        {safeFormatKey(key)}: {String(value)}
      </p>
    ));
  };

  if (!rejectedTransactions || rejectedTransactions.length === 0) {
    return (
      <div className="rounded-xl border border-gray-700 bg-[#1A1A1A] shadow p-4 text-gray-400 text-center">
        No rejected transactions found.
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full flex flex-col">
      {rejectedTransactions.map((tx) => (
        <div
          key={tx.tx_id}
          className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 hover:border-[#EF4444] transition-all"
        >
          <div className="flex items-center gap-2 border-b border-[#333333] pb-2 mb-3">
            <span className="text-red-500 text-lg">
              <XCircle size={18} />
            </span>
            <h3 className="text-white font-semibold text-sm">
              Rejected Transaction
            </h3>
            <div className="flex-1"></div>
            <div className="flex items-center gap-1.5 bg-red-500/20 px-2 py-0.5 rounded-full text-red-400 text-xs">
              <Clock size={12} />
              Rejected
            </div>
          </div>

          <div className="space-y-1.5 mb-3 text-sm">
            {tx.operation_name && (
              <div className="flex justify-between">
                <span className="text-[#A0A0A0]">Operation:</span>
                <span className="text-white font-medium">
                  {tx.operation_name}
                </span>
              </div>
            )}
            {tx.sender_address && (
              <div className="flex justify-between">
                <span className="text-[#A0A0A0]">Sender:</span>
                <span className="text-white font-medium">
                  {sliceAddress(tx.sender_address)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#A0A0A0]">Rejected By:</span>
              <span className="text-white font-medium">
                {sliceAddress(tx.rejected_by)}
              </span>
            </div>

            <div className="mt-2">
              <span className="text-[#A0A0A0] block mb-1">Metadata:</span>
              <div className="bg-[#242424] rounded-lg p-2 space-y-1 text-xs">
                {renderMetadata(tx.metadata)}
              </div>
            </div>

            <div className="flex justify-between pt-2 text-xs text-[#A0A0A0]">
              <span>Rejected At:</span>
              <span className="text-white">
                {new Date(tx.rejected_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <Loader2 className="animate-spin" size={16} />
        </div>
      )}
    </div>
  );
}
