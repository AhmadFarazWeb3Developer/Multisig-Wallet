// "use client";

// import React, { useState } from "react";
// import { Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";

// interface Owner {
//   name: string;
//   address: string;
// }

// const owners: Owner[] = [
//   { name: "Alice", address: "0x2546bcd3c84621e976d8185a91a922ae77ecec30" },
//   { name: "Bob", address: "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199" },
//   { name: "Charlie", address: "0xf39fd6e51aad18f6f4ce6ab8827279cfffb92266" },
//   { name: "Diana", address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" },
//   { name: "Ethan", address: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4" },
//   { name: "Fiona", address: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2" },
//   { name: "George", address: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db" },
//   { name: "Hannah", address: "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB" },
//   { name: "Ivan", address: "0x617F2E2fD72FD9D5503197092aC168c91465E7f2" },
//   { name: "Julia", address: "0x17F6AD8Ef982297579C203069C1DbfFE4348c372" },
//   { name: "Kevin", address: "0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678" },
//   { name: "Luna", address: "0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7" },
//   { name: "Marcus", address: "0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C" },
// ];

// export default function Home() {
//   const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
//   const [currentPage, setCurrentPage] = useState(0);
//   const itemsPerPage = 5;

//   const totalPages = Math.ceil(owners.length / itemsPerPage);
//   const startIndex = currentPage * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentOwners = owners.slice(startIndex, endIndex);

//   const handleCopy = (address: string, index: number) => {
//     navigator.clipboard.writeText(address);
//     setCopiedIndex(index);
//     setTimeout(() => setCopiedIndex(null), 2000);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
//   };

//   const handlePrevious = () => {
//     if (currentPage > 0) setCurrentPage(currentPage - 1);
//   };

//   return (
//     <main className="flex flex-col max-w-3xl gap-6 p-4">
//       <div className=" flex flex-row w-full ">
//         <div className="bg-gradient-to-br from-[#242424] to-[#1A1A1A] border border-[#333333] rounded-l-md rounded-br-md  p-6 shadow-lg w-full">
//           <p className="text-[#A0A0A0] text-sm font-semibold mb-2">
//             Total Locked Value
//           </p>
//           <h3 className="text-white text-5xl font-bold mb-1">
//             0.0 <span className="text-3xl text-[#A0A0A0]">ETH</span>
//           </h3>
//         </div>

//         <div className=" flex flex-row w-1/3   h-10 rounded-r-md">
//           <button className=" cursor-pointer w-full  py-2 text-sm text-white  bg-[#eb5e28] rounded-r-md">
//             Add Funds
//           </button>
//         </div>
//       </div>

//       <div className=" flex flex-row  w-full ">
//         <div className="bg-[#242424] border border-[#333333]  rounded-l-md rounded-br-md  overflow-hidden shadow-lg w-full">
//           <div className="px-6 py-4 border-b border-[#333333] flex items-center justify-between">
//             <div>
//               <p className="font-bold text-white text-lg">Wallet Owners</p>
//               <p className="text-[#A0A0A0] text-sm mt-1">
//                 {owners.length} members
//               </p>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={handlePrevious}
//                 disabled={currentPage === 0}
//                 className={`p-2 rounded-lg border border-[#333333]  cursor-pointer hover:bg-[#eb5e28]  transition ${
//                   currentPage === 0
//                     ? "opacity-40 cursor-not-allowed"
//                     : "text-white"
//                 }`}
//               >
//                 <ChevronLeft size={18} className=" cursor-pointer" />
//               </button>
//               <button
//                 onClick={handleNext}
//                 disabled={currentPage === totalPages - 1}
//                 className={`p-2 rounded-lg border border-[#333333]   hover:bg-[#eb5e28]  cursor-pointer transition ${
//                   currentPage === totalPages - 1
//                     ? "opacity-40 cursor-not-allowed"
//                     : "text-white"
//                 }`}
//               >
//                 <ChevronRight size={18} className=" cursor-pointer" />
//               </button>
//             </div>
//           </div>

//           <div className="divide-y divide-[#333333]">
//             {currentOwners.map((owner, index) => (
//               <div
//                 key={index}
//                 className="flex items-center justify-between px-6 py-4 hover:bg-[#2A2A2A] transition-all group"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 rounded-full ring-2 ring-[#333333]  transition-all overflow-hidden ">
//                     <img
//                       src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${owner.address}`}
//                       alt={owner.name}
//                       className="w-full h-full"
//                     />
//                   </div>

