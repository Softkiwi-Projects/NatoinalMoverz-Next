"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";

export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;
  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-brand text-ink-strong shadow-card transition-transform hover:-translate-y-1"
    >
      <Icon name="chevron" size={22} className="rotate-180" />
    </button>
  );
}
