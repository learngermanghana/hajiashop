import ContactForm from "@/components/ContactForm";
import SectionTitle from "@/components/SectionTitle";
import { siteConfig } from "@/data/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const googleMapsEmbedUrl =
  "https://www.google.com/maps?q=5.6052354,-0.2473795&z=17&output=embed";

export default function ContactPage() {
  return (
    <section className="container-shell py-14">
      <SectionTitle
        eyebrow="Contact & Orders"
        title="Send an inquiry or place your order"
        description="Need recommendations or ready to buy? Reach us directly on WhatsApp or submit the form."
      />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl bg-pink-50 p-6">
          <h3 className="text-xl font-semibold">Contact details</h3>
          <p>Phone: {siteConfig.phone}</p>
          <a
            className="block text-brand-700"
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp: Chat now
          </a>
          <a
            className="block text-brand-700"
            href={siteConfig.tiktok}
            target="_blank"
            rel="noreferrer"
          >
            TikTok: Follow our page
          </a>
        </div>
        <ContactForm />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-pink-100 shadow-sm">
        <iframe
          title="Hajia Slay Empire location map"
          src={googleMapsEmbedUrl}
          className="h-[360px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
