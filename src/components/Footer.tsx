import Link from "next/link";
import { siteConfig } from "@/data/site";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-pink-100 bg-pink-50">
      <div className="container-shell grid gap-8 py-12 md:grid-cols-3">
        <div>
          <h3 className="font-semibold text-brand-900">{siteConfig.name}</h3>
          <p className="mt-2 text-sm text-gray-700">{siteConfig.description}</p>
        </div>
        <div>
          <h4 className="font-semibold">Quick links</h4>
          <div className="mt-2 flex flex-col gap-2 text-sm">
            <Link href="/shop">Shop</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Contact</h4>
          <p className="mt-2 text-sm text-gray-700">Phone: {siteConfig.phone}</p>
          <a className="text-sm text-brand-700" href={siteConfig.tiktok} target="_blank" rel="noreferrer">
            TikTok
          </a>
        </div>
      </div>
      <div className="border-t border-pink-100">
        <p className="container-shell py-4 text-center text-sm text-gray-600">
          Developed by Xenom IT Solutions, founders of Sedifex and Falowen App.
        </p>
      </div>
      <div className="border-t border-pink-200 bg-gradient-to-r from-pink-100 via-white to-pink-100">
        <div className="container-shell py-5">
          <div className="rounded-2xl border border-pink-200 bg-white/80 px-4 py-4 shadow-sm">
            <ul className="grid gap-2 text-sm text-gray-700 md:grid-cols-2">
              <li>🛍️ Buy from our shop.</li>
              <li>
                ✅ Verified on{" "}
                <a
                  className="font-medium text-brand-700 underline decoration-pink-300 underline-offset-2"
                  href="https://www.sedifexmarket.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  www.sedifexmarket.com
                </a>
                .
              </li>
              <li>🚚 24-hour delivery when you order before 4:00 PM.</li>
              <li>💳 Mobile money, credit cards, and pay on delivery are all accepted.</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
