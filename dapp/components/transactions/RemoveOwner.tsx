"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

type FormProps = {
  setForm: Dispatch<
    SetStateAction<{
      owner_for_removal?: string;
      newThreshold_for_removal?: string;
      operation_description?: string;
    }>
  >;
};

export default function RemoveOwner({ setForm }: FormProps) {
  const [data, setData] = useState({
    owner_for_removal: "",
    newThreshold_for_removal: "",
    operation_description: "",
  });

  useEffect(() => {
    setForm(data);
  }, [data, setForm]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-gray-400 text-sm">Owner Address</label>
        <input
          value={data.owner_for_removal}
          onChange={(e) =>
            setData({ ...data, owner_for_removal: e.target.value })
          }
          type="text"
          placeholder="0x..."
          className="bg-[#1a1a1a] border-b border-[#333333] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-gray-400 text-sm">New Threshold</label>
        <input
          type="number"
          value={data.newThreshold_for_removal}
          onChange={(e) =>
            setData({ ...data, newThreshold_for_removal: e.target.value })
          }
          min={1}
          step={1}
          placeholder="1"
          className="bg-[#1a1a1a] border-b border-[#333333] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition"
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-gray-400 text-sm ">Description </label>
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
