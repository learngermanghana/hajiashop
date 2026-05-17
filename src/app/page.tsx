import CTASection from "@/components/CTASection";
import FAQPreview from "@/components/FAQPreview";
import FeaturedProducts from "@/components/FeaturedProducts";
import HeroSection from "@/components/HeroSection";
import SectionTitle from "@/components/SectionTitle";
import TestimonialsSection from "@/components/TestimonialsSection";
import TikTokSection from "@/components/TikTokSection";
import BlogCards from "@/components/blog/BlogCards";
import { fetchSedifexBlogPosts } from "@/lib/blog";

export default async function HomePage() {
  const posts = await fetchSedifexBlogPosts();
  const latestUpdates = posts.slice(0, 4);

  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <section className="container-shell py-16">
        <SectionTitle eyebrow="Why choose us" title="Trusted beauty products, real results" />
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl bg-pink-50 p-5">
            <h3 className="font-semibold">Authentic Cosmetics</h3>
            <p className="mt-2 text-sm text-gray-600">We source high-quality makeup and beauty products customers can trust.</p>
          </article>
          <article className="rounded-xl bg-pink-50 p-5">
            <h3 className="font-semibold">Fast Support</h3>
            <p className="mt-2 text-sm text-gray-600">Quick response on WhatsApp to help with product selection and orders.</p>
          </article>
          <article className="rounded-xl bg-pink-50 p-5">
            <h3 className="font-semibold">Reliable Delivery</h3>
            <p className="mt-2 text-sm text-gray-600">Safe packaging and dependable dispatch for smooth customer experience.</p>
          </article>
        </div>
        <ul className="mt-5 space-y-2 rounded-xl border border-pink-100 bg-white p-4 text-sm text-gray-700">
          <li>🛍️ Buy from our shop.</li>
          <li>
            ✅ Verified on <a href="https://www.sedifexmarket.com" target="_blank" rel="noreferrer" className="font-semibold text-brand-700 underline">www.sedifexmarket.com</a>.
          </li>
          <li>🚚 24-hour delivery when you order before 4:00 PM.</li>
          <li>💳 Mobile money, credit cards, and pay on delivery are all accepted.</li>
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
