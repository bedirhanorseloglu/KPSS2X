# Proje Kuralları — 3D Ürün Tanıtım Sitesi

## Genel Talimat
Her zaman kütüphanelerin EN GÜNCEL, aktif olarak sürdürülen (maintained) sürümlerini kullan. 
Kurulum öncesi npm/GitHub üzerinden güncel versiyonu kontrol et, deprecated veya 
artık geliştirilmeyen paketlerden kaçın.

## Teknoloji Stack'i
- 3D render: react-three-fiber (Three.js için React renderer, en güncel major sürüm)
- Yardımcı bileşenler: @react-three/drei (PresentationControls, Environment, Stage, ContactShadows)
- Post-processing: @react-three/postprocessing (bloom, DOF, chromatic aberration)
- Animasyon/scroll: GSAP + ScrollTrigger (en güncel sürüm)
- Smooth scroll: Lenis (studio-freight/lenis)
- Sinematik kamera/timeline gerekirse: Theatre.js
- Framework: Next.js (App Router, en güncel stable sürüm)
- Styling: Tailwind CSS (en güncel sürüm)

## Kod Kalitesi
- Modern React pattern'leri kullan (hooks, server components uygun yerlerde)
- Performans için lazy loading ve model optimizasyonu (draco/meshopt compression) uygula
- Mobil ve masaüstü için responsive tasarım şart

## Referans Repolar
- https://github.com/pmndrs/react-three-fiber
- https://github.com/pmndrs/drei
- https://github.com/bruno-simon/folio-2019
- https://github.com/pmndrs/react-three-next

## Görsel Kalite
- HDRI environment ile gerçekçi ışıklandırma kullan
- Ürün modeli GLB/GLTF formatında, PresentationControls ile döndürülebilir olsun
- Scroll'a bağlı kamera hareketleri ve exploded-view (parça parça açılma) efektleri ekle
