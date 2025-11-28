"use client";

import SafeTransactionForm from "@/components/SafeTransactionForm";
import { useSearchParams } from "next/navigation";

export default function NewTransaction() {
  const searchParams = useSearchParams();
  const safeAddress = searchParams.get("safeAddress");

  console.log("reached");
  return (
    <main className="w-full flex flex-row font-unbounded   justify-center">
      <div className="w-full p-3  flex flex-row justify-center ">
        {safeAddress && <SafeTransactionForm safeAddress={safeAddress} />}
      </div>
    </main>
  );
}
