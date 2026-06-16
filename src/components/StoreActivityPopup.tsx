"use client";

import { useEffect, useMemo, useState } from "react";
import { extraSocialProofMessages, socialProofMessages } from "@/data/socialProof";

const VISIBLE_MS = 5000;
const HIDDEN_MS = 15000;

export default function StoreActivityPopup() {
  const messages = useMemo(() => [...socialProofMessages, ...extraSocialProofMessages], []);
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => {
        if (isVisible) {
          setIsVisible(false);
          return;
        }

        setIndex((current) => (current + 1) % messages.length);
        setIsVisible(true);
      },
      isVisible ? VISIBLE_MS : HIDDEN_MS
    );

    return () => window.clearTimeout(timeout);
  }, [isVisible, messages.length]);

  return (
    <div
      className={`pointer-events-none fixed bottom-24 left-4 z-40 hidden max-w-xs rounded-xl border border-pink-100 bg-white/95 p-3 text-xs shadow-lg backdrop-blur transition-all duration-300 md:block ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
      aria-hidden={!isVisible}
    >
      <p className="font-semibold text-brand-900">Live activity</p>
      <p className="mt-1 text-gray-700">{messages[index]}</p>
    </div>
  );
}
