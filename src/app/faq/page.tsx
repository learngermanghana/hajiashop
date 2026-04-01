import SectionTitle from "@/components/SectionTitle";
import { faqs } from "@/data/faqs";

export default function FAQPage() {
  return (
    <section className="container-shell py-14">
      <SectionTitle eyebrow="FAQ & Delivery" title="Everything you need before checkout" />
      <div className="space-y-6">
        <article className="rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold">How ordering works</h2>
          <p className="mt-2 text-sm text-gray-600">Browse products, open details, then order on WhatsApp or send inquiry form.</p>
        </article>
        <article className="rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold">Payment options</h2>
          <p className="mt-2 text-sm text-gray-600">Mobile money and transfers currently. Future Paystack integration is supported by architecture.</p>
        </article>
        <article className="rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold">Delivery info</h2>
          <p className="mt-2 text-sm text-gray-600">Deliveries are dispatched quickly, with timelines based on location and courier schedules.</p>
        </article>
        <article className="rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold">Returns/Exchange</h2>
          <p className="mt-2 text-sm text-gray-600">Unopened items may qualify for exchange after review by support team.</p>
        </article>
        {faqs.map((faq) => (
          <article key={faq.question} className="rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold">{faq.question}</h3>
            <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
