"use client";

import { useState, useEffect } from "react";

export interface BrandConfig {
  id: "alaf" | "somsav";
  brandNamePrefix: string;
  brandNameSuffix: string;
  fullName: string;
  companyName: string;
  domain: string;
  email: string;
  infraTag: string;
  nodeName: string;
  edgeText: string;
}

export const ALAF_BRAND: BrandConfig = {
  id: "alaf",
  brandNamePrefix: "Alaf",
  brandNameSuffix: "Vision",
  fullName: "Alaf Vision",
  companyName: "Alaf Teknoloji",
  domain: "vision.alafteknoloji.com",
  email: "info@alafteknoloji.com",
  infraTag: "Alaf Teknoloji Yapay Zeka Altyapısı",
  nodeName: "Yerel Alaf Düğümü",
  edgeText: "Alaf Vision Edge",
};

export const SOM_SAVUNMA_BRAND: BrandConfig = {
  id: "somsav",
  brandNamePrefix: "Som",
  brandNameSuffix: "Vision",
  fullName: "Som Vision",
  companyName: "Som Savunma A.Ş.",
  domain: "vision.somsav.com.tr",
  email: "info@somsav.com.tr",
  infraTag: "Som Savunma Yapay Zeka Altyapısı",
  nodeName: "Yerel Som Düğümü",
  edgeText: "Som Vision Edge",
};

/**
 * Determines brand based on current hostname or URL parameter ?brand=somsav
 */
export function getBrandConfig(hostOrParam?: string): BrandConfig {
  if (!hostOrParam) return ALAF_BRAND;
  const str = hostOrParam.toLowerCase();
  if (str.includes("somsav") || str === "som") {
    return SOM_SAVUNMA_BRAND;
  }
  return ALAF_BRAND;
}

/**
 * React hook to reactively retrieve the brand config on the client side
 */
export function useBrand(): BrandConfig {
  const [brand, setBrand] = useState<BrandConfig>(ALAF_BRAND);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname.toLowerCase();
      const searchParams = new URLSearchParams(window.location.search);
      const brandParam = searchParams.get("brand") || searchParams.get("company");

      if (brandParam) {
        setBrand(getBrandConfig(brandParam));
      } else if (hostname.includes("somsav")) {
        setBrand(SOM_SAVUNMA_BRAND);
      } else {
        setBrand(ALAF_BRAND);
      }
    }
  }, []);

  return brand;
}
