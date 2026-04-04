import { NextResponse } from "next/server";
import { getCatalogData } from "@/lib/catalog";

export async function GET() {
  const catalog = await getCatalogData();

  return NextResponse.json({
    source: catalog.source,
    categories: catalog.categories,
    count: catalog.products.length,
    products: catalog.products
  });
}
