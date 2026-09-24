"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { site } from "@/data/site";

/**
 * National Movers Premium Entrance Animation — "The Journey Begins"
 *
 * Sequence & Timing:
 *  - 0.00–0.50s: Deep navy atmosphere & GPS telemetry HUD establish. Truck is completely hidden.
 *  - 0.40–1.90s: Yellow route highway draws smoothly across the map.
 *  - 0.65s: Headlights flash on! The National Movers truck ignites at the route origin.
 *  - 0.70–2.50s: Truck drives along the curved highway, banking into turns with twin forward light beams.
 *  - 0.85s: Auckland waypoint activates with a radar ping.
 *  - 1.75s: Truck arrives at Tauranga Hub; a golden shockwave ripples outward and the National Movers logo glows in.
 *  - 2.40s: Nationwide waypoint activates.
 *  - 2.60–3.30s: Headlights flood the screen into a rich golden horizon transition.
 *  - 3.00–3.70s: The golden curtain sweeps upward, unveiling the live homepage hero.
 *  - 3.10–3.80s: Hero elements complete their staggered entrance.
 *  - 3.90s: Splash component cleanly unmounts from DOM.
 */
export default function SplashTransition({ children }) {
  const [phase, setPhase] = useState("idle");
  const [telemetryStatus, setTelemetryStatus] = useState("LOCATING FLEET");
  const [distanceKm, setDistanceKm] = useState(0);

  const finishIntro = useCallback(() => {
    setPhase("done");
    try {
      sessionStorage.setItem("nm_intro_played", "1");
    } catch {
      // Ignore in private/restricted storage environments
    }
    document.body.classList.remove("intro-active");
  }, []);

  useEffect(() => {
    // 1. Accessibility: Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      finishIntro();
      return;
    }

    // 2. Performance: Check if already played in this browser session
    const urlParams = new URLSearchParams(window.location.search);
    const forceReplay = urlParams.has("intro") || urlParams.has("replay");

    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem("nm_intro_played") === "1";
    } catch {
      alreadySeen = false;
    }

    if (alreadySeen && !forceReplay) {
      finishIntro();
      return;
    }

    // Lock body during intro
    document.body.classList.add("intro-active");
    setPhase("playing");

    // Dynamic telemetry updates matching the truck's journey
    const t1 = setTimeout(() => {
      setTelemetryStatus("EN ROUTE · AUCKLAND DEPARTURE");
      setDistanceKm(45);
    }, 550);

    const t2 = setTimeout(() => {
      setTelemetryStatus("IN TRANSIT · WAIKATO HIGHWAY");
      setDistanceKm(160);
    }, 1050);

    const t3 = setTimeout(() => {
      setTelemetryStatus("ARRIVED · TAURANGA HUB");
      setDistanceKm(285);
    }, 1550);

    const t4 = setTimeout(() => {
      setTelemetryStatus("EXPANDING · NATIONWIDE REACH");
      setDistanceKm(420);
    }, 2050);

    // Phase 5 reveal transition timer (2.25s)
    const revealTimer = setTimeout(() => {
      setPhase("revealing");
    }, 2250);

    // Complete animation & cleanly unmount splash timer (3.10s)
    const completeTimer = setTimeout(() => {
      finishIntro();
    }, 3100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(revealTimer);
      clearTimeout(completeTimer);
      document.body.classList.remove("intro-active");
    };
  }, [finishIntro]);

  const isIntroActive = phase === "playing" || phase === "revealing";

  return (
    <>
      {/* Preload hero background image immediately in background */}
      <link
        rel="preload"
        as="image"
        href="/wp-content/uploads/2025/01/40330.jpg"
        fetchPriority="high"
      />

      {/* Main page content — rendered natively for SEO & accessibility */}
      <div
        className={`page-content-wrapper transition-opacity duration-700 ${
          isIntroActive ? "content-stagger-ready" : ""
        }`}
        data-intro-phase={phase}
      >
        {children}
      </div>

      {/* Splash Transition Screen */}
      {isIntroActive && (
        <div
          role="dialog"
          aria-label="National Movers Entrance"
          aria-hidden={phase === "done"}
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${
            phase === "revealing" ? "pointer-events-none" : "pointer-events-auto"
          }`}
          style={{ willChange: "transform, opacity" }}
        >
          {/* Phase 1: Deep Navy Canvas with Ambient Glow */}
          <div
            className={`absolute inset-0 bg-[#080e14] transition-opacity duration-700 ${
              phase === "revealing" ? "opacity-0" : "opacity-100"
            }`}
          >
            {/* GPS Telemetry Grid */}
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage: `linear-gradient(#ffd332 1px, transparent 1px), linear-gradient(90deg, #ffd332 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
              }}
            />

            {/* Ambient Radial Golden Aura */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[340px] w-[340px] sm:h-[500px] sm:w-[500px] rounded-full bg-brand/12 blur-[100px] sm:blur-[140px] pointer-events-none" />
          </div>

          {/* Top Telemetry HUD (Replaces Skip Option with Live Satellite HUD) */}
          <div
            className={`absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 z-20 flex items-center justify-between text-xs tracking-widest text-white/50 font-mono transition-opacity duration-500 ${
              phase === "revealing" ? "opacity-0" : "opacity-100"
            }`}
          >
            {/* Satellite Status Indicator */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
              </span>
              <span className="font-semibold text-white/90 text-[10px] sm:text-xs tracking-wider">
                NZ FLEET DISPATCH
              </span>
              <span className="hidden sm:inline text-white/30">|</span>
              <span className="hidden sm:inline text-brand font-bold text-[11px]">
                {telemetryStatus}
              </span>
            </div>

            {/* Live GPS Odometer & Telemetry Readout */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[10px] sm:text-[11px] backdrop-blur">
              <span className="text-white/40">ODOMETER:</span>
              <span className="font-bold text-brand tabular-nums">
                {String(distanceKm).padStart(3, "0")} KM
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* DESKTOP ROUTE SVG (Visible on screens >= 640px)           */}
          {/* ======================================================== */}
          <div
            className={`hidden sm:block absolute inset-0 z-10 w-full h-full pointer-events-none transition-opacity duration-500 ${
              phase === "revealing" ? "opacity-0" : "opacity-100"
            }`}
          >
            <svg
              viewBox="0 0 1200 600"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <defs>
                <filter id="route-glow-desktop" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="headlight-glare" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Volumetric Dual Headlight Beam Gradient */}
                <linearGradient id="headlight-beam-main" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="15%" stopColor="#ffd332" stopOpacity="0.8" />
                  <stop offset="45%" stopColor="#ffd332" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ffd332" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Waypoint Coordinates */}
              <g>
                {/* Auckland Waypoint */}
                <g className="waypoint-auckland">
                  <circle cx="160" cy="450" r="4.5" fill="#ffd332" />
                  <text x="160" y="474" fill="#ffd332" fontSize="10" fontFamily="monospace" textAnchor="middle" letterSpacing="2" opacity="0.8">
                    AUCKLAND
                  </text>
                </g>

                {/* Tauranga Hub (Center) */}
                <g className="waypoint-tauranga">
                  <circle cx="600" cy="290" r="5.5" fill="#ffd332" />
                  <text x="600" y="260" fill="#ffd332" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle" letterSpacing="2.5">
                    TAURANGA · HUB
                  </text>
                </g>

                {/* Nationwide Waypoint */}
                <g className="waypoint-nationwide">
                  <circle cx="1040" cy="150" r="4.5" fill="#ffd332" />
                  <text x="1040" y="174" fill="#ffd332" fontSize="10" fontFamily="monospace" textAnchor="middle" letterSpacing="2" opacity="0.8">
                    NATIONWIDE
                  </text>
                </g>
              </g>

              {/* Highway Route Path */}
              <path
                id="moving-route-desktop"
                d="M -60,470 C 200,455 360,310 600,290 C 840,270 940,160 1260,140"
                fill="none"
                stroke="transparent"
              />

              {/* Ambient Glow Highway Trail */}
              <path
                d="M -60,470 C 200,455 360,310 600,290 C 840,270 940,160 1260,140"
                fill="none"
                stroke="#ffd332"
                strokeWidth="11"
                strokeLinecap="round"
                opacity="0.3"
                filter="url(#route-glow-desktop)"
                className="route-draw-glow"
              />

              {/* Sharp Yellow Highway Core Stroke */}
              <path
                d="M -60,470 C 200,455 360,310 600,290 C 840,270 940,160 1260,140"
                fill="none"
                stroke="#ffd332"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="route-draw-core"
              />

              {/* National Movers Truck (Desktop) — 100% hidden until 0.48s */}
              <g className="truck-wrapper">
                <animateMotion
                  dur="1.6s"
                  begin="0.55s"
                  fill="freeze"
                  rotate="auto"
                  calcMode="spline"
                  keySplines="0.3 0 0.2 1"
                  keyTimes="0; 1"
                >
                  <mpath href="#moving-route-desktop" />
                </animateMotion>

                {/* Truck Body and Headlights Group */}
                <g transform="translate(-24, -14) scale(0.92)">
                  {/* Volumetric Dual High-Beam Light Cones */}
                  <polygon
                    points="30,3 130,-14 130,22 30,11"
                    fill="url(#headlight-beam-main)"
                    className="headlight-cone"
                  />

                  {/* Ground Shadow */}
                  <ellipse cx="2" cy="16" rx="30" ry="4" fill="rgba(0,0,0,0.55)" filter="blur(1.5px)" />

                  {/* Speed Dust / Light Trail Behind Rear Tires */}
                  <g className="tire-trail">
                    <line x1="-30" y1="12" x2="-45" y2="12" stroke="#ffd332" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
                    <line x1="-30" y1="14" x2="-52" y2="14" stroke="#ffd332" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
                  </g>

                  {/* Main Cargo Box (Deep Navy #14212a with Yellow Frame) */}
                  <rect x="-26" y="-12" width="38" height="22" rx="2" fill="#14212a" stroke="#ffd332" strokeWidth="1.2" />
                  
                  {/* Brand Yellow Racing Stripe Across Side */}
                  <rect x="-26" y="-3" width="38" height="6.5" fill="#ffd332" />
                  
                  {/* Truck Logo Lettering */}
                  <text x="-7" y="1.8" fill="#14212a" fontSize="4.4" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.4">
                    NATIONAL MOVERS
                  </text>

                  {/* Truck Cabin (Brand Yellow) */}
                  <path d="M12 -6 L21 -6 L27 2 L27 10 L12 10 Z" fill="#ffd332" stroke="#d4ab1a" strokeWidth="0.8" />
                  
                  {/* Tinted Windshield */}
                  <path d="M14 -4 L20 -4 L24 2 L14 2 Z" fill="#14212a" opacity="0.88" />

                  {/* Glowing Xenon Headlight Bulb */}
                  <circle cx="26.5" cy="7" r="2" fill="#ffffff" filter="url(#headlight-glare)" />
                  <circle cx="26.5" cy="7" r="3.5" fill="#ffd332" opacity="0.75" />

                  {/* Chrome Bumper */}
                  <rect x="26" y="8" width="2.5" height="3" rx="0.5" fill="#cbd5e1" />

                  {/* Dual Rear Wheels */}
                  <g transform="translate(-16, 10)">
                    <circle cx="0" cy="0" r="5" fill="#0b1319" stroke="#ffd332" strokeWidth="1" />
                    <circle cx="0" cy="0" r="2.2" fill="#94a3b8" />
                  </g>
                  <g transform="translate(-6, 10)">
                    <circle cx="0" cy="0" r="5" fill="#0b1319" stroke="#ffd332" strokeWidth="1" />
                    <circle cx="0" cy="0" r="2.2" fill="#94a3b8" />
                  </g>

                  {/* Front Steering Wheel */}
                  <g transform="translate(19, 10)">
                    <circle cx="0" cy="0" r="5" fill="#0b1319" stroke="#ffd332" strokeWidth="1" />
                    <circle cx="0" cy="0" r="2.2" fill="#94a3b8" />
                  </g>
                </g>
              </g>
            </svg>
          </div>

          {/* ======================================================== */}
          {/* MOBILE ROUTE SVG (Visible on screens < 640px)             */}
          {/* ======================================================== */}
          <div
            className={`block sm:hidden absolute inset-0 z-10 w-full h-full pointer-events-none transition-opacity duration-500 ${
              phase === "revealing" ? "opacity-0" : "opacity-100"
            }`}
          >
            <svg
              viewBox="0 0 500 850"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <filter id="route-glow-mobile" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="headlight-beam-mobile" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="20%" stopColor="#ffd332" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#ffd332" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Mobile Waypoint Coordinates */}
              <g>
                <g className="waypoint-auckland">
                  <circle cx="90" cy="710" r="4.5" fill="#ffd332" />
                  <text x="90" y="734" fill="#ffd332" fontSize="10" fontFamily="monospace" textAnchor="middle" letterSpacing="1.5">
                    AUCKLAND
                  </text>
                </g>

                <g className="waypoint-tauranga">
                  <circle cx="250" cy="440" r="5.5" fill="#ffd332" />
                  <text x="250" y="416" fill="#ffd332" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle" letterSpacing="2">
                    TAURANGA · HUB
                  </text>
                </g>

                <g className="waypoint-nationwide">
                  <circle cx="410" cy="180" r="4.5" fill="#ffd332" />
                  <text x="410" y="204" fill="#ffd332" fontSize="10" fontFamily="monospace" textAnchor="middle" letterSpacing="1.5">
                    NATIONWIDE
                  </text>
                </g>
              </g>

              {/* Mobile Highway Route Path */}
              <path
                id="moving-route-mobile"
                d="M 40,760 C 130,680 180,560 250,440 C 320,320 370,230 460,140"
                fill="none"
                stroke="transparent"
              />

              {/* Ambient Glow Trail underneath */}
              <path
                d="M 40,760 C 130,680 180,560 250,440 C 320,320 370,230 460,140"
                fill="none"
                stroke="#ffd332"
                strokeWidth="9"
                strokeLinecap="round"
                opacity="0.3"
                filter="url(#route-glow-mobile)"
                className="route-draw-glow-mobile"
              />

              {/* Sharp Yellow Highway Core Stroke */}
              <path
                d="M 40,760 C 130,680 180,560 250,440 C 320,320 370,230 460,140"
                fill="none"
                stroke="#ffd332"
                strokeWidth="3.2"
                strokeLinecap="round"
                className="route-draw-core-mobile"
              />

              {/* National Movers Truck (Mobile) — 100% hidden until 0.48s */}
              <g className="truck-wrapper">
                <animateMotion
                  dur="1.6s"
                  begin="0.55s"
                  fill="freeze"
                  rotate="auto"
                  calcMode="spline"
                  keySplines="0.3 0 0.2 1"
                  keyTimes="0; 1"
                >
                  <mpath href="#moving-route-mobile" />
                </animateMotion>

                <g transform="translate(-20, -12) scale(0.8)">
                  <polygon
                    points="30,3 115,-12 115,20 30,10"
                    fill="url(#headlight-beam-mobile)"
                    className="headlight-cone"
                  />
                  <ellipse cx="2" cy="16" rx="28" ry="3.5" fill="rgba(0,0,0,0.55)" />

                  <rect x="-26" y="-12" width="38" height="22" rx="2" fill="#14212a" stroke="#ffd332" strokeWidth="1.2" />
                  <rect x="-26" y="-3" width="38" height="6.5" fill="#ffd332" />
                  <text x="-7" y="1.8" fill="#14212a" fontSize="4.4" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.4">
                    NATIONAL MOVERS
                  </text>

                  <path d="M12 -6 L21 -6 L27 2 L27 10 L12 10 Z" fill="#ffd332" stroke="#d4ab1a" strokeWidth="0.8" />
                  <path d="M14 -4 L20 -4 L24 2 L14 2 Z" fill="#14212a" opacity="0.88" />

                  <circle cx="26.5" cy="7" r="1.8" fill="#ffffff" />
                  <circle cx="26.5" cy="7" r="3.2" fill="#ffd332" opacity="0.7" />
                  <rect x="26" y="8" width="2.5" height="3" rx="0.5" fill="#cbd5e1" />

                  <g transform="translate(-16, 10)">
                    <circle cx="0" cy="0" r="4.8" fill="#0b1319" stroke="#ffd332" strokeWidth="1" />
                    <circle cx="0" cy="0" r="2" fill="#94a3b8" />
                  </g>
                  <g transform="translate(-6, 10)">
                    <circle cx="0" cy="0" r="4.8" fill="#0b1319" stroke="#ffd332" strokeWidth="1" />
                    <circle cx="0" cy="0" r="2" fill="#94a3b8" />
                  </g>
                  <g transform="translate(19, 10)">
                    <circle cx="0" cy="0" r="4.8" fill="#0b1319" stroke="#ffd332" strokeWidth="1" />
                    <circle cx="0" cy="0" r="2" fill="#94a3b8" />
                  </g>
                </g>
              </g>
            </svg>
          </div>

          {/* Phase 4: Brand Reveal at Tauranga Hub */}
          <div
            className={`relative z-20 flex flex-col items-center justify-center text-center px-4 transition-opacity duration-500 ${
              phase === "revealing" ? "opacity-0 scale-105" : "opacity-100"
            }`}
          >
            <div className="brand-reveal-content flex flex-col items-center">
              {/* Logo with Radial Backlight Aura */}
              <div className="relative mb-2 sm:mb-3 h-14 w-44 sm:h-20 sm:w-64">
                <Image
                  src={site.logo}
                  alt={site.name}
                  fill
                  priority
                  className="object-contain filter drop-shadow-[0_4px_28px_rgba(255,211,50,0.45)]"
                />
              </div>

              {/* Tagline Badge */}
              <div className="mt-1 flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.28em] text-white/95">
                <span className="h-px w-5 sm:w-7 bg-brand" />
                <span className="text-brand">The Journey Begins</span>
                <span className="h-px w-5 sm:w-7 bg-brand" />
              </div>
            </div>
          </div>

          {/* Bottom Satellite Telemetry Bar */}
          <div
            className={`absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-20 flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-wider text-white/40 transition-opacity duration-500 ${
              phase === "revealing" ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
              <span>LOGISTICS COORDINATION: NEW ZEALAND WIDE</span>
            </div>
            <div className="hidden sm:block">NATIONAL MOVERS · EST. 2025</div>
          </div>

          {/* Phase 5: The Expanding Yellow Route Panel / Morphing Transition Element */}
          <div
            className={`absolute inset-0 z-30 pointer-events-none transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
              phase === "revealing" ? "yellow-curtain-active" : "yellow-curtain-hidden"
            }`}
          >
            {/* Solid Brand Yellow Horizon Sweep */}
            <div className="h-full w-full bg-brand flex items-center justify-center shadow-2xl">
              <div className="flex items-center gap-3 text-navy font-black tracking-widest text-xs sm:text-sm uppercase opacity-40">
                <span className="h-2 w-2 rounded-full bg-navy" />
                <span>National Movers</span>
                <span className="h-2 w-2 rounded-full bg-navy" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS Choreography with Truck Ignition & Hub Shockwaves */}
      <style jsx global>{`
        /* Prevent scroll bar shift while splash is showing */
        body.intro-active {
          overflow: hidden;
        }

        /* Desktop: Route drawing stroke animation (0.25s - 1.60s) */
        .route-draw-core,
        .route-draw-glow {
          stroke-dasharray: 1400;
          stroke-dashoffset: 1400;
          animation: drawRouteDesktop 1.35s cubic-bezier(0.3, 0, 0.2, 1) 0.25s forwards;
        }

        @keyframes drawRouteDesktop {
          0% {
            stroke-dashoffset: 1400;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        /* Mobile: Route drawing stroke animation (0.25s - 1.60s) */
        .route-draw-core-mobile,
        .route-draw-glow-mobile {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawRouteMobile 1.35s cubic-bezier(0.3, 0, 0.2, 1) 0.25s forwards;
        }

        @keyframes drawRouteMobile {
          0% {
            stroke-dashoffset: 1000;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        /* ======================================================== */
        /* TRUCK IGNITION: 100% hidden until 0.48s, then headlights flash on */
        /* ======================================================== */
        .truck-wrapper {
          opacity: 0;
          animation: truckIgnite 0.22s ease-out 0.48s forwards;
        }

        @keyframes truckIgnite {
          0% {
            opacity: 0;
            transform: scale(0.6);
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Headlight High-Beam Flare Animation */
        .headlight-cone {
          opacity: 0;
          animation: headlightFlash 0.3s ease-out 0.55s forwards;
        }

        @keyframes headlightFlash {
          0% {
            opacity: 0;
            transform: scaleX(0.2);
          }
          40% {
            opacity: 0.95;
            transform: scaleX(1.15);
          }
          100% {
            opacity: 0.85;
            transform: scaleX(1);
          }
        }

        /* Phase 4: Brand reveal scaling & opacity (1.50s - 2.20s) */
        .brand-reveal-content {
          opacity: 0;
          transform: scale(0.92) translateY(10px);
          animation: revealBrand 0.65s cubic-bezier(0.16, 1, 0.3, 1) 1.50s forwards;
        }

        @keyframes revealBrand {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Phase 5: Expanding Yellow Horizon Curtain Wipe (2.25s - 3.00s) */
        .yellow-curtain-hidden {
          opacity: 0;
          transform: translateY(100%);
        }

        .yellow-curtain-active {
          animation: yellowWipeReveal 0.75s cubic-bezier(0.77, 0, 0.175, 1) forwards;
        }

        @keyframes yellowWipeReveal {
          0% {
            opacity: 1;
            transform: translateY(100%);
            clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%);
          }
          48% {
            opacity: 1;
            transform: translateY(0%);
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          }
          100% {
            opacity: 1;
            transform: translateY(-100%);
            clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
          }
        }

        /* Staggered Hero Elements Entrance Animation (2.50s - 3.10s) */
        .content-stagger-ready [data-hero-element="badge"] {
          opacity: 0;
          transform: translateY(14px);
          animation: heroFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 2.50s forwards;
        }

        .content-stagger-ready [data-hero-element="heading"] {
          opacity: 0;
          transform: translateY(18px);
          animation: heroFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 2.58s forwards;
        }

        .content-stagger-ready [data-hero-element="copy"] {
          opacity: 0;
          transform: translateY(16px);
          animation: heroFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 2.66s forwards;
        }

        .content-stagger-ready [data-hero-element="bullets"] {
          opacity: 0;
          transform: translateY(14px);
          animation: heroFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 2.74s forwards;
        }

        .content-stagger-ready [data-hero-element="actions"] {
          opacity: 0;
          transform: translateY(14px);
          animation: heroFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 2.82s forwards;
        }

        .content-stagger-ready [data-hero-element="quote-card"] {
          opacity: 0;
          transform: translateY(20px) scale(0.98);
          animation: heroCardUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 2.70s forwards;
        }

        @keyframes heroFadeUp {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroCardUp {
          0% {
            opacity: 0;
            transform: translateY(22px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .route-draw-core,
          .route-draw-glow,
          .route-draw-core-mobile,
          .route-draw-glow-mobile,
          .truck-wrapper,
          .headlight-cone,
          .brand-reveal-content,
          .yellow-curtain-active,
          .content-stagger-ready [data-hero-element] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
}

export { SplashTransition as PageIntro };
