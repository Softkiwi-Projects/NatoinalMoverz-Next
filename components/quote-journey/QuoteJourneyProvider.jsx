"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";

const QuoteJourneyContext = createContext({
  startJourney: () => {},
  isTransitioning: false,
});

export function useQuoteJourney() {
  return useContext(QuoteJourneyContext);
}

/**
 * Quote Journey Transition Provider
 *
 * Choreography:
 * 1. User clicks any "Get A Free Quote" button / link.
 * 2. Click origin (X, Y) is captured from the physical button's bounding rect.
 * 3. Button briefly compresses (0.97 scale).
 * 4. A brand-yellow layer expands outward from the exact button coordinates via GPU-accelerated clip-path: circle().
 * 5. When the viewport is covered (~280ms), router.push('/quote-form') is invoked.
 * 6. Destination page (/quote-form) loads and the yellow layer sweeps away upward, revealing the quote page.
 * 7. Quote form elements enter with subtle, snappy staggered motion.
 * 8. Cleanly resets on browser Back / Forward, page re-navigation, or pathname change.
 */
export default function QuoteJourneyProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // transitionState: { active: boolean, originX: number, originY: number, phase: "idle" | "expanding" | "retracting" }
  const [state, setState] = useState({
    active: false,
    originX: 0,
    originY: 0,
    phase: "idle",
  });

  const isTransitioningRef = useRef(false);
  const watchdogTimerRef = useRef(null);

  const resetTransition = useCallback(() => {
    isTransitioningRef.current = false;
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
    setState({ active: false, originX: 0, originY: 0, phase: "idle" });
    if (typeof document !== "undefined") {
      document.body.classList.remove("quote-journey-active");
    }
  }, []);

  // Preload destination page on mount for instantaneous transition
  useEffect(() => {
    try {
      router.prefetch("/quote-form");
    } catch {
      // Ignore if prefetch is unavailable
    }
  }, [router]);

  // Reset transition whenever pathname changes away from /quote-form
  useEffect(() => {
    if (pathname !== "/quote-form" && pathname !== "/quote-form/") {
      resetTransition();
    }
  }, [pathname, resetTransition]);

  // Handle browser back / forward navigation cleanly (bfcache, popstate)
  useEffect(() => {
    const handleNavigationEvent = () => {
      resetTransition();
    };

    window.addEventListener("popstate", handleNavigationEvent);
    window.addEventListener("pageshow", handleNavigationEvent);

    return () => {
      window.removeEventListener("popstate", handleNavigationEvent);
      window.removeEventListener("pageshow", handleNavigationEvent);
    };
  }, [resetTransition]);

  // When pathname arrives at /quote-form while transitioning, trigger the unmask/retract phase
  useEffect(() => {
    if (state.active && (pathname === "/quote-form" || pathname === "/quote-form/")) {
      // Small delay to ensure destination page DOM has mounted
      const retractTimer = setTimeout(() => {
        setState((prev) => ({ ...prev, phase: "retracting" }));
      }, 80);

      // Clean up and reset to idle once retract animation completes
      const doneTimer = setTimeout(() => {
        resetTransition();
      }, 480);

      return () => {
        clearTimeout(retractTimer);
        clearTimeout(doneTimer);
      };
    }
  }, [pathname, state.active, resetTransition]);

  const startJourney = useCallback(
    (eventOrElement, customTargetHref = "/quote-form") => {
      // Prevent double triggers while actively expanding
      if (isTransitioningRef.current) return;

      // Check prefers-reduced-motion
      if (typeof window !== "undefined") {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
          router.push(customTargetHref);
          return;
        }
      }

      let originX = typeof window !== "undefined" ? window.innerWidth / 2 : 500;
      let originY = typeof window !== "undefined" ? window.innerHeight / 2 : 400;

      // Extract bounding rect from event or element
      let element = null;
      if (eventOrElement?.target) {
        element = eventOrElement.target.closest("a, button, [data-quote-cta]") || eventOrElement.target;
      } else if (eventOrElement instanceof HTMLElement) {
        element = eventOrElement;
      }

      if (element && typeof element.getBoundingClientRect === "function") {
        const rect = element.getBoundingClientRect();
        originX = Math.round(rect.left + rect.width / 2);
        originY = Math.round(rect.top + rect.height / 2);

        // Tactile compression animation on the physical clicked button
        element.style.transform = "scale(0.97)";
        setTimeout(() => {
          if (element) element.style.transform = "";
        }, 120);
      }

      isTransitioningRef.current = true;
      if (typeof document !== "undefined") {
        document.body.classList.add("quote-journey-active");
      }

      // Phase 1: Expansion begins from the physical button coordinates
      setState({
        active: true,
        originX,
        originY,
        phase: "expanding",
      });

      // Phase 2: Route navigation happens as yellow blankets the viewport (~280ms)
      const pushTimer = setTimeout(() => {
        router.push(customTargetHref);
      }, 280);

      // Safety watchdog: Automatically force reset after 1000ms if navigation stalls
      if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = setTimeout(() => {
        resetTransition();
      }, 1000);

      return () => {
        clearTimeout(pushTimer);
      };
    },
    [router, resetTransition]
  );

  // Global click interceptor: captures any link or button pointing to /quote-form
  useEffect(() => {
    const handleDocumentClick = (e) => {
      // Only handle primary left click without modifier keys
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      // If transition is already in progress, ignore so we don't double trigger
      if (isTransitioningRef.current) return;

      // Check if clicked element or parent is a link to /quote-form or marked with data-quote-cta
      const cta = e.target.closest('a[href="/quote-form"], a[href="/quote-form/"], [data-quote-cta="true"]');
      if (!cta) return;

      // Don't intercept if already on the quote form page
      if (window.location.pathname === "/quote-form" || window.location.pathname === "/quote-form/") {
        return;
      }

      e.preventDefault();
      startJourney(cta, "/quote-form");
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => document.removeEventListener("click", handleDocumentClick, { capture: true });
  }, [startJourney]);

  return (
    <QuoteJourneyContext.Provider value={{ startJourney, isTransitioning: state.active }}>
      {children}

      {/* Quote Journey Fullscreen Transition Layer */}
      {state.active && (
        <div
          role="presentation"
          aria-hidden="true"
          className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden"
        >
          {/* Expanding / Retracting Brand Yellow Radial Curtain */}
          <div
            className={`absolute inset-0 bg-brand flex flex-col items-center justify-center ${
              state.phase === "expanding"
                ? "journey-expand"
                : state.phase === "retracting"
                  ? "journey-retract"
                  : ""
            }`}
            style={{
              "--origin-x": `${state.originX}px`,
              "--origin-y": `${state.originY}px`,
              willChange: "clip-path, transform",
            }}
          >
            {/* Minimal Brand Crest at Center of Transition */}
            <div className="flex flex-col items-center justify-center text-navy select-none">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy/10 text-navy shadow-inner">
                <Icon name="truck" size={28} className="translate-x-0.5" />
              </div>
              <span className="mt-3 text-xs font-black uppercase tracking-[0.25em] text-navy">
                National Movers
              </span>
              <span className="mt-0.5 text-[11px] font-bold text-navy/70">
                Loading Your Free Quote...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS for Hardware-Accelerated Radial Clip-Path Expansion */}
      <style jsx global>{`
        /* Smooth radial expansion originating from the exact button coordinate */
        .journey-expand {
          clip-path: circle(0% at var(--origin-x) var(--origin-y));
          animation: quoteExpand 0.32s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes quoteExpand {
          0% {
            clip-path: circle(0% at var(--origin-x) var(--origin-y));
          }
          100% {
            clip-path: circle(150% at var(--origin-x) var(--origin-y));
          }
        }

        /* Clean vertical wipe retraction unveiling the destination page */
        .journey-retract {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          animation: quoteRetract 0.34s cubic-bezier(0.77, 0, 0.175, 1) forwards;
        }

        @keyframes quoteRetract {
          0% {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            transform: translateY(0);
          }
          100% {
            clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
            transform: translateY(-8%);
          }
        }

        /* Forward arrow glide on hover */
        .btn-yellow:hover svg,
        .btn-quote-cta:hover svg,
        a[href="/quote-form"]:hover svg,
        a[href="/quote-form/"]:hover svg {
          transform: translateX(3px);
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ======================================================== */
        /* QUOTE PAGE STAGGERED ENTRANCE CHOREOGRAPHY               */
        /* ======================================================== */
        .quote-stagger-subtitle {
          animation: quoteItemFadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
        }

        .quote-stagger-title {
          animation: quoteItemFadeUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both;
        }

        .quote-stagger-form {
          animation: quoteCardFadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both;
        }

        @keyframes quoteItemFadeUp {
          0% {
            opacity: 0;
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes quoteCardFadeUp {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.99);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .journey-expand,
          .journey-retract,
          .quote-stagger-subtitle,
          .quote-stagger-title,
          .quote-stagger-form {
            animation: none !important;
            clip-path: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </QuoteJourneyContext.Provider>
  );
}
