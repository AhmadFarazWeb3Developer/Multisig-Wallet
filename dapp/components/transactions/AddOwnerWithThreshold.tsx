"use client";

import React, { useState, useEffect, Dispatch, SetStateAction } from "react";

type FormProps = {
  setForm: Dispatch<
    SetStateAction<{
      newOwner_with_threshold: string;
      new_threshold1: number;
      operation_description: string;
    }>
  >;
};

export default function AddOwnerWithThreshold({ setForm }: FormProps) {
  const [data, setData] = useState({
    newOwner_with_threshold: "",
    new_threshold1: 1,
    operation_description: "",
  });

  useEffect(() => {
    setForm(data);
  }, [data, setForm]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-gray-400 text-sm">New Owner Address</label>
        <input
          type="text"
          placeholder="0x..."
          value={data.newOwner_with_threshold}
          onChange={(e) =>
            setData({ ...data, newOwner_with_threshold: e.target.value })
          }
          className="bg-[#1a1a1a] border-b border-[#333333] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-gray-400 text-sm">Threshold</label>
        <input
          type="number"
          min={1}
          step={1}
          placeholder="1"
          value={data.new_threshold1}
          onChange={(e) =>
            setData({ ...data, new_threshold1: Number(e.target.value) })
          }
          className="bg-[#1a1a1a] border-b border-[#333333] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition"
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label className="text-gray-400 text-sm ">Description</label>
        <textarea
          name="description"
          placeholder="Add a description or memo..."
          value={data.operation_description}
          onChange={(e) =>
            setData({ ...data, operation_description: e.target.value })
          }
          className="border-b border-[#333333] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition-colors"
          rows={2}
        />
      </div>
    </div>
  );
}
