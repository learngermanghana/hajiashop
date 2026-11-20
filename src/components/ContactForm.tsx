"use client";
import type { FormEvent } from "react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
export default function ContactForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (name: string) => String(data.get(name) || "").trim();
    const message = [
      "Hello Hajia Slay Shop, I am enquiring from your website.",
      `Name: ${get("fullName")}`, `Phone: ${get("phone")}`,
      get("email") ? `Email: ${get("email")}` : "",
      `Product: ${get("productName")}`, `Quantity: ${get("quantity")}`,
      `Message: ${get("message")}`
    ].filter(Boolean).join("\n");
    window.location.href = buildWhatsAppLink(message);
  }
  return <form className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
    <p className="text-sm text-gray-600">Fill the details to prepare a WhatsApp message. No information is sent to a server.</p>
    <label className="block text-sm font-medium">Full Name *<input name="fullName" className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2" required /></label>
    <label className="block text-sm font-medium">Phone Number *<input name="phone" type="tel" className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2" required /></label>
    <label className="block text-sm font-medium">Email (optional)<input name="email" type="email" className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2" /></label>
    <label className="block text-sm font-medium">Product Name *<input name="productName" className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2" required /></label>
    <label className="block text-sm font-medium">Quantity *<input name="quantity" type="number" min={1} defaultValue={1} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2" required /></label>
    <label className="block text-sm font-medium">Message *<textarea name="message" rows={4} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2" required /></label>
    <button type="submit" className="rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white">Continue on WhatsApp</button>
  </form>;
}
