"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const defaultStats = [
  { value: "1200+", label: "Happy Customers" },
  { value: "5+", label: "Years of Experience" },
  { value: "10+", label: "Location Served" },
  { value: "95%", label: "Satisfaction Rate" },
];

// Fires once when the element scrolls into view.
function useInView(ref, threshold = 0.35) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

// Counts from 0 to the numeric part of `value` when `run` becomes true,
// preserving any prefix/suffix (e.g. "1200+", "95%").
function Counter({ value, run, duration = 1800 }) {
  // Parse once per value so the reference is stable across re-renders.
  const { prefix, target, suffix, numeric } = useMemo(() => {
    const m = String(value).match(/^(\D*)(\d[\d,]*)(.*)$/);
    return m
      ? { prefix: m[1], target: parseInt(m[2].replace(/,/g, ""), 10), suffix: m[3], numeric: true }
      : { prefix: "", target: 0, suffix: "", numeric: false };
  }, [value]);

  const [display, setDisplay] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!run || !numeric || doneRef.current) return;
    doneRef.current = true; // guard against restarts
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(target);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, numeric, target, duration]);

  if (!numeric) return value;
  return (
    <>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </>
  );
}

export default function Stats({ stats = defaultStats }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <section ref={ref} className="bg-brand">
      <div className="container-page grid grid-cols-2 gap-6 py-12 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-4xl font-extrabold tabular-nums text-ink-strong md:text-5xl">
              <Counter value={s.value} run={inView} />
            </p>
            <p className="mt-1 text-sm font-bold uppercase tracking-wide text-ink-strong/70">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
