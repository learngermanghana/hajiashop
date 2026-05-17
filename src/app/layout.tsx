import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import StoreActivityPopup from "@/components/StoreActivityPopup";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: {
    default: "Hajia Slay Shop Accra | Cosmetics, Skincare & Beauty Essentials",
    template: "%s | Hajia Slay Shop Accra"
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: siteConfig.baseUrl
  },
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: siteConfig.baseUrl,
    siteName: siteConfig.name,
    title: "Hajia Slay Shop Accra | Verified Beauty Shop on Sedifex Market",
    description: siteConfig.description
  },
  twitter: {
    card: "summary_large_image",
    title: "Hajia Slay Shop Accra | Cosmetics & Beauty Essentials",
    description: siteConfig.shortDescription
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg"
  },
  metadataBase: new URL(siteConfig.baseUrl)
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8991390842894141"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <StoreActivityPopup />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
