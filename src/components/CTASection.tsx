import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function CTASection() {
  return (
    <section className="container-shell py-16">
      <div className="rounded-3xl bg-gradient-to-r from-brand-500 to-brand-700 p-8 text-white">
        <h3 className="text-2xl font-semibold">Ready to upgrade your beauty routine?</h3>
        <p className="mt-2 text-pink-100">Send your order on WhatsApp or submit an inquiry now.</p>
        <div className="mt-6 flex gap-3">
          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-900"
          >
            Order on WhatsApp
          </a>
          <Link href="/contact" className="rounded-full border border-white px-5 py-3 text-sm font-semibold">
            Send Inquiry
          </Link>
        </div>
      </div>
    </section>
  );
}
