import Link from "next/link";

export default function FailedPage() {
  return <section className="container-shell py-12"><h1 className="text-3xl font-bold">Payment failed or cancelled</h1><p className="mt-3">Your cart is still saved. You can retry payment now.</p><Link href="/checkout" className="mt-4 inline-block rounded-full bg-brand-600 px-4 py-2 text-white">Retry payment</Link></section>;
}
