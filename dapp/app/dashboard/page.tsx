"use client";

import React, { useState, ReactElement } from "react";
import SidePanel from "../../components/SidePanel";
import { HomeIcon } from "lucide-react";
export default function Dashboard() {
  const [component, setComponent] = useState<ReactElement | null>(null);

  return (
    <main className=" w-full flex flex-row border-1 border-[#333333] rounded-sm min-h-[80vh]">
      <div className="flex-1 bg-[#1A1A1A]  flex flex-row">
        <SidePanel setComponent={setComponent} />
        <div className="flex-1 p-8 bg-[#1A1A1A]">
          {component ? (
            component
          ) : (
            <div className="flex flex-row items-center justify-center h-full">
              <div className="bg-[#242424] border border-[#333333] rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-[#eb5e28]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HomeIcon size={32} className="text-[#eb5e28]" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">
                  Welcome to Dashboard
                </h3>
                <p className="text-[#A0A0A0]">
                  Select an option from the sidebar to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
