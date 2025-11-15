"use client";
import React, { useState } from "react";
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

export default function Transactions() {
  const [notifications, setNotifications] = useState(3);
  const [activeTab, setActiveTab] = useState("pending");

  const router = useRouter();
  const owners = [
    { address: "0x1234...5678", name: "Alice", isYou: true },
    { address: "0x8765...4321", name: "Bob", isYou: false },
    { address: "0xabcd...efgh", name: "Charlie", isYou: false },
  ];

  const threshold = 2;
  const totalOwners = owners.length;

  const pendingTransactions = [
    {
      id: 1,
      type: "transfer",
      to: "0x9876...1234",
      value: "1.5 ETH",
      description: "Payment to vendor",
      confirmations: 1,
      required: threshold,
      initiator: "Alice",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      type: "addOwner",
      address: "0x5555...6666",
      description: "Add new owner David",
      confirmations: 0,
      required: threshold,
      initiator: "Bob",
      timestamp: "5 hours ago",
    },
    {
      id: 3,
      type: "changeThreshold",
      newThreshold: 3,
      description: "Increase threshold to 3",
      confirmations: 1,
      required: threshold,
      initiator: "Charlie",
      timestamp: "1 day ago",
    },
  ];

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

  const getTransactionIcon = (type) => {
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

  const TransactionCard = ({ tx, isPending = false }) => (
    <div className="bg-[#1A1A1A]  border border-[#333333] rounded-xl p-4 hover:border-[#eb5e28] transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#242424] flex items-center justify-center border border-[#333333]">
            {getTransactionIcon(tx.type)}
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">
              {tx.description}
            </h3>
            <p className="text-[#A0A0A0] text-xs">{tx.timestamp}</p>
          </div>
        </div>
        {isPending && (
          <div className="flex items-center gap-1.5 bg-[#eb5e28]/20 px-2.5 py-1 rounded-full border border-[#eb5e28]/30">
            <Clock size={12} className="text-[#eb5e28]" />
            <span className="text-[#eb5e28] text-xs font-medium">
              {tx.confirmations}/{tx.required}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1.5 mb-3">
        {tx.to && (
          <div className="flex justify-between text-xs">
            <span className="text-[#A0A0A0]">To:</span>
            <span className="text-white font-mono">{tx.to}</span>
          </div>
        )}
        {tx.value && (
          <div className="flex justify-between text-xs">
            <span className="text-[#A0A0A0]">Amount:</span>
            <span className="text-white font-semibold">{tx.value}</span>
          </div>
        )}
        {tx.address && (
          <div className="flex justify-between text-xs">
            <span className="text-[#A0A0A0]">Address:</span>
            <span className="text-white font-mono">{tx.address}</span>
          </div>
        )}
        {tx.newThreshold && (
          <div className="flex justify-between text-xs">
            <span className="text-[#A0A0A0]">New Threshold:</span>
            <span className="text-white font-semibold">{tx.newThreshold}</span>
          </div>
        )}
        <div className="flex justify-between text-xs">
          <span className="text-[#A0A0A0]">Initiated by:</span>
          <span className="text-white">{tx.initiator}</span>
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
    <main className="min-h-screen bg-[#0e0e0e] p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#A0A0A0] text-xs sm:text-sm ">
                  Manage your wallet transactions and owners
                </p>
              </div>
              <button
                onClick={() => router.push("/new-transaction")}
                className="w-30 bg-[#eb5e28] hover:bg-[#d54e20] text-white flex items-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full  text-[10px] sm:text-sm font-semibold transition-all shadow-lg hover:shadow-xl cursor-pointer"
              >
                <Plus className="size-3 sm:size-4" />
                New Transaction
              </button>
            </div>

            <div className="flex gap-2 border-b border-[#333333]">
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
              {activeTab === "pending" &&
                pendingTransactions.map((tx) => (
                  <TransactionCard key={tx.id} tx={tx} isPending={true} />
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
