import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import FAQPreview from "@/components/FAQPreview";
import FeaturedProducts from "@/components/FeaturedProducts";
import HeroSection from "@/components/HeroSection";
import SectionTitle from "@/components/SectionTitle";
import TestimonialsSection from "@/components/TestimonialsSection";
import TikTokSection from "@/components/TikTokSection";
import BlogCards from "@/components/blog/BlogCards";
import { siteConfig } from "@/data/site";
import { fetchSedifexBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Best Cosmetics & Beauty Shop in Accra",
  description:
    "Shop skincare, body wash, makeup and premium beauty essentials from Hajia Slay Shop in Accra. Verified on Sedifex Market with secure Paystack checkout.",
  alternates: {
    canonical: siteConfig.baseUrl
  },
  openGraph: {
    title: "Hajia Slay Shop Accra | Verified Beauty Shop",
    description:
      "A trusted cosmetics and skincare shop in Accra for body wash, glow products, makeup and beauty essentials.",
    url: siteConfig.baseUrl,
    type: "website"
  }
};

export default async function HomePage() {
  const posts = await fetchSedifexBlogPosts();
  const latestUpdates = posts.slice(0, 4);
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySupplyStore",
    name: siteConfig.name,
    alternateName: siteConfig.seoName,
    description: siteConfig.description,
    url: siteConfig.baseUrl,
    email: siteConfig.supportEmail,
    telephone: siteConfig.phone,
    areaServed: ["Accra", "Greater Accra", "Ghana"],
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.branch.city,
      addressRegion: siteConfig.branch.region,
      addressCountry: siteConfig.branch.country
    },
    sameAs: [siteConfig.sedifexMarketUrl, siteConfig.tiktok],
    knowsAbout: ["Cosmetics", "Skincare", "Body wash", "Beauty essentials", "Makeup"],
    paymentAccepted: "Paystack online payment, mobile money, card payment"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <HeroSection />
      <FeaturedProducts />
      <section className="container-shell py-16">
        <SectionTitle eyebrow="Why choose us" title="Trusted beauty products, real results" />
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl bg-pink-50 p-5">
            <h3 className="font-semibold">Authentic Cosmetics</h3>
            <p className="mt-2 text-sm text-gray-600">We source high-quality makeup, skincare, body wash and beauty products customers in Accra can trust.</p>
          </article>
          <article className="rounded-xl bg-pink-50 p-5">
            <h3 className="font-semibold">Verified on Sedifex Market</h3>
            <p className="mt-2 text-sm text-gray-600">Hajia Slay Shop is connected to Sedifex Market for clearer product listings, online checkout and store visibility.</p>
          </article>
          <article className="rounded-xl bg-pink-50 p-5">
            <h3 className="font-semibold">Reliable Accra Delivery</h3>
            <p className="mt-2 text-sm text-gray-600">Safe packaging, quick WhatsApp support and dependable dispatch for customers in Accra and nearby areas.</p>
          </article>
        </div>
        <ul className="mt-5 space-y-2 rounded-xl border border-pink-100 bg-white p-4 text-sm text-gray-700">
          <li>🛍️ Shop premium cosmetics, skincare, body wash and beauty essentials in Accra.</li>
          <li>
            ✅ Verified on <a href={siteConfig.sedifexMarketUrl} target="_blank" rel="noreferrer" className="font-semibold text-brand-700 underline">Sedifex Market</a>.
          </li>
          <li>🚚 Delivery support for Accra customers and nearby areas.</li>
          <li>💳 Secure online payment through Paystack.</li>
        </ul>
      </section>
      <section className="container-shell py-16">
        <SectionTitle eyebrow="Updates" title="Latest updates and highlighted products" />
        {latestUpdates.length ? (
          <BlogCards posts={latestUpdates} />
        ) : (
          <p className="text-sm text-gray-600">No published updates available right now.</p>
        )}
      </section>
      <TestimonialsSection />
      <TikTokSection />
      <FAQPreview />
      <CTASection />
    </>
  );
}
