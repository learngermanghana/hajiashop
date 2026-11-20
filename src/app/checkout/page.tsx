import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/whatsapp";
export default function CheckoutPage() {
  return <section className="container-shell max-w-2xl py-16">
    <h1 className="text-3xl font-bold text-brand-900">Order by WhatsApp</h1>
    <p className="mt-4 text-gray-700">Online checkout is disabled. Please contact us on WhatsApp to confirm the product, price, stock and delivery before ordering.</p>
    <div className="mt-7 flex flex-wrap gap-3">
      <a href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="rounded-full bg-green-600 px-5 py-3 font-semibold text-white">Chat on WhatsApp</a>
      <Link href="/shop" className="rounded-full border border-gray-200 px-5 py-3 font-semibold">Browse products</Link>
    </div>
  </section>;
}
