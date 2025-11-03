// "use client";

// import React, { useState, ReactElement, useEffect } from "react";
// import SidePanel from "../../components/SidePanel";

// import Home from "@/components/Home";
// import { useAppKitAccount } from "@reown/appkit/react";

// export default function Dashboard() {
//   const { address, isConnected } = useAppKitAccount();
//   const [component, setComponent] = useState<ReactElement | null>(null);

//   useEffect(() => {
//     if (!address || !isConnected) {
//       console.log("Wallet not connected");
//     }

//     const fetchConnectedAddressAccounts = async () => {
//       const response = await fetch(
//         `/api/owners/get-single-owner?address=${encodeURIComponent(address)}`,
//         {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       const data = await response.json();

//       console.log("data: ", data);
//     };

//     fetchConnectedAddressAccounts();
//   });

//   return (
//     <main className=" w-full flex flex-row border-1 border-[#333333] rounded-sm min-h-[80vh]">
//       <div className="flex-1 bg-[#1A1A1A]  flex flex-row ">
//         <SidePanel setComponent={setComponent} />
//         <div className="flex-1    from-[#242424] to-[#1A1A1A] ">
//           {component ? component : <Home />}
//         </div>
//       </div>
//     </main>
//   );
// }
"use client";

import React, { useState, ReactElement, useEffect } from "react";
import SidePanel from "../../components/SidePanel";
import Home from "@/components/Home";
import { useAppKitAccount } from "@reown/appkit/react";

export default function Dashboard() {
  const { address, isConnected } = useAppKitAccount();
  const [component, setComponent] = useState<ReactElement | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      console.log("Wallet not connected or address unavailable");
      return;
    }

    const fetchConnectedAddressAccounts = async () => {
      try {
        const res = await fetch(
          `/api/owners/get-single-owner?address=${encodeURIComponent(address)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!res.ok) {
          console.error("Server error:", res.status);
          return;
        }

        const data = await res.json();
        console.log("Owner data:", data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchConnectedAddressAccounts();
  }, [address, isConnected]);

  return (
    <main className="w-full flex flex-row border-1 border-[#333333] rounded-sm min-h-[80vh]">
      <div className="flex-1 bg-[#1A1A1A] flex flex-row">
        <SidePanel setComponent={setComponent} />
        <div className="flex-1 from-[#242424] to-[#1A1A1A]">
          {component ? component : <Home />}
        </div>
      </div>
    </main>
  );
}
