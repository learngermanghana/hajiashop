import CTASection from "@/components/CTASection";
import FAQPreview from "@/components/FAQPreview";
import FeaturedProducts from "@/components/FeaturedProducts";
import GalleryPreview from "@/components/GalleryPreview";
import HeroSection from "@/components/HeroSection";
import SectionTitle from "@/components/SectionTitle";
import TestimonialsSection from "@/components/TestimonialsSection";
import TikTokSection from "@/components/TikTokSection";

export default function HomePage() {
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
      </section>
      <TestimonialsSection />
      <TikTokSection />
      <GalleryPreview />
      <FAQPreview />
      <CTASection />
    </>
  );
}
