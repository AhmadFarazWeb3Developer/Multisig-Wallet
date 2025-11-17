"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

type FromProps = {
  setForm: Dispatch<SetStateAction<{ newThreshold?: string }>>;
};

export default function ChangeThreshold({ setForm }: FromProps) {
  const [data, setData] = useState({ newThreshold: "" });

  useEffect(() => {
    setForm(data);
  }, [data, setForm]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-gray-400 text-sm">Change Threshold</label>
        <input
          value={data.newThreshold}
          onChange={(e) => setData({ ...data, newThreshold: e.target.value })}
          type="number"
          min={1}
          step={1}
          placeholder="1"
          className="bg-[#1a1a1a] border-b border-[#333333] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition"
        />
      </div>
    </div>
  );
}
