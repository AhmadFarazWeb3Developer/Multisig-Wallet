// export default function UserDashboard() {
//   return (
//     <main className="border-1">
//       <div className="left">Left</div>
//       <div className="right">Right</div>
//     </main>
//   );
// }

// /**
// VERSION()
// addOwnerWithThreshold(address,uint256)
// approveHash(bytes32)
// approvedHashes(address,bytes32)
// changeThreshold(uint256)
// checkNSignatures(address,bytes32,bytes,uint256)
// checkNSignatures(bytes32,bytes,bytes,uint256)
// checkSignatures(address,bytes32,bytes)checkSignatures(bytes32,bytes,bytes)
// disableModule(address,address)
// domainSeparator()
// enableModule(address)
// execTransaction(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,bytes)
// execTransactionFromModule(address,uint256,bytes,uint8)
// execTransactionFromModuleReturnData(address,uint256,bytes,uint8)
// getModulesPaginated(address,uint256)
// getOwners()
// getStorageAt(uint256,uint256)
// getThreshold()
// getTransactionHash(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,uint256)
// isModuleEnabled(address)
// isOwner(address)
// nonce()
// removeOwner(address,address,uint256)
// setFallbackHandler(address)
// setGuard(address)
// setModuleGuard(address)
// signedMessages(bytes32)
// simulateAndRevert(address,bytes)
// swapOwner(address,address,address)

//  */

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

