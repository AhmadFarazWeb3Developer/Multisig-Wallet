"use client";

import SafeTransactionForm from "@/components/SafeTransactionForm";

export default function NewTransaction() {
  return (
    <main className="w-full flex flex-row font-unbounded   justify-center">
      <div className="w-full p-3  flex flex-row justify-center ">
        <SafeTransactionForm />
      </div>
    </main>
  );
}
