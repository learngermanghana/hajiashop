"use client";

import { useEffect, useMemo, useState } from "react";
import { extraSocialProofMessages, socialProofMessages } from "@/data/socialProof";

const ROTATION_MS = 4500;

export default function StoreActivityPopup() {
  const messages = useMemo(() => [...socialProofMessages, ...extraSocialProofMessages], []);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, ROTATION_MS);

    return () => window.clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="pointer-events-none fixed bottom-24 left-4 z-40 hidden max-w-xs rounded-xl border border-pink-100 bg-white/95 p-3 text-xs shadow-lg backdrop-blur md:block">
      <p className="font-semibold text-brand-900">Live activity</p>
      <p className="mt-1 text-gray-700">{messages[index]}</p>
    </div>
  );
}
