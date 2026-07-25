"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import GlobalLoading from "../GlobalLoading";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <GlobalLoading
        title="Oturum Kontrol Ediliyor..."
        description="Güvenli giriş bilgileriniz doğrulanıyor, lütfen bekleyin."
        emoji="🔑"
      />
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
