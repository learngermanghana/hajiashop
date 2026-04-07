import Link from "next/link";
import { siteConfig } from "@/data/site";
import { fetchSedifexPromo, fetchSedifexPromoGallery } from "@/lib/sedifex";

const HERO_BACKGROUND_IMAGE = "/uploads/home/IMG_4435.JPG.jpeg";

export default async function HeroSection() {
  const [promo, promoGallery] = await Promise.all([fetchSedifexPromo(), fetchSedifexPromoGallery()]);
  const promoImage = promoGallery[0]?.url ?? HERO_BACKGROUND_IMAGE;
  const promoTitle = promo?.promoTitle?.trim() || promo?.name?.trim() || promo?.displayName?.trim() || "Latest promo";
  const promoSummary = promo?.promoSummary?.trim() || "Follow our latest store promotion and limited-time offers.";

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.6), rgba(17, 24, 39, 0.45)), url(${promoImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="container-shell py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="font-semibold uppercase tracking-widest text-pink-100">Promo Ad</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">{promoTitle}</h1>
          <p className="mt-5 whitespace-pre-line text-lg text-pink-50">{promoSummary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              className="rounded-full border border-pink-100 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-sm"
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              Book on WhatsApp
            </a>
            <a
              className="rounded-full bg-brand-500 px-6 py-3 font-medium text-white"
              href={siteConfig.branch.mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Get Directions ({siteConfig.branch.label})
            </a>
            <Link className="rounded-full bg-white px-6 py-3 font-medium text-brand-900" href="/shop">
              View Products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
