import type { Metadata } from "next";
import AuthGuard from "@/components/auth/AuthGuard";
import FloatingNavbar from "@/components/layout/FloatingNavbar";

export const metadata: Metadata = {
  title: "KPSS 2026 Komuta Merkezi — Deneme Merkezi",
  description: "Deneme sınavlarınızı kaydedin, detaylı branş ve yayınevi analizlerinizi görün.",
};

export default function DenemeLayout({
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
