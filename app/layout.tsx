import type { Metadata } from "next";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import GlobalPomodoro from "@/components/GlobalPomodoro";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | KPSS2X — 2 Kat Hızlı Hazırlık",
    default: "KPSS2X — 2 Kat Hızlı KPSS Hazırlık Platformu",
  },
  description: "KPSS2X — 2 Kat Hızlı KPSS Hazırlık Platformu. Deneme analizleri, pomodoro, liderlik tablosu ve yapay zeka destekli hedef takibi.",
  keywords: ["KPSS2X", "KPSS 2026", "KPSS Çalışma", "Deneme Takibi", "Pomodoro", "KPSS Lisans", "Sınav Takip"],
  authors: [{ name: "KPSS2X Uzmanı" }],
  openGraph: {
    title: "KPSS2X — 2 Kat Hızlı KPSS Hazırlık Platformu",
    description: "Premium KPSS2X ders takip paneli. Kendi netlerini gir, rakiplerinle yarış, başarını 2'ye katla.",
    type: "website",
    locale: "tr_TR",
    siteName: "KPSS2X",
  },
  twitter: {
    card: "summary_large_image",
    title: "KPSS2X — 2 Kat Hızlı KPSS Hazırlık Platformu",
    description: "Premium KPSS2X ders takip paneli.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning className={nunito.variable}>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            {children}
            <GlobalPomodoro />
          </AuthProvider>
        </ThemeProvider>
        <Toaster
          position="bottom-center"
          closeButton
          expand={false}
          duration={3000}
          toastOptions={{
            classNames: {
              toast: "app-toast",
            },
          }}
        />
      </body>
    </html>
  );
}
