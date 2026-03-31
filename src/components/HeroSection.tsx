import Link from "next/link";
import { siteConfig } from "@/data/site";

const HERO_BACKGROUND_IMAGE = "/uploads/home/IMG_4435.JPG.jpeg";

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.6), rgba(17, 24, 39, 0.45)), url(${HERO_BACKGROUND_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="container-shell py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="font-semibold uppercase tracking-widest text-pink-100">Premium Beauty Store</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">
            Glow confidently with authentic makeup from {siteConfig.name}
          </h1>
          <p className="mt-5 text-lg text-pink-50">
            Shop trusted cosmetic products for lips, face, and eyes. Order directly via WhatsApp or send a quick inquiry.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="rounded-full bg-brand-500 px-6 py-3 font-medium text-white" href="/shop">
              Shop Now
            </Link>
            <a
              className="rounded-full border border-pink-100 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-sm"
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
