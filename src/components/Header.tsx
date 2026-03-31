import Link from "next/link";
import { siteConfig } from "@/data/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-pink-100 bg-white/95 backdrop-blur">
      <div className="container-shell flex h-16 items-center justify-between">
        <Link href="/" className="font-semibold text-brand-900">
          {siteConfig.name}
        </Link>
        <nav className="hidden gap-5 text-sm md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-gray-700 hover:text-brand-700">
              {link.label}
            </Link>
          ))}
        </nav>
        <a
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          href={`https://wa.me/${siteConfig.whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp Order
        </a>
      </div>
    </header>
  );
}
