"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";

/**
 * Reusable Quote CTA Button with "Quote Journey" micro-interactions.
 * Supports hover elevation, highlight sheen, icon translation, and click compression.
 */
export default function QuoteButton({
  children = "Get a Free Quote",
  href = "/quote-form",
  className = "btn-yellow",
  withArrow = true,
  ...rest
}) {
  return (
    <Link
      href={href}
      data-quote-cta="true"
      className={`btn-quote-cta inline-flex items-center justify-center gap-2.5 font-bold transition-all ${className}`}
      {...rest}
    >
      <span>{children}</span>
      {withArrow && (
        <span className="inline-block transition-transform duration-200">
          <Icon name="arrow" size={16} strokeWidth={2.5} />
        </span>
      )}
    </Link>
  );
}
