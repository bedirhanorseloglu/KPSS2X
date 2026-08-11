import { Metadata } from "next";
import YuksekYargiGame from "@/components/etkinlik/YuksekYargiGame";

export const metadata: Metadata = {
  title: "Yüksek Mahkeme Üyeleri Seçim Kaynakları Oyunlaştırması | KPSS Vatandaşlık 2026",
  description: "Anayasa Mahkemesi, Yargıtay, Danıştay, Uyuşmazlık Mahkemesi ve HSK üye seçim kaynaklarını interaktif görsel hafıza oyunuyla öğrenin.",
};

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function YuksekYargiPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-12 px-4 sm:px-6">
      <YuksekYargiGame />
    </main>
  );
}
