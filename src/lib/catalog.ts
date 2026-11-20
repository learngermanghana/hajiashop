import { productCategories, products } from "@/data/products";
import type { Product } from "@/data/products";
export type CatalogData = { categories: string[]; products: Product[]; source: "sedifex" | "static" };
// Static catalog only; buyers confirm price and availability on WhatsApp.
export async function getCatalogData(): Promise<CatalogData> {
  return { products, categories: productCategories, source: "static" };
}