//                   <div>
//                     <p className="text-white text-base font-semibold mb-1">
//                       {owner.name}
//                     </p>
//                     <p className="text-[#A0A0A0] text-sm font-mono">
//                       {owner.address.slice(0, 6)}...
//                       {owner.address.slice(-4)}
//                     </p>
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => handleCopy(owner.address, index)}
//                   className="flex  cursor-pointer items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#eb5e28] text-[#A0A0A0] hover:text-white rounded-lg transition-all border border-[#333333] hover:border-[#eb5e28] group-hover:scale-105"
//                 >
//                   {copiedIndex === index ? (
//                     <>
//                       <Check size={16} />
//                       <span className="text-sm font-medium">Copied!</span>
//                     </>
//                   ) : (
//                     <>
//                       <Copy size={16} className=" cursor-pointer" />
//                       <span className="text-sm font-medium">Copy</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className=" flex flex-row w-1/3  h-10 rounded-r-md">
//           <button className="cursor-pointer w-full py-2 text-sm text-white  bg-[#eb5e28] rounded-r-md">
//             Add Owner
//           </button>
//         </div>
//       </div>

//       <div className="  flex flex-row w-full">
//         <div className="bg-gradient-to-br from-[#242424] to-[#1A1A1A] border border-[#333333] rounded-l-md rounded-br-md  p-6 shadow-lg w-full">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <p className="text-[#A0A0A0] text-sm font-semibold mb-2">
//                 Confirmation Threshold
//               </p>
//               <h3 className="text-white text-4xl font-bold">
//                 <span className="text-[#eb5e28]">2</span> of {owners.length}
//               </h3>
//             </div>
//             <div className="w-20 h-20 rounded-full bg-[#eb5e28]/20 border-4 border-[#eb5e28] flex items-center justify-center">
//               <span className=" text-white text-2xl font-bold">2/13</span>
//             </div>
//           </div>

//           <div className="flex gap-2 mb-3">
//             <div className="flex-1 h-2 bg-[#eb5e28] rounded-full"></div>
//             <div className="flex-1 h-2 bg-[#eb5e28] rounded-full"></div>
//             <div className="flex-1 h-2 bg-[#333333] rounded-full"></div>
//           </div>

//           <p className="text-[#A0A0A0] text-sm">
//             Number of approvals required to execute a transaction.
//           </p>
//         </div>

//         <div className=" flex flex-row w-1/3  h-10 rounded-r-md ">
//           <button className="cursor-pointer w-full py-2 text-sm text-white  bg-[#eb5e28] rounded-r-md">
//             Change Threshold
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Wallet,
  Settings,
} from "lucide-react";

interface Owner {
  name: string;
  address: string;
}

