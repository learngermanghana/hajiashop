"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { siteConfig } from "@/data/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { readCartFromStorage } from "@/lib/cart";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/checkout", label: "Checkout" },
  { href: "/blog", label: "Blog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export default function Header() {
    const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const sync = () => setCartCount(readCartFromStorage().reduce((s, i) => s + i.qty, 0));
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("cart:updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cart:updated", sync);
    };
  }, []);

  return <header className="sticky top-0 z-40 border-b border-pink-100 bg-white/95 backdrop-blur">{/* unchanged layout */}
    <div className="container-shell flex h-16 items-center justify-between">
      <Link href="/" className="flex items-center gap-2 font-semibold text-brand-900">
        <Image src="/logo.svg" alt={`${siteConfig.name} logo`} width={36} height={36} priority />
        <span>{siteConfig.name}</span>
      </Link>
      <nav className="hidden gap-5 text-sm md:flex">
        {links.map((link) => <Link key={link.href} href={link.href} className="text-gray-700 hover:text-brand-700">{link.label}</Link>)}
      </nav>
      <div className="flex items-center gap-3">
        <Link href="/checkout" className="relative rounded-full border border-pink-200 px-4 py-2 text-sm font-medium min-h-11">Cart
          {cartCount > 0 ? <span className="ml-2 inline-flex min-w-6 justify-center rounded-full bg-brand-600 px-1 text-white">{cartCount}</span> : null}
        </Link>
        <a className="hidden rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 md:inline-flex" href={buildWhatsAppLink()} target="_blank" rel="noreferrer">WhatsApp Order</a>
      </div>
    </div>
  </header>;
}
