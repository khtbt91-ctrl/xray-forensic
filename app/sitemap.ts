import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-06-14");
  return [
    { url: "https://www.xrayforensic.com", lastModified, changeFrequency: "weekly", priority: 1 },
    { url: "https://www.xrayforensic.com/pricing", lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.xrayforensic.com/foundations", lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://www.xrayforensic.com/tools", lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://www.xrayforensic.com/roadmap", lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: "https://www.xrayforensic.com/about", lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];
}
