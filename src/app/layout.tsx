import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: {
    default: "Hajia Slay Shop | Premium Cosmetics & Beauty Essentials",
    template: "%s | Hajia Slay Shop"
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.baseUrl)
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
