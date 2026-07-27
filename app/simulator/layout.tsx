import type { Metadata } from "next";
import AuthGuard from "@/components/auth/AuthGuard";
import FloatingNavbar from "@/components/layout/FloatingNavbar";

export const metadata: Metadata = {
  title: "KPSS 2026 Komuta Merkezi — Sınav Simülatörü",
  description: "Gerçek sınav süreleri ve kurallarıyla KPSS deneme simülatörü.",
};

export default function SimulatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <FloatingNavbar />
      <div className="min-h-screen">
        {children}
      </div>
    </AuthGuard>
  );
}
