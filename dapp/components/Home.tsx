"use client";

interface Owner {
  name: string;
  address: string;
}

const owners: Owner[] = [
  { name: "Alice", address: "0x2546bcd3c84621e976d8185a91a922ae77ecec30" },
  { name: "Bob", address: "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199" },
  { name: "Charlie", address: "0xf39fd6e51aad18f6f4ce6ab8827279cfffb92266" },
];

export default function Home() {
  return (
    <main className="flex flex-col max-w-2xl gap-4">
      <div className="rounded-2xl">
        <div className="bg-[#333333] px-4 flex flex-col gap-1 w-full mb-4 py-6 rounded-sm">
          <p className="text-gray-500 text-sm font-bold">Total Locked Value</p>
          <h3 className="text-white text-4xl font-bold">0.0 ETH</h3>
        </div>
      </div>

      <div className="flex flex-col gap-2 bg-[#2a2a2a] rounded-md py-3">
        <div className="px-4">
          <p className="font-bold text-white text-lg">Owners</p>
        </div>

        <div className="flex flex-col divide-y divide-gray-700">
          {owners.map((owner, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 hover:bg-[#383838] transition"
            >
              <div className=" flex  flex-col ">
                <div className=" flex flex-row  items-center  ">
                  <div className=" rounded-full border-1 border-gray-500 w-6 h-6 ">
                    <img
                      src={`https://api.dicebear.com/9.x/identicon/svg?seed=${owner.address}`}
                      alt=""
                      className=" rounded-full"
                    />{" "}
                  </div>
                  <p className="text-white text-sm font-semibold ">
                    {owner.name}
                  </p>
                </div>

                <p className="text-gray-400 text-lg max-w-[200px]">
                  {owner.address}
                </p>
              </div>
              <button className="text-xs text-[#eb5e28] hover:underline">
                Copy
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="min-w-2xl bg-[#333333] rounded-md p-4">
        <p className="text-gray-400 text-sm font-semibold mb-1">
          Confirmation Threshold
        </p>
        <h3 className="text-white text-3xl font-bold">2 of 3 Owners</h3>
        <p className="text-gray-500 text-xs mt-1">
          Number of approvals required to execute a transaction.
        </p>
      </div>
    </main>
  );
}
