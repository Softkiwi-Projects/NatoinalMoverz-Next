import { site } from "@/data/site";
import "./splash.css";

/**
 * National Movers Entrance — "Doors Open"
 *
 * Why it's built this way (fixes the "splash appears after the page" bug):
 *  - The overlay is SERVER-rendered into the static HTML and animated with pure CSS
 *    (in a real stylesheet, not runtime styled-jsx), so it paints on the very first frame.
 *  - Whether it plays is decided by a tiny blocking script in <head> (see INTRO_BOOT_SCRIPT,
 *    injected in app/layout.jsx) that adds `html.nm-intro` BEFORE the body is painted.
 *    No React state / useEffect → no flash of the homepage before the intro.
 *  - Without JS, or for returning visitors / reduced-motion users, the overlay stays display:none.
 *
 * Choreography (≈3.2s):
 *  0.00s  Night stage, scrolling road & speed streaks fade in
 *  0.10s  Truck drives in from the left, wheels spinning, suspension bobbing
 *  0.95s  Truck brakes at centre (nose dip), headlights flare, loading bar runs
 *  1.05s  "NATIONAL MOVERS" wordmark rises letter by letter, tagline follows
 *  1.85s  Truck launches off to the right leaving speed lines
 *  2.25s  Scene fades; the two cargo doors swing open in 3D revealing the homepage
 *  2.45s  Hero content staggers in behind the doors
 */

const WORD_1 = "NATIONAL";
const WORD_2 = "MOVERS";

function Letters({ word, offset = 0 }) {
  return word.split("").map((ch, i) => (
    <span key={i} className="nm-letter" style={{ "--i": i + offset }}>
      {ch}
    </span>
  ));
}

function Wheel({ cx }) {
  return (
    <g className="nm-wheel" transform={`translate(${cx} 162)`}>
      <g className="nm-wheel-spin">
        <circle r="23" fill="#0b1319" />
        <circle r="23" fill="none" stroke="#ffd332" strokeWidth="2" />
        <circle r="11" fill="#94a3b8" />
        <circle r="4" fill="#0b1319" />
        <rect x="-1.5" y="-21" width="3" height="10" rx="1.5" fill="#ffd332" />
        <rect x="-1.5" y="11" width="3" height="10" rx="1.5" fill="#ffd332" />
        <rect x="-21" y="-1.5" width="10" height="3" rx="1.5" fill="#ffd332" />
        <rect x="11" y="-1.5" width="10" height="3" rx="1.5" fill="#ffd332" />
      </g>
    </g>
  );
}

