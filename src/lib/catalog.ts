import { productCategories as fallbackCategories, products as fallbackProducts } from "@/data/products";
import type { Product } from "@/data/products";
import { categoryDeduplicationKey, normalizeCategory } from "@/lib/productTaxonomy";
import { fetchSedifexCatalog } from "@/lib/sedifex";

export type CatalogData = {
  categories: string[];
  products: Product[];
  source: "sedifex" | "static";
};

function categoryList(products: Product[]) {
  const normalized = products.map((product) => normalizeCategory(product.category));
  const uniqueByCaseInsensitiveName = new Map(normalized.map((category) => [categoryDeduplicationKey(category), category]));
  return Array.from(uniqueByCaseInsensitiveName.values());
}

export async function getCatalogData(): Promise<CatalogData> {
  try {
    const products = await fetchSedifexCatalog();

    if (!products.length) {
      return {
        products: fallbackProducts,
        categories: fallbackCategories,
        source: "static"
      };
    }

    return {
      products,
      categories: categoryList(products),
      source: "sedifex"
    };
  } catch (error) {
    console.error("Sedifex sync failed, using static catalog fallback", error);

    return {
      products: fallbackProducts,
      categories: fallbackCategories,
      source: "static"
    };
  }
}
