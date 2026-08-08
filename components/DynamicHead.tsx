"use client";

import { useEffect } from "react";

export function DynamicHead({ siteSettings, about }: { siteSettings?: any; about?: any }) {
  useEffect(() => {
    const title = siteSettings?.title || (about?.name ? `${about.name} - Portfolio` : "Meta Ardi Setiawan - Portfolio");
    const faviconUrl = siteSettings?.faviconUrl || "/icon.png";
    const description = siteSettings?.description || about?.bio || "Personal Portfolio";

    // Dynamic Title
    document.title = title;

    // Dynamic Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // Dynamic Favicon Link
    let iconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!iconLink) {
      iconLink = document.createElement("link");
      iconLink.rel = "icon";
      document.head.appendChild(iconLink);
    }
    iconLink.href = faviconUrl;
  }, [siteSettings, about]);

  return null;
}