export default function UserDashboard() {
  const [notifications, setNotifications] = useState(3);
  const [activeTab, setActiveTab] = useState("pending");

  // Mock data
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
        return <Send size={20} className="text-[#3B82F6]" />;
      case "addOwner":
        return <UserPlus size={20} className="text-[#10B981]" />;
      case "removeOwner":
        return <UserMinus size={20} className="text-[#EF4444]" />;
      case "changeThreshold":
        return <Shield size={20} className="text-[#8B5CF6]" />;
      case "swapOwner":
        return <ArrowRightLeft size={20} className="text-[#eb5e28]" />;
      default:
        return <Settings size={20} className="text-[#A0A0A0]" />;
    }
  };

  const TransactionCard = ({ tx, isPending = false }) => (
    <div className="bg-[#1A1A1A] border border-[#333333] rounded-2xl p-6 hover:border-[#eb5e28] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#242424] flex items-center justify-center border border-[#333333]">
            {getTransactionIcon(tx.type)}
          </div>
          <div>
            <h3 className="text-white font-semibold">{tx.description}</h3>
            <p className="text-[#A0A0A0] text-sm">{tx.timestamp}</p>
          </div>
        </div>
        {isPending && (
          <div className="flex items-center gap-2 bg-[#eb5e28]/20 px-3 py-1 rounded-full border border-[#eb5e28]/30">
            <Clock size={14} className="text-[#eb5e28]" />
            <span className="text-[#eb5e28] text-sm font-medium">
              {tx.confirmations}/{tx.required}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        {tx.to && (
          <div className="flex justify-between text-sm">
            <span className="text-[#A0A0A0]">To:</span>
            <span className="text-white font-mono">{tx.to}</span>
          </div>
        )}
        {tx.value && (
          <div className="flex justify-between text-sm">
            <span className="text-[#A0A0A0]">Amount:</span>
            <span className="text-white font-semibold">{tx.value}</span>
          </div>
        )}
        {tx.address && (
          <div className="flex justify-between text-sm">
            <span className="text-[#A0A0A0]">Address:</span>
            <span className="text-white font-mono">{tx.address}</span>
          </div>
        )}
        {tx.newThreshold && (
          <div className="flex justify-between text-sm">
            <span className="text-[#A0A0A0]">New Threshold:</span>
            <span className="text-white font-semibold">{tx.newThreshold}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-[#A0A0A0]">Initiated by:</span>
          <span className="text-white">{tx.initiator}</span>
        </div>
      </div>

      {isPending && (
        <div className="flex gap-3">
          <button className="flex-1 bg-[#eb5e28] hover:bg-[#d54e20] text-white py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
            <CheckCircle size={18} />
            Approve
          </button>
          <button className="flex-1 bg-[#242424] hover:bg-[#303030] text-[#A0A0A0] hover:text-white py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 border border-[#333333]">
            <XCircle size={18} />
            Reject
          </button>
        </div>
      )}

      {tx.status === "executed" && (
        <div className="flex items-center gap-2 text-[#10B981] text-sm font-medium">
          <CheckCircle size={16} />
          Successfully Executed
        </div>
      )}

      {tx.status === "rejected" && (
        <div className="flex items-center gap-2 text-[#EF4444] text-sm font-medium">
          <XCircle size={16} />
          Rejected
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#1A1A1A] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  MultiSig Dashboard
                </h1>
                <p className="text-[#A0A0A0]">
                  Manage your wallet transactions and owners
                </p>
              </div>
              <button className="bg-[#eb5e28] hover:bg-[#d54e20] text-white px-6 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                <Plus size={20} />
                New Transaction
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-[#242424] border border-[#333333] rounded-2xl p-1">
              <button
                onClick={() => setActiveTab("pending")}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                  activeTab === "pending"
                    ? "bg-[#eb5e28] text-white shadow-lg"
                    : "text-[#A0A0A0] hover:text-white hover:bg-[#2A2A2A]"
                }`}
              >
                Pending ({pendingTransactions.length})
              </button>
              <button
                onClick={() => setActiveTab("executed")}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                  activeTab === "executed"
                    ? "bg-[#eb5e28] text-white shadow-lg"
                    : "text-[#A0A0A0] hover:text-white hover:bg-[#2A2A2A]"
                }`}
              >
                Executed ({executedTransactions.length})
              </button>
              <button
                onClick={() => setActiveTab("rejected")}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                  activeTab === "rejected"
                    ? "bg-[#eb5e28] text-white shadow-lg"
                    : "text-[#A0A0A0] hover:text-white hover:bg-[#2A2A2A]"
                }`}
              >
                Rejected ({rejectedTransactions.length})
              </button>
            </div>

            {/* Transactions List */}
            <div className="space-y-4">
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

          {/* Right Section - Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-[#242424] border border-[#333333] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-lg">Notifications</h2>
                <div className="relative">
                  <Bell
                    size={24}
                    className="text-white cursor-pointer hover:text-[#eb5e28] transition-colors"
                  />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#eb5e28] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-[#1A1A1A] rounded-xl p-3 border-l-4 border-[#eb5e28]">
                  <p className="text-white text-sm font-medium">
                    New transaction pending
                  </p>
                  <p className="text-[#A0A0A0] text-xs mt-1">2 hours ago</p>
                </div>
                <div className="bg-[#1A1A1A] rounded-xl p-3 border-l-4 border-[#10B981]">
                  <p className="text-white text-sm font-medium">
                    Transaction executed
                  </p>
                  <p className="text-[#A0A0A0] text-xs mt-1">1 day ago</p>
                </div>
                <div className="bg-[#1A1A1A] rounded-xl p-3 border-l-4 border-[#3B82F6]">
                  <p className="text-white text-sm font-medium">
                    New owner added
                  </p>
                  <p className="text-[#A0A0A0] text-xs mt-1">2 days ago</p>
                </div>
              </div>
            </div>

            {/* Wallet Info */}
            <div className="bg-[#242424] border border-[#333333] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#eb5e28]/20 flex items-center justify-center border border-[#eb5e28]/30">
                  <Shield size={24} className="text-[#eb5e28]" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">Security</h2>
                  <p className="text-[#eb5e28] text-sm">Active Protection</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#A0A0A0] text-sm">Threshold</span>
                    <div className="flex items-center gap-2">
                      <Key size={16} className="text-[#eb5e28]" />
                      <span className="text-white font-bold text-lg">
                        {threshold}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-[#242424] rounded-full h-2">
                    <div
                      className="bg-[#eb5e28] h-2 rounded-full transition-all"
                      style={{ width: `${(threshold / totalOwners) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-[#A0A0A0] text-xs mt-2">
                    {threshold} of {totalOwners} signatures required
                  </p>
                </div>

                <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#A0A0A0] text-sm">Total Owners</span>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-[#eb5e28]" />
                      <span className="text-white font-bold text-lg">
                        {totalOwners}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Owners List */}
            <div className="bg-[#242424] border border-[#333333] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-lg">Wallet Owners</h2>
                <button className="text-[#eb5e28] hover:text-[#d54e20] text-sm font-medium flex items-center gap-1">
                  <UserPlus size={16} />
                  Add
                </button>
              </div>
              <div className="space-y-3">
                {owners.map((owner, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#1A1A1A] border border-[#333333] rounded-xl p-3 hover:border-[#eb5e28] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#eb5e28] to-[#d54e20] flex items-center justify-center text-white font-bold">
                        {owner.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium flex items-center gap-2">
                          {owner.name}
                          {owner.isYou && (
                            <span className="bg-[#eb5e28]/20 text-[#eb5e28] text-xs px-2 py-0.5 rounded-full border border-[#eb5e28]/30">
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-[#A0A0A0] text-sm font-mono">
                          {owner.address}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
