import type { MetadataRoute } from "next"

const APP_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://localhost:3000"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseRoutes: MetadataRoute.Sitemap = [
    {
      url: APP_BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ]
  return baseRoutes
}