export default function SplashTransition({ children }) {
  return (
    <>
      {/* Main page content — rendered natively for SEO & accessibility */}
      <div className="page-content-wrapper">{children}</div>

      {/* Splash overlay (hidden unless html.nm-intro is set by the head boot script) */}
      <div className="nm-splash" aria-hidden="true">
        {/* Cargo doors that swing open at the end */}
        <div className="nm-door nm-door-left">
          <span className="nm-door-handle" />
        </div>
        <div className="nm-door nm-door-right">
          <span className="nm-door-handle" />
        </div>

        {/* Scene */}
        <div className="nm-scene">
          <div className="nm-aura" />
          <div className="nm-streaks">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} style={{ "--i": i }} />
            ))}
          </div>

          <div className="nm-stage">
            {/* Truck */}
            <div className="nm-truck-track">
              <div className="nm-truck">
                <svg viewBox="0 0 400 200" className="nm-truck-svg" role="presentation">
                  <defs>
                    <linearGradient id="nm-beam" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#fff7cc" stopOpacity="0.95" />
                      <stop offset="0.35" stopColor="#ffd332" stopOpacity="0.45" />
                      <stop offset="1" stopColor="#ffd332" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Headlight beam */}
                  <polygon className="nm-beam" points="372,118 560,78 560,170 372,132" fill="url(#nm-beam)" />

                  {/* Ground shadow */}
                  <ellipse cx="200" cy="188" rx="185" ry="7" fill="rgba(0,0,0,0.55)" />

                  <g className="nm-body">
                    {/* Cargo box */}
                    <rect x="8" y="22" width="262" height="128" rx="8" fill="#14212a" stroke="#ffd332" strokeWidth="3" />
                    <rect x="8" y="128" width="262" height="10" fill="#ffd332" />
                    <rect x="20" y="34" width="70" height="4" rx="2" fill="#ffd332" opacity="0.35" />
                    {/* Logo stamped on the side */}
                    <image href={site.logo} x="94" y="30" width="92" height="92" className="nm-logo-stamp" />

                    {/* Cab */}
                    <path d="M274 56 H330 Q342 56 349 66 L376 104 Q382 112 382 122 V150 H274 Z" fill="#ffd332" stroke="#d4ab1a" strokeWidth="2" />
                    <path d="M288 68 H326 Q333 68 337 74 L356 102 H288 Z" fill="#14212a" opacity="0.9" />
                    <rect x="296" y="112" width="18" height="4" rx="2" fill="#14212a" opacity="0.6" />
                    {/* Headlight + bumper */}
                    <circle className="nm-headlight" cx="376" cy="125" r="5" fill="#fff" />
                    <rect x="370" y="140" width="16" height="10" rx="3" fill="#cbd5e1" />
                    {/* Exhaust puffs */}
                    <g className="nm-puffs">
                      <circle cx="0" cy="146" r="6" fill="#ffffff" opacity="0.25" />
                      <circle cx="-14" cy="140" r="8" fill="#ffffff" opacity="0.18" />
                      <circle cx="-30" cy="134" r="10" fill="#ffffff" opacity="0.1" />
                    </g>
                  </g>

                  <Wheel cx={68} />
                  <Wheel cx={128} />
                  <Wheel cx={330} />
                </svg>
              </div>
            </div>

            {/* Road */}
            <div className="nm-road">
              <div className="nm-road-dashes" />
            </div>

            {/* Wordmark */}
            <div className="nm-wordmark">
              <p className="nm-word">
                <span className="nm-word-a">
                  <Letters word={WORD_1} />
                </span>
                <span className="nm-word-b">
                  <Letters word={WORD_2} offset={WORD_1.length} />
                </span>
              </p>
              <p className="nm-tagline">
                <span className="nm-tag-line" />
                Moving New Zealand, One Home at a Time
                <span className="nm-tag-line" />
              </p>
            </div>

            {/* Loader */}
            <div className="nm-loader">
              <div className="nm-loader-bar" />
              <div className="nm-loader-meta">
                <span>Auckland</span>
                <span className="nm-loader-pct" />
                <span>Tauranga</span>
              </div>
            </div>
          </div>

          <button type="button" className="nm-skip" data-nm-skip tabIndex={-1}>
            Skip intro →
          </button>
        </div>

        {/* Invisible clock — its animationend tells the boot script the intro has finished */}
        <span className="nm-clock" />
      </div>
    </>
  );
}

/**
 * Blocking boot script, injected in <head>. Runs before first paint and decides whether
 * the intro plays. Also owns teardown (animationend / skip / Esc / safety timeout), so the
 * intro works identically before and after React hydrates.
 */
export const INTRO_BOOT_SCRIPT = `(function(){try{
var d=document.documentElement,p=location.pathname;
if(p!=="/"&&p!=="/index.html")return;
var force=/[?&](intro|replay)(=|&|$)/.test(location.search);
var seen=false;try{seen=sessionStorage.getItem("nm_intro_played")==="1"}catch(e){}
var rm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
if(!force&&(seen||rm))return;
try{sessionStorage.setItem("nm_intro_played","1")}catch(e){}
d.classList.add("nm-intro");
var done=false;
function end(){if(done)return;done=true;d.classList.remove("nm-intro");}
window.__nmEndIntro=end;
document.addEventListener("animationend",function(e){if(e.animationName==="nmClock")end();});
document.addEventListener("click",function(e){var t=e.target;if(t&&t.closest&&t.closest("[data-nm-skip]"))end();});
document.addEventListener("keydown",function(e){if(e.key==="Escape")end();});
setTimeout(end,8000);
}catch(e){}})();`;

export { SplashTransition as PageIntro };
