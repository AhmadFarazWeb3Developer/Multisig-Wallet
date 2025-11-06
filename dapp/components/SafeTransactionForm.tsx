"use client";

import React, { useState } from "react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Transaction Data:", { operation, ...form });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Safe Transaction Form</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Operation Dropdown */}
        <div>
          <label className="block mb-1 text-sm font-medium">Operation</label>
          <select
            name="operation"
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2"
          >
            <option value="">Select Operation</option>
            <option value="addOwnerWithThreshold">addOwnerWithThreshold</option>
            <option value="removeOwner">removeOwner</option>
            <option value="swapOwner">swapOwner</option>
            <option value="changeThreshold">changeThreshold</option>
            <option value="setGuard">setGuard</option>
            <option value="transferToken">transferToken</option>
          </select>
        </div>

        {/* Transaction Fields */}
        {[
          { label: "To Address", name: "to" },
          { label: "Value (ETH)", name: "value" },
          { label: "Data (calldata)", name: "data" },
          { label: "safeTxGas", name: "safeTxGas" },
          { label: "baseGas", name: "baseGas" },
          { label: "gasPrice", name: "gasPrice" },
          { label: "Gas Token Address", name: "gasToken" },
          { label: "Refund Receiver", name: "refundReceiver" },
          { label: "Nonce", name: "nonce" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block mb-1 text-sm font-medium">
              {field.label}
            </label>
            <input
              name={field.name}
              value={(form as any)[field.name]}
              onChange={handleChange}
              placeholder={field.label}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2"
            />
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-2 font-semibold"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
}
