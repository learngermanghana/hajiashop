import Link from "next/link";
import { getHomeImages } from "@/lib/home-images";
import { siteConfig } from "@/data/site";

export default function HeroSection() {
  const [heroImage = "/uploads/home/hero-beauty.jpg"] = getHomeImages();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-pink-100">
      <div className="container-shell grid gap-8 py-20 md:grid-cols-2 md:items-center">
        <div>
          <p className="font-semibold uppercase tracking-widest text-brand-700">Premium Beauty Store</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
            Glow confidently with authentic makeup from {siteConfig.name}
          </h1>
          <p className="mt-5 text-gray-600">
            Shop trusted cosmetic products for lips, face, and eyes. Order directly via WhatsApp or send a quick inquiry.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="rounded-full bg-brand-500 px-6 py-3 font-medium text-white" href="/shop">
              Shop Now
            </Link>
            <a
              className="rounded-full border border-brand-300 px-6 py-3 font-medium text-brand-700"
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
        <div className="rounded-3xl border border-pink-100 bg-white p-3 shadow-lg">
          <img
            src={heroImage}
            alt="Beauty products display"
            className="h-[420px] w-full rounded-2xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}
