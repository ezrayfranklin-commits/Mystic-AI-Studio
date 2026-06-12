import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/utils";

const routes = [
  "/",
  "/tarot",
  "/horoscope",
  "/dream",
  "/compatibility",
  "/pricing",
  "/source-code",
  "/launch-help",
  "/privacy",
  "/terms",
  "/disclaimer"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL.replace(/\/$/, "");

  return routes.map((route) => ({
    url: `${baseUrl}${route}`
  }));
}
