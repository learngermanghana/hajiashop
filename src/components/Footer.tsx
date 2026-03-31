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
    </footer>
  );
}
