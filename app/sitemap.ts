import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kpss-2026.vercel.app";

  const routes = [
    "",
    "/dashboard",
    "/deneme",
    "/etkinlik",
    "/liderlik",
    "/simulator",
    "/etkinlik/akarsular",
    "/etkinlik/goller",
    "/etkinlik/guncel",
    "/etkinlik/harita",
    "/etkinlik/ovalar",
    "/etkinlik/platolar",
    "/etkinlik/tbmm-yeter-sayilari",
    "/etkinlik/vatandaslik",
    "/etkinlik/yuksek-yargi-secim",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
