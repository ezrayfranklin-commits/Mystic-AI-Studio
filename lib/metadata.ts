import type { Metadata } from "next";

import { absoluteUrl, BRAND_NAME } from "@/lib/utils";

export function pageMetadata({
  title,
  description,
  path
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: `${title} | ${BRAND_NAME}`,
      description,
      url,
      siteName: BRAND_NAME,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${BRAND_NAME}`,
      description
    }
  };
}
