"use client";

import SafeTransactionForm from "@/components/SafeTransactionForm";

export default function NewTransaction() {
  return (
    <main className="w-full flex flex-row  justify-center">
      <div className="w-full p-3 bg-[#1A1A1A] flex flex-row justify-center ">
        <SafeTransactionForm />
      </div>
    </main>
  );
}
