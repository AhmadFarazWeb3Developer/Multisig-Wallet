"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { XCircle, Clock, Loader2, Inbox } from "lucide-react";
import { RejectedTxIface } from "../interfaces/Transactions";
import useGetRejectedTxs from "@/app/hooks/useGetRejectedTxs";

type RejectedTxCardProps = {
  setRejectedTxCount: Dispatch<SetStateAction<string>>;
};
export default function RejectedTxCard({
  setRejectedTxCount,
}: RejectedTxCardProps) {
  const [rejectedTransactions, setRejectedTransactions] = useState<
    RejectedTxIface[]
  >([]);
  const { getRejectedTxs, isLoading } = useGetRejectedTxs();

  useEffect(() => {
    const init = async () => {
      const data = await getRejectedTxs();
      setRejectedTransactions(data);
      setRejectedTxCount(data.length);
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

  return (
    <div className="space-y-3 flex items-center flex-col w-full ">
      {rejectedTransactions.map((tx) => (
        <div
          key={tx.tx_id}
          className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 hover:border-[#EF4444] transition-all w-full"
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
        <div className="flex items-center gap-2 text-red-500 text-sm pt-4">
          <Loader2 className="animate-spin" size={16} /> Loading rejected
          transactions...{" "}
        </div>
      )}

      {!isLoading && rejectedTransactions.length === 0 && (
        <div className=" flex flex-row gap-2  items-center justify-center pt-4">
          <Inbox size={20} strokeWidth={1} className="text-[#A0A0A0]" />
          <p className="text-[#A0A0A0] text-sm">
            No rejected transactions found.
          </p>
        </div>
      )}
    </div>
  );
}
