"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { siteConfig } from "@/data/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-pink-100 bg-white/95 backdrop-blur">
      <div className="container-shell flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-brand-900"
          onClick={() => setIsMenuOpen(false)}
        >
          <Image src="/logo.svg" alt={`${siteConfig.name} logo`} width={36} height={36} priority />
          <span>{siteConfig.name}</span>
        </Link>

        <nav className="hidden gap-5 text-sm md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-gray-700 hover:text-brand-700">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            className="hidden rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 md:inline-flex"
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp Order
          </a>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-pink-100 p-2 text-brand-900 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span className="text-xl leading-none">☰</span>
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav className="border-t border-pink-100 bg-white px-4 py-3 md:hidden">
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-sm font-medium text-gray-700 hover:text-brand-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                className="inline-flex rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp Order
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
