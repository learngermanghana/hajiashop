import { NextResponse } from "next/server";
import { getPublicCacheControlHeader } from "@/lib/cache-config";
import { getCatalogData } from "@/lib/catalog";

export const revalidate = 3600;

export async function GET() {
  const catalog = await getCatalogData();

  return NextResponse.json(
    {
      source: catalog.source,
      categories: catalog.categories,
      count: catalog.products.length,
      products: catalog.products
    },
    {
      headers: {
        "Cache-Control": getPublicCacheControlHeader()
      }
    }
  );
}