const owners: Owner[] = [
  { name: "Alice", address: "0x2546bcd3c84621e976d8185a91a922ae77ecec30" },
  { name: "Bob", address: "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199" },
  { name: "Charlie", address: "0xf39fd6e51aad18f6f4ce6ab8827279cfffb92266" },
  { name: "Diana", address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" },
  { name: "Ethan", address: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4" },
  { name: "Fiona", address: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2" },
  { name: "George", address: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db" },
  { name: "Hannah", address: "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB" },
  { name: "Ivan", address: "0x617F2E2fD72FD9D5503197092aC168c91465E7f2" },
  { name: "Julia", address: "0x17F6AD8Ef982297579C203069C1DbfFE4348c372" },
  { name: "Kevin", address: "0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678" },
  { name: "Luna", address: "0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7" },
  { name: "Marcus", address: "0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C" },
];

export default function Home() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(owners.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOwners = owners.slice(startIndex, endIndex);

  const handleCopy = (address: string, index: number) => {
    navigator.clipboard.writeText(address);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <main className="flex flex-col max-w-3xl gap-6 p-4">
      <div className="flex flex-row w-full">
        <div className="bg-gradient-to-br from-[#242424] to-[#1A1A1A] border border-[#333333] rounded-l-md rounded-br-md p-6 shadow-lg w-full">
          <p className="text-[#A0A0A0] text-sm font-semibold mb-2">
            Total Locked Value
          </p>
          <h3 className="text-white text-5xl font-bold mb-1">
            0.0 <span className="text-3xl text-[#A0A0A0]">ETH</span>
          </h3>
        </div>

        <div className="flex flex-row justify-center w-1/3 h-10 rounded-r-md">
          <button className="cursor-pointer w-full py-2 text-sm text-white bg-[#2A2A2A] hover:bg-[#eb5e28] border border-[#333333] hover:border-[#eb5e28] rounded-r-md transition-all flex items-center justify-center gap-2">
            <Wallet size={16} />
            Add Funds
          </button>
        </div>
      </div>

      <div className="flex flex-row w-full">
        <div className="bg-[#242424] border border-[#333333] rounded-l-md rounded-br-md overflow-hidden shadow-lg w-full">
          <div className="px-6 py-4 border-b border-[#333333] flex items-center justify-between">
            <div>
              <p className="font-bold text-white text-lg">Wallet Owners</p>
              <p className="text-[#A0A0A0] text-sm mt-1">
                {owners.length} members
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 0}
                className={`p-2 rounded-lg border border-[#333333] cursor-pointer hover:bg-[#eb5e28] transition ${
                  currentPage === 0
                    ? "opacity-40 cursor-not-allowed"
                    : "text-white"
                }`}
              >
                <ChevronLeft size={18} className="cursor-pointer" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages - 1}
                className={`p-2 rounded-lg border border-[#333333] hover:bg-[#eb5e28] cursor-pointer transition ${
                  currentPage === totalPages - 1
                    ? "opacity-40 cursor-not-allowed"
                    : "text-white"
                }`}
              >
                <ChevronRight size={18} className="cursor-pointer" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-[#333333]">
            {currentOwners.map((owner, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-6 py-4 hover:bg-[#2A2A2A] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full ring-2 ring-[#333333] transition-all overflow-hidden">
                    <img
                      src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${owner.address}`}
                      alt={owner.name}
                      className="w-full h-full"
                    />
                  </div>

                  <div>
                    <p className="text-white text-base font-semibold mb-1">
                      {owner.name}
                    </p>
                    <p className="text-[#A0A0A0] text-sm font-mono">
                      {owner.address.slice(0, 6)}...
                      {owner.address.slice(-4)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(owner.address, index)}
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#eb5e28] text-[#A0A0A0] hover:text-white rounded-lg transition-all border border-[#333333] hover:border-[#eb5e28] group-hover:scale-105"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check size={16} />
                      <span className="text-sm font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="cursor-pointer" />
                      <span className="text-sm font-medium">Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-row  justify-center w-1/3 h-10 rounded-r-md">
          <button className="cursor-pointer w-full py-2 text-sm text-center text-white bg-[#2A2A2A] hover:bg-[#eb5e28] border border-[#333333] hover:border-[#eb5e28] rounded-r-md transition-all flex items-center justify-center gap-2">
            <Plus size={16} />
            Add Owner
          </button>
        </div>
      </div>

      <div className="flex flex-row w-full">
        <div className="bg-gradient-to-br from-[#242424] to-[#1A1A1A] border border-[#333333] rounded-l-md rounded-br-md p-6 shadow-lg w-full">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[#A0A0A0] text-sm font-semibold mb-2">
                Confirmation Threshold
              </p>
              <h3 className="text-white text-4xl font-bold">
                <span className="text-[#eb5e28]">2</span> of {owners.length}
              </h3>
            </div>
            <div className="w-20 h-20 rounded-full bg-[#eb5e28]/20 border-4 border-[#eb5e28] flex items-center justify-center">
              <span className="text-white text-2xl font-bold">2/13</span>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <div className="flex-1 h-2 bg-[#eb5e28] rounded-full"></div>
            <div className="flex-1 h-2 bg-[#eb5e28] rounded-full"></div>
            <div className="flex-1 h-2 bg-[#333333] rounded-full"></div>
          </div>

          <p className="text-[#A0A0A0] text-sm">
            Number of approvals required to execute a transaction.
          </p>
        </div>

        <div className="flex flex-row  justify-center w-1/3 h-10 rounded-r-md">
          <button className="cursor-pointer w-full py-2 text-sm text-white bg-[#2A2A2A] hover:bg-[#eb5e28] border border-[#333333] hover:border-[#eb5e28] rounded-r-md transition-all flex items-center justify-center gap-2">
            <Settings size={16} />
            Change Threshold
          </button>
        </div>
      </div>
    </main>
  );
}
