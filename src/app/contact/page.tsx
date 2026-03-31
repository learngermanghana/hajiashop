import ContactForm from "@/components/ContactForm";
import SectionTitle from "@/components/SectionTitle";
import { siteConfig } from "@/data/site";

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
          <a className="block text-brand-700" href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noreferrer">
            WhatsApp: Chat now
          </a>
          <a className="block text-brand-700" href={siteConfig.tiktok} target="_blank" rel="noreferrer">
            TikTok: Follow our page
          </a>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
