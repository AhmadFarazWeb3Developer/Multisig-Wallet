import { Key, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppKitAccount } from "@reown/appkit/react";
import useSignTransaction from "@/blockchain-interaction/hooks/smartAccount/useSignTransaction";
import { useEffect, useState } from "react";
import useGetQueuedTxs from "../../app/hooks/useGetQueuedTxs";
import useSafeSignatureCount from "@/blockchain-interaction/hooks/smartAccount/useSafeSignatureCount";
import useSafeInstance from "@/blockchain-interaction/hooks/smartAccount/useSafeInstance";

interface SignatureTxCardProps {
  safeAddress: String;
}

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

export default function SignatureTxCard({ safeAddress }: SignatureTxCardProps) {
  const { signTransaction, isSigning } = useSignTransaction(safeAddress);
  const { isConnected, address } = useAppKitAccount();
  const [toBeSignedTransactions, setToBeSignedTransactions] = useState<any[]>(
    []
  );
  const { getQueuedTxs, isLoading } = useGetQueuedTxs();
  const safeSignatureCount = useSafeSignatureCount();
  const { safeReadInstance } = useSafeInstance(safeAddress);

  useEffect(() => {
    const init = async () => {
      if (!isConnected || !address) {
        toast.error("wallet is not connected!", {
          action: { label: "Close", onClick: () => {} },
        });
        return;
      }

      const data = await getQueuedTxs();
      const { safe_transaction_signatures } = await safeSignatureCount(
        safeReadInstance,
        data
      );

      const notSigned = data.filter(
        (tx: Transaction) =>
          !safe_transaction_signatures.some(
            (sig) =>
              sig.tx_id === tx.tx_id &&
              sig.owner_address.toLowerCase() === address.toLowerCase()
          )
      );

      // Sort oldest first
      const sortedNotSigned = notSigned.sort(
        (a: Transaction, b: Transaction) =>
          new Date(a.queued_at).getTime() - new Date(b.queued_at).getTime()
      );

      setToBeSignedTransactions(sortedNotSigned);
    };
    init();
  }, [isConnected, address]);

  const handleTransactionSignature = async (tx: any) => {
    await signTransaction(tx, address);
  };

  const firstTx = toBeSignedTransactions[0];

  return (
    <div className="space-y-3 flex items-center flex-col w-full">
      {firstTx ? (
        <div
          key={firstTx.tx_id}
          className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 hover:border-[#eb5e28] transition-all w-full"
        >
          <h3 className="text-white font-semibold text-sm tracking-wide">
            {firstTx.operation_name}
          </h3>

          <div className="space-y-1 text-[#6B7280] text-[11px] mt-2">
            {Object.entries(firstTx.metadata).map(([key, value]) => (
              <p key={key}>
                <span className="font-medium">{formatKey(key)}:</span> {value}
              </p>
            ))}
          </div>

          <p className="text-[#6B7280] text-[11px] mt-1">
            {timeAgo(firstTx.queued_at)}
          </p>

          <p className="text-[#A0A0A0] text-xs">
            <span className="text-[#6B7280] mr-1">Description:</span>
            {firstTx.operation_description}
          </p>

          <p className="text-[#A0A0A0] text-xs">
            <span className="text-[#6B7280] mr-1">From:</span>
            {firstTx.sender_address.slice(0, 6)}...
            {firstTx.sender_address.slice(-4)}
          </p>

          <p className="text-[#A0A0A0] text-xs">
            <span className="text-[#6B7280] mr-1">Sender:</span>
            {firstTx.sender_name}
          </p>

          <p className="text-white font-mono text-xs">
            <span className="text-[#6B7280] mr-1">Tx:</span>
            {firstTx.tx_id.slice(0, 10)}...{firstTx.tx_id.slice(-6)}
          </p>

          <div className="flex justify-end mt-3">
            <button
              onClick={() => handleTransactionSignature(firstTx)}
              className="bg-[#eb5e28] hover:bg-[#d54e20] text-white flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              disabled={isSigning}
            >
              {isSigning ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Key size={14} />
              )}
              {isSigning ? "Signing..." : "Sign"}
            </button>
          </div>
        </div>
      ) : (
        !isLoading && (
          <p className="text-[#A0A0A0] text-sm">
            No queued transactions found.
          </p>
        )
      )}
    </div>
  );
}

function formatKey(key: string) {
  return key
    .replace(/_/g, " ") // replace underscores with spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize each word
}

function timeAgo(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) {
    const minutes = Math.floor(diffMs / (1000 * 60));
    return `${minutes}m ago`;
  }

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const days = Math.floor(diffHours / 24);
  return `${days}d ago`;
}
