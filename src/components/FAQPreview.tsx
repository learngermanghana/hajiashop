import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import { faqs } from "@/data/faqs";

export default function FAQPreview() {
  return (
    <section className="container-shell py-16">
      <SectionTitle eyebrow="Need help?" title="Quick answers before you order" />
      <div className="space-y-4">
        {faqs.slice(0, 3).map((faq) => (
          <article key={faq.question} className="rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold">{faq.question}</h3>
            <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
          </article>
        ))}
      </div>
      <Link href="/faq" className="mt-5 inline-block text-sm font-semibold text-brand-700">
        Read delivery & full FAQs →
      </Link>
    </section>
  );
}
