import { siteConfig } from "@/data/site";

export const websiteWhatsAppTemplate =
  "Hello Hajia Slay Shop, I am messaging from your website and I want to place an order. Please assist me.";

export function buildWhatsAppLink(message = websiteWhatsAppTemplate) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}
