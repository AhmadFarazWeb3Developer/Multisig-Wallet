"use client";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import SignatureCard from "./cards/SignatureTxCard";
import PendingTxCard from "./cards/PendingTxCard";
import ExecutedTxCard from "./cards/ExecutedTxCard";
import QueuedTxCard from "./cards/QueuedTxCard";
import useGetQueuedTxs from "@/app/hooks/useGetQueuedTxs";
import useGetExecutedTxs from "@/app/hooks/useGetExecutedTxs";

type safeAddressInterface = {
  safeAddress: String;
};

export default function Transactions({ safeAddress }: safeAddressInterface) {
  const router = useRouter();

  const { getQueuedTxs } = useGetQueuedTxs();
  const { getExecutedTxs } = useGetExecutedTxs();

  const [executedTxCount, setExecutedTxCount] = useState();
  const [queuedTxCount, setQueuedTxCount] = useState();
  const [pendingTxCount, setPendingTxCount] = useState();
  const [rejectedTxCount, setRejectedTxCount] = useState();

  useEffect(() => {
    const counts = async () => {
      const queuedData = await getQueuedTxs();
      const executedData = await getExecutedTxs();

      const executedTxIds = executedData.map((tx: any) => tx.tx_id);

      const queuedTx = queuedData.filter(
        (tx: any) => !executedTxIds.includes(tx.tx_id)
      );

      console.log("main ", queuedTx);
      setQueuedTxCount(queuedTx.length);
      setExecutedTxCount(executedData.length);
    };

    counts();
  }, [queuedTxCount, executedTxCount]);

  const [activeTab, setActiveTab] = useState("queued");

  useEffect(() => {
    const init = async () => {};
    init();
  }, [activeTab]);

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
                className=" bg-[#eb5e28] hover:bg-[#d54e20] text-white flex items-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full  text-[10px] sm:text-sm font-semibold transition-all shadow-lg hover:shadow-xl cursor-pointer"
              >
                <Plus className="size-3 sm:size-4" />
                New Transaction
              </button>
            </div>

            <div className="flex gap-2 border-b border-[#333333]">
              <button
                onClick={() => setActiveTab("queued")}
                className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ${
                  activeTab === "queued"
                    ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#eb5e28]"
                    : "text-[#A0A0A0] hover:text-white"
                }`}
              >
                Queued ({queuedTxCount})
              </button>

              <button
                onClick={() => setActiveTab("signatures")}
                className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ${
                  activeTab === "signatures"
                    ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#eb5e28]"
                    : "text-[#A0A0A0] hover:text-white"
                }`}
              >
                Sign
              </button>

              <button
                onClick={() => setActiveTab("pending")}
                className={`flex-1 py-2.5 px-4  text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ${
                  activeTab === "pending"
                    ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#eb5e28]"
                    : "text-[#A0A0A0] hover:text-white"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab("executed")}
                className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ${
                  activeTab === "executed"
                    ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#eb5e28]"
                    : "text-[#A0A0A0] hover:text-white"
                }`}
              >
                Executed ({executedTxCount})
              </button>
              <button
                onClick={() => setActiveTab("rejected")}
                className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ${
                  activeTab === "rejected"
                    ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#eb5e28]"
                    : "text-[#A0A0A0] hover:text-white"
                }`}
              >
                Rejected ({1})
              </button>
            </div>

            <div className="flex items-center  flex-col w-full ">
              {activeTab === "queued" && <QueuedTxCard />}

              {activeTab === "signatures" && (
                <SignatureCard safeAddress={safeAddress} />
              )}

              {activeTab === "pending" && (
                <PendingTxCard safeAddress={safeAddress} />
              )}

              {activeTab === "executed" && <ExecutedTxCard />}

              {/* {activeTab === "rejected" &&
                rejectedTransactions.map((tx) => (
                  <TransactionCard key={tx.id} tx={tx} />
                ))} */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
