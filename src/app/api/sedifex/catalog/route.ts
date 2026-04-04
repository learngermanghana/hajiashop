import { NextResponse } from "next/server";
import { getCatalogData } from "@/lib/catalog";

export async function GET() {
  const catalog = await getCatalogData();

  return NextResponse.json({
    source: catalog.source,
    workspaceId: process.env.SEDIFEX_WORKSPACE_ID ?? null,
    workspaceHeader: process.env.SEDIFEX_WORKSPACE_HEADER ?? "x-workspace-id",
    workspaceQueryParam: process.env.SEDIFEX_WORKSPACE_QUERY_PARAM ?? null,
    categories: catalog.categories,
    count: catalog.products.length,
    products: catalog.products
  });
}
