"use client";

import React, { useState, ReactElement } from "react";
import SidePanel from "../../components/SidePanel";
import { HomeIcon } from "lucide-react";
import Home from "@/components/Home";
export default function Dashboard() {
  const [component, setComponent] = useState<ReactElement | null>(null);

  return (
    <main className=" w-full flex flex-row border-1 border-[#333333] rounded-sm min-h-[80vh]">
      <div className="flex-1 bg-[#1A1A1A]  flex flex-row">
        <SidePanel setComponent={setComponent} />
        <div className="flex-1 p-4 bg-[#1A1A1A]">
          {component ? component : <Home />}
        </div>
      </div>
    </main>
  );
}
