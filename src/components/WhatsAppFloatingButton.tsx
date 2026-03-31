import { siteConfig } from "@/data/site";

export default function WhatsAppFloatingButton() {
  return (
    <a
      href={`https://wa.me/${siteConfig.whatsappNumber}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 rounded-full bg-green-500 px-5 py-3 text-sm font-semibold text-white shadow-lg"
    >
      WhatsApp Order
    </a>
  );
}
