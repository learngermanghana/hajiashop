import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/whatsapp";
export default function CheckoutSuccessPage() {
  return <section className="container-shell py-16">
    <h1 className="text-3xl font-bold">Order status</h1>
    <p className="mt-4">Online checkout is no longer available. If you made a previous payment, contact the store on WhatsApp with your transaction reference so the team can verify it. This page does not confirm payment.</p>
    <a href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-full bg-green-600 px-5 py-3 text-white">Contact via WhatsApp</a>
    <Link href="/shop" className="ml-3 inline-block text-brand-700">Products</Link>
  </section>;
}
