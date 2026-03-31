"use client";

import { FormEvent, useState } from "react";

type State = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      productName: formData.get("productName"),
      quantity: Number(formData.get("quantity")),
      message: formData.get("message")
    };

    if (!payload.fullName || !payload.phone || !payload.productName || !payload.message || payload.quantity <= 0) {
      setState("error");
      setError("Please fill all required fields and provide a valid quantity.");
      return;
    }

    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      setState("success");
      event.currentTarget.reset();
      return;
    }

    const result = await response.json();
    setState("error");
    setError(result.error ?? "Something went wrong. Please try again.");
  }

  return (
    <form className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium">Full Name *</label>
        <input name="fullName" className="w-full rounded-xl border border-gray-200 px-3 py-2" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Phone Number *</label>
        <input name="phone" className="w-full rounded-xl border border-gray-200 px-3 py-2" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Email (optional)</label>
        <input name="email" type="email" className="w-full rounded-xl border border-gray-200 px-3 py-2" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Product Name *</label>
        <input name="productName" className="w-full rounded-xl border border-gray-200 px-3 py-2" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Quantity *</label>
        <input name="quantity" type="number" min={1} defaultValue={1} className="w-full rounded-xl border border-gray-200 px-3 py-2" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Message *</label>
        <textarea name="message" rows={4} className="w-full rounded-xl border border-gray-200 px-3 py-2" required />
      </div>
      <button
        className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        disabled={state === "loading"}
      >
        {state === "loading" ? "Submitting..." : "Submit inquiry"}
      </button>
      {state === "success" ? <p className="text-sm text-green-600">Inquiry sent successfully. We will contact you soon.</p> : null}
      {state === "error" ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
