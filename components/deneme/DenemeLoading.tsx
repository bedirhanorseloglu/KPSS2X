"use client";

import GlobalLoading from "../GlobalLoading";

export default function DenemeLoading() {
  return (
    <GlobalLoading
      title="Denemeler Yükleniyor..."
      description="Sınav skorlarınız ve analitik grafikleriniz hazırlanıyor."
      emoji="📝"
      fullScreen={true}
    />
  );
}
