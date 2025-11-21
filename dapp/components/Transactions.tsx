"use client";
import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { useRouter } from "next/navigation";

import useGetQueuedTxs from "../app/hooks/useGetQueuedTxs";
import useSafeInstance from "@/blockchain-interaction/hooks/smartAccount/useSafeInstance";
import useSafeSignatureCount from "@/blockchain-interaction/hooks/smartAccount/useSafeSignatureCount";
import useSignTransaction from "@/blockchain-interaction/hooks/smartAccount/useSignTransaction";
import { toast } from "sonner";
import { useAppKitAccount } from "@reown/appkit/react";

type safeAddressInterface = {
  safeAddress: String;
};

export default function Transactions({ safeAddress }: safeAddressInterface) {
  const { isConnected, address } = useAppKitAccount();
  const router = useRouter();

  const [toBeSignedTransactions, setToBeSignedTransactions] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [threshold, setThreshold] = useState<string>();
  const [activeTab, setActiveTab] = useState("signatures");

  const safeInstance = useSafeInstance(safeAddress);
  const safeSignatureCount = useSafeSignatureCount();
  const getQueuedTxs = useGetQueuedTxs();
  const signTransaction = useSignTransaction();

  useEffect(() => {
    const init = async () => {
      if (!safeInstance) {
        toast.error("wait for safe instance");
      } else {
      }

      if (activeTab == "pending") {
        const data = await getQueuedTxs();
        const { signaturesCount } = await safeSignatureCount(
          safeInstance,
          data
        );

        const formatedData = data.map((tx, index) => ({
          ...tx,
          signaturesCount: signaturesCount[index],
        }));

        setPendingTransactions(formatedData);
      }
      if (activeTab == "signatures") {
        const data = await getQueuedTxs();

        const { threshold, safe_transaction_signatures } =
          await safeSignatureCount(safeInstance, data);

        const filterNotSignedOnes = data.filter((tx) => {
          const hasSigned = safe_transaction_signatures.some(
            (sig) =>
              sig.tx_hash === tx.tx_hash &&
              sig.owner_address.toLowerCase() === address.toLowerCase()
          );

          // only include if user hasn't signed yet
          return !hasSigned;
        });

        setThreshold(threshold.toNumber());
        setToBeSignedTransactions(filterNotSignedOnes);
      }
      if (activeTab == "executed") {
      }

      if (activeTab == "rejected") {
      }
    };
    init();
  }, [activeTab, safeInstance]);

  const handleTransactionSignature = (tx_hash: string) => {
    const init = async () => {
      if (!isConnected || !address) {
        toast.error("wallet is not connected!", { action: { label: "Close" } });
        return;
      } else {
        await signTransaction(tx_hash, address);
      }
    };
    init();
  };

  function timeAgo(timestamp) {
    const date = new Date(timestamp);
    // console.log(date);
    const now = new Date();
    // console.log(now);
    const diffMs = now - date;
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

  const executedTransactions = [
    {
      id: 4,
      type: "transfer",
      to: "0x1111...2222",
      value: "0.5 ETH",
      description: "Successful payment",
      status: "executed",
      timestamp: "2 days ago",
    },
  ];

  const rejectedTransactions = [
    {
      id: 5,
      type: "removeOwner",
      address: "0x3333...4444",
      description: "Remove owner proposal",
      status: "rejected",
      timestamp: "3 days ago",
    },
  ];

  const getTransactionIcon = ({ type }: any) => {
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

  const SignatureCard = ({ tx }: any) => (
    <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 hover:border-[#eb5e28] transition-all">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h3 className="text-white font-semibold text-sm tracking-wide">
            {tx.operation_name}
          </h3>

          {tx.metadata.eth_amount && (
            <p className="text-[#6B7280] text-[11px]">
              Amount: {tx.metadata.eth_amount} ETH
            </p>
          )}
          {tx.metadata.eth_recipient && (
            <p className="text-[#6B7280] text-[11px]">
              To: {tx.metadata.eth_recipient}
            </p>
          )}
          {tx.metadata.token_amount && (
            <p className="text-[#6B7280] text-[11px]">
              Token Amount: {tx.metadata.token_amount}
            </p>
          )}
          {tx.metadata.token_recipient && (
            <p className="text-[#6B7280] text-[11px]">
              To: {tx.metadata.token_recipient}
            </p>
          )}
          {tx.metadata.mint_token_amount && (
            <p className="text-[#6B7280] text-[11px]">
              Mint: {tx.metadata.mint_token_amount}
            </p>
          )}

          {tx.metadata.newOwner_with_threshold && (
            <p className="text-[#6B7280] text-[11px]">
              New Owner: {tx.metadata.newOwner_with_threshold}
            </p>
          )}
          {tx.metadata.new_threshold1 && (
            <p className="text-[#6B7280] text-[11px]">
              Threshold: {tx.metadata.new_threshold1}
            </p>
          )}
          {tx.metadata.prevOwner_for_removal && (
            <p className="text-[#6B7280] text-[11px]">
              Previous Owner: {tx.metadata.prevOwner_for_removal}
            </p>
          )}
          {tx.metadata.newOwner_for_removal && (
            <p className="text-[#6B7280] text-[11px]">
              New Owner: {tx.metadata.newOwner_for_removal}
            </p>
          )}
          {tx.metadata.newThreshold_for_removal && (
            <p className="text-[#6B7280] text-[11px]">
              Threshold: {tx.metadata.newThreshold_for_removal}
            </p>
          )}

          {tx.metadata.prevOwner_for_swap && (
            <p className="text-[#6B7280] text-[11px]">
              Previous Owner: {tx.metadata.prevOwner_for_swap}
            </p>
          )}
          {tx.metadata.oldOwner_for_swap && (
            <p className="text-[#6B7280] text-[11px]">
              Old Owner: {tx.metadata.oldOwner_for_swap}
            </p>
          )}
          {tx.metadata.newOwner_for_swap && (
            <p className="text-[#6B7280] text-[11px]">
              New Owner: {tx.metadata.newOwner_for_swap}
            </p>
          )}
          {tx.metadata.new_threshold2 && (
            <p className="text-[#6B7280] text-[11px]">
              Threshold: {tx.metadata.new_threshold2}
            </p>
          )}

          {tx.metadata.guard_address && (
            <p className="text-[#6B7280] text-[11px]">
              Guard Address: {tx.metadata.guard_address}
            </p>
          )}

          <p className="text-[#6B7280] text-[11px]"> {timeAgo(tx.queued_at)}</p>

          <p className="text-[#A0A0A0] text-xs">
            <span className="text-[#6B7280] mr-1">Description:</span>
            {tx.operation_description}
          </p>

          <p className="text-[#A0A0A0] text-xs">
            <span className="text-[#6B7280] mr-1">From:</span>
            {tx.sender_address.slice(0, 6)}...
            {tx.sender_address.slice(-4)}
          </p>

          <p className="text-[#A0A0A0] text-xs">
            <span className="text-[#6B7280] mr-1">Sender:</span>
            {tx.sender_name}
          </p>

          <p className="text-white font-mono text-xs">
            <span className="text-[#6B7280] mr-1">Tx:</span>
            {tx.tx_hash.slice(0, 10)}...{tx.tx_hash.slice(-6)}
          </p>
        </div>
      </div>

      <div className="flex justify-end mt-3">
        <button
          onClick={() => handleTransactionSignature(tx.tx_hash)}
          className="bg-[#eb5e28] hover:bg-[#d54e20] text-white flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
        >
          <Key size={14} />
          Sign
        </button>
      </div>
    </div>
  );

  const TransactionCard = ({ tx, isPending = false }: any) => (
    <div className="bg-[#1A1A1A]  border border-[#333333] rounded-xl p-4 hover:border-[#eb5e28] transition-all">
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
        {isPending && (
          <div className="flex items-center gap-1.5 bg-[#eb5e28]/20 px-2.5 py-1 rounded-full border border-[#eb5e28]/30">
            <Clock size={12} className="text-[#eb5e28]" />
            {threshold && (
              <span className="text-[#eb5e28] text-xs font-medium">
                {tx.signaturesCount}/{threshold}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-1.5 mb-3">
        {tx.metadata.eth_amount && (
          <p className="text-[#6B7280] text-[11px]">
            Amount: {tx.metadata.eth_amount} ETH
          </p>
        )}
        {tx.metadata.eth_recipient && (
          <p className="text-[#6B7280] text-[11px]">
            To: {tx.metadata.eth_recipient}
          </p>
        )}
        {tx.metadata.token_amount && (
          <p className="text-[#6B7280] text-[11px]">
            Token Amount: {tx.metadata.token_amount}
          </p>
        )}
        {tx.metadata.token_recipient && (
          <p className="text-[#6B7280] text-[11px]">
            To: {tx.metadata.token_recipient}
          </p>
        )}
        {tx.metadata.mint_token_amount && (
          <p className="text-[#6B7280] text-[11px]">
            Mint: {tx.metadata.mint_token_amount}
          </p>
        )}

        {tx.metadata.newOwner_with_threshold && (
          <p className="text-[#6B7280] text-[11px]">
            New Owner: {tx.metadata.newOwner_with_threshold}
          </p>
        )}
        {tx.metadata.new_threshold1 && (
          <p className="text-[#6B7280] text-[11px]">
            Threshold: {tx.metadata.new_threshold1}
          </p>
        )}
        {tx.metadata.prevOwner_for_removal && (
          <p className="text-[#6B7280] text-[11px]">
            Previous Owner: {tx.metadata.prevOwner_for_removal}
          </p>
        )}
        {tx.metadata.newOwner_for_removal && (
          <p className="text-[#6B7280] text-[11px]">
            New Owner: {tx.metadata.newOwner_for_removal}
          </p>
        )}
        {tx.metadata.newThreshold_for_removal && (
          <p className="text-[#6B7280] text-[11px]">
            Threshold: {tx.metadata.newThreshold_for_removal}
          </p>
        )}

        {tx.metadata.prevOwner_for_swap && (
          <p className="text-[#6B7280] text-[11px]">
            Previous Owner: {tx.metadata.prevOwner_for_swap}
          </p>
        )}
        {tx.metadata.oldOwner_for_swap && (
          <p className="text-[#6B7280] text-[11px]">
            Old Owner: {tx.metadata.oldOwner_for_swap}
          </p>
        )}
        {tx.metadata.newOwner_for_swap && (
          <p className="text-[#6B7280] text-[11px]">
            New Owner: {tx.metadata.newOwner_for_swap}
          </p>
        )}
        {tx.metadata.new_threshold2 && (
          <p className="text-[#6B7280] text-[11px]">
            Threshold: {tx.metadata.new_threshold2}
          </p>
        )}

        {tx.metadata.guard_address && (
          <p className="text-[#6B7280] text-[11px]">
            Guard Address: {tx.metadata.guard_address}
          </p>
        )}

        <div className="flex justify-between text-xs">
          <span className="text-[#A0A0A0]">Initiated by:</span>
          <span className="text-white">{tx.sender_name}</span>
        </div>
      </div>

      {isPending && (
        <div className="flex gap-2">
          <button className="flex-1 bg-[#eb5e28] hover:bg-[#d54e20] text-white py-1.5 sm:py-2 rounded-lg  text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <CheckCircle className="  size-4" />
            Approve
          </button>
          <button className="flex-1 bg-[#242424] hover:bg-[#303030] text-[#A0A0A0] hover:text-white py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 border border-[#333333] cursor-pointer">
            <XCircle className=" size-4" />
            Reject
          </button>
        </div>
      )}

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
  );

  return (
    <main className="min-h-screen  w-full  bg-[#0e0e0e] p-3 sm:p-6">
      <div className=" w-full ">
        <div className="grid  w-full grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="sm:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#A0A0A0] text-xs sm:text-sm ">
                  Manage your wallet transactions and owners
                </p>
              </div>
              <button
                onClick={() =>
                  router.push(`/new-transaction?safeAddress=${safeAddress}`)
                }
                className="w-30 bg-[#eb5e28] hover:bg-[#d54e20] text-white flex items-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full  text-[10px] sm:text-sm font-semibold transition-all shadow-lg hover:shadow-xl cursor-pointer"
              >
                <Plus className="size-3 sm:size-4" />
                New Transaction
              </button>
            </div>

            <div className="flex gap-2 border-b border-[#333333]">
              <button
                onClick={() => setActiveTab("signatures")}
                className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ${
                  activeTab === "signatures"
                    ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#eb5e28]"
                    : "text-[#A0A0A0] hover:text-white"
                }`}
              >
                Sign ({toBeSignedTransactions.length})
              </button>

              <button
                onClick={() => setActiveTab("pending")}
                className={`flex-1 py-2.5 px-4  text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ${
                  activeTab === "pending"
                    ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#eb5e28]"
                    : "text-[#A0A0A0] hover:text-white"
                }`}
              >
                Pending ({pendingTransactions.length})
              </button>
              <button
                onClick={() => setActiveTab("executed")}
                className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ${
                  activeTab === "executed"
                    ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#eb5e28]"
                    : "text-[#A0A0A0] hover:text-white"
                }`}
              >
                Executed ({executedTransactions.length})
              </button>
              <button
                onClick={() => setActiveTab("rejected")}
                className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ${
                  activeTab === "rejected"
                    ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#eb5e28]"
                    : "text-[#A0A0A0] hover:text-white"
                }`}
              >
                Rejected ({rejectedTransactions.length})
              </button>
            </div>

            <div className="space-y-3">
              {activeTab === "signatures" &&
                toBeSignedTransactions.map((tx, index) => (
                  <SignatureCard key={index} tx={tx} />
                ))}

              {activeTab === "pending" &&
                pendingTransactions.map((tx, index) => (
                  <TransactionCard key={index} tx={tx} isPending={true} />
                ))}
              {activeTab === "executed" &&
                executedTransactions.map((tx) => (
                  <TransactionCard key={tx.id} tx={tx} />
                ))}
              {activeTab === "rejected" &&
                rejectedTransactions.map((tx) => (
                  <TransactionCard key={tx.id} tx={tx} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
