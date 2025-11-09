"use client";

import React, { useEffect, useState } from "react";
import CustomSelect from "./CustomSelect";
export default function SafeTransactionForm() {
  const [operation, setOperation] = useState("");
  const [form, setForm] = useState({
    to: "",
    value: "",
    data: "",
    safeTxGas: "",
    baseGas: "",
    gasPrice: "",
    gasToken: "",
    refundReceiver: "",
    nonce: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Transaction Data:", { operation, ...form });
  };

  useEffect(() => {
    console.log("operations : ", operation);
  }, [operation]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center  p-4 font-unbounded">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-light text-white tracking-tight">
            Safe Transaction
          </h1>
          <div className="h-px w-20 bg-[#eb5e28] mt-2"></div>
        </div>

        <div className="space-y-5">
          <div className="">
            <label className=" cursor-pointer block text-xs text-white/40 mb-2 uppercase tracking-widest">
              Operation
            </label>

            <CustomSelect setOperation={setOperation} />
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            {[
              { label: "To", name: "to", placeholder: "0x..." },
              { label: "Value", name: "value", placeholder: "0.0" },
              { label: "Safe Tx Gas", name: "safeTxGas", placeholder: "0" },
              { label: "Base Gas", name: "baseGas", placeholder: "0" },
              { label: "Gas Price", name: "gasPrice", placeholder: "0" },
              { label: "Gas Token", name: "gasToken", placeholder: "0x..." },
              {
                label: "Refund Receiver",
                name: "refundReceiver",
                placeholder: "0x...",
              },
              { label: "Nonce", name: "nonce", placeholder: "0" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  value={(form as any)[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#eb5e28] transition-colors font-mono"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">
              Calldata
            </label>
            <input
              name="data"
              value={form.data}
              onChange={handleChange}
              placeholder="0x..."
              className="w-full bg-transparent border-b border-white/10 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#eb5e28] transition-colors font-mono"
            />
          </div>

          <div className="pt-4">
            <button
              onClick={handleSubmit}
              className="w-full bg-[#eb5e28] text-white py-4 text-sm font-medium uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 cursor-pointer rounded-sm"
            >
              Execute Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
