import CheckoutPageClient from "@/components/CheckoutPageClient";
import { getCatalogData } from "@/lib/catalog";

export default async function CheckoutPage() {
  const { products } = await getCatalogData();
  return <CheckoutPageClient products={products} />;
}
