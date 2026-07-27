import type { Metadata } from "next";
import AuthGuard from "@/components/auth/AuthGuard";
import FloatingNavbar from "@/components/layout/FloatingNavbar";

export const metadata: Metadata = {
  title: "KPSS 2026 Komuta Merkezi — Liderlik Tablosu",
  description: "Diğer adaylarla netlerini karşılaştır, sıralamanı gör.",
};

export default function LiderlikLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <FloatingNavbar />
      <div className="pt-24 min-h-screen">
        {children}
      </div>
    </AuthGuard>
  );
}
