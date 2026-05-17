import { siteConfig } from "@/data/site";
import { fetchSedifexPromo, toSedifexContactLinks } from "@/lib/sedifex";

export default async function TikTokSection() {
  const promo = await fetchSedifexPromo();
  const contactLinks = toSedifexContactLinks(promo, {
    name: siteConfig.name,
    phone: siteConfig.phone,
    whatsapp: siteConfig.whatsappNumber,
    website: siteConfig.baseUrl,
    tiktok: siteConfig.tiktok
  });

  return (
    <section className="container-shell py-16">
      <div className="rounded-3xl bg-brand-900 p-8 text-white md:flex md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-pink-200">Community</p>
          <h3 className="mt-2 text-2xl font-semibold">Follow our beauty looks on TikTok</h3>
          <p className="mt-2 text-pink-100">See product demos, customer transformations, and new arrivals.</p>
        </div>
        <a
          href={contactLinks.social.tiktok ?? siteConfig.tiktok}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block rounded-full bg-white px-5 py-3 font-medium text-brand-900 md:mt-0"
        >
          Visit TikTok
        </a>
      </div>
    </section>
  );
}
