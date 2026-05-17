"use client";

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/site";
import { useEffect, useState } from "react";
import { CART_STORAGE_KEY } from "@/lib/cart";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export default function Header() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const readCount = () => {
      try {
        const raw = window.localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) return setCartCount(0);
        const parsed = JSON.parse(raw) as Array<{ qty?: number }>;
        setCartCount(parsed.reduce((sum, item) => sum + Math.max(0, Number(item.qty) || 0), 0));
      } catch {
        setCartCount(0);
      }
    };

    readCount();
    window.addEventListener("cart:updated", readCount);
    window.addEventListener("storage", readCount);
    return () => {
      window.removeEventListener("cart:updated", readCount);
      window.removeEventListener("storage", readCount);
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
        <Link href="/checkout" className="relative rounded-full border border-pink-200 px-4 py-2 text-sm font-medium min-h-11">Cart ({cartCount})</Link>
        <Link href="/shop" className="relative rounded-full border border-pink-200 px-4 py-2 text-sm font-medium min-h-11">Shop products</Link>
        <a className="hidden rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 md:inline-flex" href={buildWhatsAppLink()} target="_blank" rel="noreferrer">WhatsApp Order</a>
      </div>
    </div>
  </header>;
}