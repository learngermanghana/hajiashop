import { siteConfig } from "@/data/site";

export default function TikTokSection() {
  return (
    <section className="container-shell py-16">
      <div className="rounded-3xl bg-brand-900 p-8 text-white md:flex md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-pink-200">Community</p>
          <h3 className="mt-2 text-2xl font-semibold">Follow our beauty looks on TikTok</h3>
          <p className="mt-2 text-pink-100">See product demos, customer transformations, and new arrivals.</p>
        </div>
        <a
          href={siteConfig.tiktok}
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
