"use client";

import SafeTransactionForm from "@/components/SafeTransactionForm";

export default function NewTransaction() {
  return (
    <main className="w-full flex flex-row border-1 border-[#333333] rounded-sm min-h-[80vh]">
      <div className=" bg-[#1A1A1A] flex flex-row">
        <SafeTransactionForm />
      </div>
    </main>
  );
}
