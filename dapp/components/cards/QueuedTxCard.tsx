// import { Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import { useAppKitAccount } from "@reown/appkit/react";

// import { useEffect, useState } from "react";
// import useGetQueuedTxs from "../../app/hooks/useGetQueuedTxs";

// interface Transaction {
//   tx_id: string;
//   operation_name: string;
//   operation_description: string;
//   sender_address: string;
//   sender_name: string;
//   queued_at: string;
//   metadata: {
//     eth_amount?: string;
//     eth_recipient?: string;
//     token_amount?: string;
//     token_recipient?: string;
//     mint_token_amount?: string;
//     newOwner_with_threshold?: string;
//     new_threshold1?: string;
//     prevOwner_for_removal?: string;
//     newOwner_for_removal?: string;
//     newThreshold_for_removal?: string;
//     prevOwner_for_swap?: string;
//     oldOwner_for_swap?: string;
//     newOwner_for_swap?: string;
//     new_threshold2?: string;
//     guard_address?: string;
//   };
// }

// export default function QueuedTxCard() {
//   const { isConnected, address } = useAppKitAccount();

//   const { getQueuedTxs, isLoading } = useGetQueuedTxs();

//   const [queuedTransactions, setQueuedTransactions] = useState([]);

//   useEffect(() => {
//     const init = async () => {
//       if (!isConnected || !address) {
//         toast.error("wallet is not connected!", {
//           action: { label: "Close", onClick: () => {} },
//         });
//         return;
//       }

//       const data = await getQueuedTxs();

//       setQueuedTransactions(data.slice(1));
//     };
//     init();
//   }, [isConnected, address]);

//   return (
//     <div className="space-y-3 flex items-center flex-col w-full">
//       {queuedTransactions.map((tx: Transaction) => (
//         <div
//           key={tx.tx_id}
//           className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 hover:border-[#eb5e28] transition-all w-full"
//         >
//           <h3 className="text-white font-semibold text-sm tracking-wide">
//             {tx.operation_name}
//           </h3>

//           <div className="space-y-1 text-[#6B7280] text-[11px] mt-2">
//             {Object.entries(tx.metadata).map(([key, value]) => (
//               <p key={key}>
//                 <span className="font-medium">{formatKey(key)}:</span> {value}
//               </p>
//             ))}
//           </div>

//           <p className="text-[#6B7280] text-[11px] mt-1">
//             {timeAgo(tx.queued_at)}
//           </p>

//           <p className="text-[#A0A0A0] text-xs">
//             <span className="text-[#6B7280] mr-1">Description:</span>
//             {tx.operation_description}
//           </p>

//           <p className="text-[#A0A0A0] text-xs">
//             <span className="text-[#6B7280] mr-1">From:</span>
//             {tx.sender_address.slice(0, 6)}...{tx.sender_address.slice(-4)}
//           </p>

//           <p className="text-[#A0A0A0] text-xs">
//             <span className="text-[#6B7280] mr-1">Sender:</span>
//             {tx.sender_name}
//           </p>

//           <p className="text-white font-mono text-xs">
//             <span className="text-[#6B7280] mr-1">Tx:</span>
//             {tx.tx_id.slice(0, 10)}...{tx.tx_id.slice(-6)}
//           </p>
//         </div>
//       ))}
//       {isLoading && (
//         <div className="flex items-center gap-2 text-[#eb5e28] text-sm">
//           <Loader2 className="animate-spin" size={16} />
//         </div>
//       )}

//       {queuedTransactions.length === 0 && !isLoading && (
//         <p className="text-[#A0A0A0] text-sm">No queued transactions found.</p>
//       )}
//     </div>
//   );
// }

// function formatKey(key: string) {
//   return key
//     .replace(/_/g, " ") // replace underscores with spaces
//     .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize each word
// }

// function timeAgo(timestamp: string | number | Date) {
//   const date = new Date(timestamp);
//   const now = new Date();
//   const diffMs = now.getTime() - date.getTime();
//   const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

//   if (diffHours < 1) {
//     const minutes = Math.floor(diffMs / (1000 * 60));
//     return `${minutes}m ago`;
//   }

//   if (diffHours < 24) {
//     return `${diffHours}h ago`;
//   }

//   const days = Math.floor(diffHours / 24);
//   return `${days}d ago`;
// }

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppKitAccount } from "@reown/appkit/react";
import { useEffect, useState } from "react";
import useGetQueuedTxs from "../../app/hooks/useGetQueuedTxs";

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
  };
}

export default function QueuedTxCard() {
  const { isConnected, address } = useAppKitAccount();
  const { getQueuedTxs, isLoading } = useGetQueuedTxs();
  const [queuedTransactions, setQueuedTransactions] = useState<Transaction[]>(
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
      const data = await getQueuedTxs();
      setQueuedTransactions(data);
    };
    init();
  }, [isConnected, address]);

  return (
    <div className="bg-[#111111] p-4 rounded-lg shadow-inner w-full">
      {isLoading && (
        <div className="flex items-center gap-2 text-[#eb5e28] text-sm p-2">
          {" "}
          <Loader2 className="animate-spin" size={16} /> Loading queued
          transactions...{" "}
        </div>
      )}

      {!isLoading && queuedTransactions.length === 0 && (
        <p className="text-[#A0A0A0] text-sm p-2">
          No queued transactions found.
        </p>
      )}
      <div className="divide-y divide-gray-700">
        {queuedTransactions.map((tx) => (
          <div
            key={tx.tx_id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
              <div className="flex flex-col">
                <h4 className="text-white font-medium text-sm">
                  {tx.operation_name}
                </h4>
                <span className="text-[#888] text-[12px] mt-0.5">
                  {tx.operation_description}
                </span>
              </div>

              <div className="flex flex-col mt-1 sm:mt-0 text-[11px] text-[#888] sm:flex-row sm:gap-4">
                {tx.metadata.eth_amount && tx.metadata.eth_recipient && (
                  <span>
                    ETH: {tx.metadata.eth_amount} →{" "}
                    {shortAddress(tx.metadata.eth_recipient)}
                  </span>
                )}
                {tx.metadata.token_amount && tx.metadata.token_recipient && (
                  <span>
                    Token: {tx.metadata.token_amount} →{" "}
                    {shortAddress(tx.metadata.token_recipient)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:items-end mt-2 sm:mt-0 text-[11px] text-[#888]">
              <span>{timeAgo(tx.queued_at)}</span>
              <span className="mt-1 px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full text-[10px]">
                Queued
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function shortAddress(addr: string) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function timeAgo(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return `${Math.floor(diffMs / (1000 * 60))}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}
