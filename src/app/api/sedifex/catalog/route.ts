import { NextResponse } from "next/server";
import { getCatalogData } from "@/lib/catalog";

export const revalidate = 900;

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
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400"
      }
    }
  );
}
