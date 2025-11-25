import { useEffect, useState } from "react";
import {
  Bell,
  Users,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  UserPlus,
  UserMinus,
  Settings,
  Key,
  ArrowRightLeft,
  Plus,
  Loader2,
} from "lucide-react";

import useGetQueuedTxs from "../../app/hooks/useGetQueuedTxs";
import useSafeSignatureCount from "@/blockchain-interaction/hooks/smartAccount/useSafeSignatureCount";
import useSafeInstance from "@/blockchain-interaction/hooks/smartAccount/useSafeInstance";
import useExecuteTransaction from "../../blockchain-interaction/hooks/smartAccount/useExecuteTransaction";
import { toast } from "sonner";

interface PendingTxCardProps {
  safeAddress: String;
}

export default function PendingTxCard({ safeAddress }: PendingTxCardProps) {
  const [threshold, setThreshold] = useState<string>();
  const { getQueuedTxs, isLoading } = useGetQueuedTxs();
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const safeSignatureCount = useSafeSignatureCount();
  const { safeWriteInstace, safeReadInstance } = useSafeInstance(safeAddress);
  const { executeTransaction, isApproving } = useExecuteTransaction();

  useEffect(() => {
    const init = async () => {
      const data = await getQueuedTxs();
      const { threshold, signaturesCount } = await safeSignatureCount(
        safeReadInstance,
        data
      );

      setThreshold(threshold.toNumber());

      setPendingTransactions(
        data.map((tx, index) => ({
          ...tx,
          signaturesCount: signaturesCount[index],
        }))
      );
    };

    init();
  }, []);

  const safeFormatKey = (key: string) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const safeRenderMetadata = (metadata: any) => {
    if (!metadata) return null;

    const obj = typeof metadata === "string" ? JSON.parse(metadata) : metadata;

    if (!obj || typeof obj !== "object") return null;

    return Object.entries(obj).map(([key, value]) => (
      <p key={key} className="text-[#6B7280] text-[11px]">
        {safeFormatKey(key)}: {String(value)}
      </p>
    ));
  };

  const handleExecuteTransaction = (tx: any) => {
    const init = async () => {
      if (!safeWriteInstace) {
        toast.error("wait for safe instance");
        return;
      }
      const data = await getQueuedTxs();
      await executeTransaction(tx, safeWriteInstace, data, safeAddress);
    };
    init();
  };

  return (
    <div className="space-y-3 w-full flex items-center flex-col">
      {pendingTransactions.length > 0 &&
        pendingTransactions.map((tx: any) => (
          <div
            key={tx.tx_id}
            className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 hover:border-[#eb5e28] transition-all w-full"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#242424] flex items-center justify-center border border-[#333333]">
                  {getTransactionIcon(tx.operation_name)}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">
                    {tx.operation_description}
                  </h3>
                  <p className="text-[#A0A0A0] text-xs">{tx.timestamp}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-[#eb5e28]/20 px-2.5 py-1 rounded-full border border-[#eb5e28]/30">
                <Clock size={12} className="text-[#eb5e28]" />
                {threshold && (
                  <span className="text-[#eb5e28] text-xs font-medium">
                    {tx.signaturesCount}/{threshold}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5 mb-3">
              {safeRenderMetadata(tx.metadata)}

              <div className="flex justify-between text-xs">
                <span className="text-[#A0A0A0]">Initiated by:</span>
                <span className="text-white">{tx.sender_name}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleExecuteTransaction(tx)}
                className="flex-1 bg-[#eb5e28] hover:bg-[#d54e20] text-white py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                disabled={isApproving}
              >
                {isApproving ? (
                  <Loader2 size={18} className="animate-spin text-white" />
                ) : (
                  <>
                    <CheckCircle className="size-4" />
                    Approve
                  </>
                )}
              </button>

              <button
                className="flex-1 bg-[#242424] hover:bg-[#303030] text-[#A0A0A0] hover:text-white py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 border border-[#333333] cursor-pointer"
                disabled={isApproving}
              >
                <XCircle className="size-4" />
                Reject
              </button>
            </div>

            {tx.status === "executed" && (
              <div className="flex items-center gap-1.5 text-[#10B981] text-xs font-medium">
                <CheckCircle size={14} />
                Successfully Executed
              </div>
            )}
            {tx.status === "rejected" && (
              <div className="flex items-center gap-1.5 text-[#EF4444] text-xs font-medium">
                <XCircle size={14} />
                Rejected
              </div>
            )}
          </div>
        ))}

      {isLoading && (
        <div className="flex items-center gap-2 text-[#eb5e28] text-sm">
          <Loader2 className="animate-spin" size={16} />
        </div>
      )}

      {pendingTransactions.length === 0 && !isLoading && (
        <p className="text-[#A0A0A0] text-sm">No queued transactions found.</p>
      )}
    </div>
  );
}

const getTransactionIcon = (type: any) => {
  switch (type) {
    case "transfer":
      return <Send size={16} className="text-[#3B82F6]" />;
    case "addOwner":
      return <UserPlus size={16} className="text-[#10B981]" />;
    case "removeOwner":
      return <UserMinus size={16} className="text-[#EF4444]" />;
    case "changeThreshold":
      return <Shield size={16} className="text-[#8B5CF6]" />;
    case "swapOwner":
      return <ArrowRightLeft size={16} className="text-[#eb5e28]" />;
    default:
      return <Settings size={16} className="text-[#A0A0A0]" />;
  }
};
