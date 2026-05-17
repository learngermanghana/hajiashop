import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";

const highlights = [
  {
    title: "Authentic beauty, always",
    description:
      "We carefully source products from trusted suppliers, so every order you place is genuine and safe for your routine.",
  },
  {
    title: "Guidance you can trust",
    description:
      "Not sure what to buy? We give straightforward recommendations based on your skin goals, budget, and preferred product type.",
  },
  {
    title: "Fast support & delivery",
    description:
      "From checkout questions to order updates, our team responds quickly and works hard to get your order to you on time.",
  },
];

export default function AboutPage() {
  return (
    <section className="container-shell space-y-10 py-14">
      <SectionTitle
        eyebrow="About us"
        title="The story behind Hajia Slay Shop"
      />

      <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-start">
        <div className="space-y-5 text-gray-700">
          <p>
            Hajia Slay Shop was built to make premium, everyday beauty products
            accessible to every confident woman who wants to slay effortlessly.
          </p>
          <p>
            What started as a passion for helping women feel beautiful has grown
            into a trusted beauty store focused on quality, care, and results.
            We know shopping for skincare and body care can be overwhelming, so
            we keep things simple: authentic products, transparent guidance, and
            a customer-first experience.
          </p>
          <p>
            Our mission is to help you feel confident in what you buy and even
            more confident when you use it.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Why customers choose us</h2>
          <ul className="mt-4 space-y-4">
            {highlights.map((item) => (
              <li key={item.title}>
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl bg-gray-900 p-6 text-white md:p-8">
        <h2 className="text-xl font-semibold">Need help choosing the right product?</h2>
        <p className="mt-2 max-w-2xl text-sm text-gray-200 md:text-base">
          Send us a quick message and our team will help you build a routine that
          matches your goals.
        </p>
        <div className="mt-5">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
          >
            Contact our team
          </Link>
        </div>
      </div>
    </section>
  );
}
