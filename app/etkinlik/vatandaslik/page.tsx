"use client";

import React from "react";
import { useRouter } from "next/navigation";
import VatandaslikGame from "@/components/etkinlik/VatandaslikGame";

export default function VatandaslikPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 px-4 sm:px-6">
      <VatandaslikGame 
        onBack={() => router.push("/etkinlik")} 
        onComplete={() => {}}
      />
    </main>
  );
}
