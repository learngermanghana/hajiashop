import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/whatsapp";
export default function CheckoutFailedPage() {
  return <section className="container-shell py-16">
    <h1 className="text-3xl font-bold">Online checkout unavailable</h1>
    <p className="mt-4">Online payments have been disabled. For an order enquiry, contact the shop directly on WhatsApp.</p>
    <a href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-full bg-green-600 px-5 py-3 text-white">Ask on WhatsApp</a>
    <Link href="/shop" className="ml-3 inline-block text-brand-700">Back to products</Link>
  </section>;
}
