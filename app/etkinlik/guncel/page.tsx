"use client";

import React from "react";
import { useRouter } from "next/navigation";
import GuncelBilgilerGame from "@/components/etkinlik/GuncelBilgilerGame";

export default function GuncelPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 px-4 sm:px-6">
      <GuncelBilgilerGame 
        onBack={() => router.push("/etkinlik")} 
        onComplete={() => {}}
      />
    </main>
  );
}
