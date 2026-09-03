import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/env.ts";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteOrigin()}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteOrigin()}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
