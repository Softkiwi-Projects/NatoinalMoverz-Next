import { site } from "@/data/site";
import "./splash.css";

/**
 * National Movers Entrance — "Night to New Day"
 *
 * Why it's built this way (fixes the "splash appears after the page" bug):
 *  - The overlay is SERVER-rendered into the static HTML and animated with pure CSS
 *    (a real stylesheet, not runtime styled-jsx), so it paints on the very first frame.
 *  - Whether it plays is decided by a tiny blocking script in <head> (INTRO_BOOT_SCRIPT,
 *    injected in app/layout.jsx) that adds `html.nm-intro` BEFORE the body is painted.
 *    No React state / useEffect → no flash of the homepage before the intro.
 *  - Without JS, or for returning visitors / reduced-motion users, the overlay stays display:none.
 *  - All scenery is inline SVG / data-URI, so nothing has to download before it can show.
 *
 * Choreography (≈3.5s):
 *  0.00s  Night sky fades in — twinkling stars, Bay of Plenty hills + Mauao, city skyline, street lamps
 *  0.10s  Truck drives in; parallax layers + road decelerate together (camera catches up), wheel dust
 *  0.45s  Shooting star
 *  0.95s  Brake — nose dip, brake lights, headlights flash, logo stamps onto the cargo box
 *  1.00s  Dawn breaks — sun rises behind the hills, sky warms, stars fade, street lamps flicker off
 *  1.05s  "NATIONAL MOVERS" rises letter by letter → 1.60s light glint sweeps across it
 *  0.15s  Auckland → Tauranga route loader fills → 1.60s map pin drops with a ripple
 *  1.80s  Truck launches off with wind lines + exhaust puff
 *  2.00s  Cut to the truck's rear cargo doors (split logo, lock rods, hazard stripe)
 *  2.20s  Golden light leaks through the door seam
 *  2.45s  Doors swing open in 3D, light floods out, hero content staggers in
 *  3.50s  Overlay is torn down
 */

const WORD_1 = "NATIONAL";
const WORD_2 = "MOVERS";

const svgUrl = (svg) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}")`;

// Far layer — rolling Bay of Plenty hills with Mauao (Mount Maunganui).
const HILLS = svgUrl(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 200'>
  <path fill='#172b3d' d='M0 140 C100 120 180 128 260 112 C340 96 420 118 500 108 C560 100 590 70 615 48 C635 30 660 26 685 32 C715 40 735 72 760 96 C800 120 880 100 960 112 C1040 124 1120 132 1200 140 V200 H0Z'/>
  <path fill='#122233' d='M0 168 C150 150 260 170 400 156 C540 142 640 166 780 158 C920 150 1060 170 1200 168 V200 H0Z'/>
</svg>`);

// Mid layer — city skyline with lit windows and a Sky Tower silhouette.
const SKYLINE = svgUrl(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 200'>
  <defs>
    <pattern id='a' width='12' height='16' patternUnits='userSpaceOnUse'><rect x='3' y='4' width='5' height='7' fill='#ffd332' opacity='.5'/></pattern>
    <pattern id='b' width='18' height='14' patternUnits='userSpaceOnUse'><rect x='4' y='4' width='9' height='5' fill='#ffe9a3' opacity='.35'/></pattern>
  </defs>
  <g fill='#0d1923'>
    <rect x='20' y='110' width='60' height='90'/>
    <rect x='90' y='70' width='48' height='130'/>
    <rect x='146' y='120' width='70' height='80'/>
    <rect x='230' y='40' width='40' height='160'/>
    <rect x='248' y='22' width='4' height='18'/>
    <rect x='280' y='96' width='64' height='104'/>
    <rect x='360' y='130' width='90' height='70'/>
    <rect x='426' y='40' width='8' height='160'/>
    <rect x='419' y='58' width='22' height='12' rx='4'/>
    <rect x='429' y='4' width='2' height='36'/>
    <rect x='466' y='60' width='54' height='140'/>
    <rect x='530' y='104' width='46' height='96'/>
    <rect x='590' y='82' width='72' height='118'/>
    <rect x='676' y='126' width='58' height='74'/>
    <rect x='748' y='50' width='44' height='150'/>
    <rect x='800' y='112' width='80' height='88'/>
    <rect x='0' y='186' width='900' height='14'/>
  </g>
  <rect x='26' y='120' width='48' height='66' fill='url(#b)'/>
  <rect x='96' y='80' width='36' height='106' fill='url(#a)'/>
  <rect x='236' y='50' width='28' height='136' fill='url(#a)'/>
  <rect x='286' y='106' width='52' height='80' fill='url(#b)'/>
  <rect x='472' y='70' width='42' height='116' fill='url(#a)'/>
  <rect x='596' y='92' width='60' height='94' fill='url(#b)'/>
  <rect x='754' y='60' width='32' height='126' fill='url(#a)'/>
  <rect x='806' y='122' width='68' height='64' fill='url(#b)'/>
</svg>`);

// Near layer — street lamps and hedges.
const LAMPS = svgUrl(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 700 300'>
  <g fill='#0a131b'>
    <rect x='346' y='70' width='8' height='230'/>
    <path d='M350 76 Q350 56 372 56 H404 V62 H372 Q356 62 356 76 Z'/>
    <rect x='396' y='57' width='26' height='9' rx='3'/>
    <path d='M0 272 C40 252 80 264 120 254 C160 244 200 260 240 256 C280 252 300 268 340 264 L340 300 H0Z'/>
    <path d='M360 268 C420 248 500 258 560 250 C610 244 660 262 700 272 V300 H360Z'/>
  </g>
  <rect x='400' y='65' width='18' height='3' rx='1.5' fill='#fff1b8'/>
</svg>`);

const LAMP_GLOW = svgUrl(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 700 300'>
  <defs>
    <radialGradient id='g'><stop offset='0' stop-color='#ffd332' stop-opacity='.6'/><stop offset='1' stop-color='#ffd332' stop-opacity='0'/></radialGradient>
    <linearGradient id='c' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#ffe9a3' stop-opacity='.32'/><stop offset='1' stop-color='#ffd332' stop-opacity='0'/></linearGradient>
  </defs>
  <path d='M400 66 L418 66 L480 300 L340 300 Z' fill='url(#c)'/>
  <circle cx='409' cy='66' r='48' fill='url(#g)'/>
</svg>`);

// Deterministic star field (same output on every build → no hydration concerns).
function starField(seed, count) {
  let s = seed;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  return Array.from({ length: count }, () => {
    const x = (rnd() * 100).toFixed(2);
    const y = (rnd() * 58).toFixed(2);
    const size = rnd() > 0.82 ? 1.2 : 0.4;
    const a = (0.45 + rnd() * 0.55).toFixed(2);
    return `${x}vw ${y}vh 0 ${size}px rgba(255,255,255,${a})`;
  }).join(",");
}
const STARS = [starField(7, 24), starField(31, 22), starField(97, 18)];

function Letters({ word, offset = 0 }) {
  return word.split("").map((ch, i) => (
    <span key={i} className="nm-letter" style={{ "--i": i + offset }}>
      {ch}
    </span>
  ));
}

function Wheel({ cx }) {
  return (
    <g transform={`translate(${cx} 162)`}>
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

function Door({ side }) {
  return (
    <div className={`nm-door nm-door-${side}`}>
      <div className="nm-door-decor">
        <span className="nm-door-rod" style={{ "--x": "22%" }} />
        <span className="nm-door-rod" style={{ "--x": "64%" }} />
        <span className="nm-door-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={site.logo} alt="" width="260" height="260" />
        </span>
        <span className="nm-door-handle" />
        <span className="nm-door-hazard" />
      </div>
    </div>
  );
}

export default function SplashTransition({ children }) {
  return (
    <>
      {/* Main page content — rendered natively for SEO & accessibility */}
      <div className="page-content-wrapper">{children}</div>

      {/* Splash overlay (hidden unless html.nm-intro is set by the head boot script) */}
      <div className="nm-splash" aria-hidden="true">
        {/* Rear cargo doors — the final reveal */}
        <Door side="left" />
        <Door side="right" />

        {/* Scene */}
        <div className="nm-scene">
          <div className="nm-sky">
            <div className="nm-stars">
              {STARS.map((shadow, i) => (
                <span key={i} className="nm-star-layer" style={{ boxShadow: shadow }} />
              ))}
            </div>
            <span className="nm-shoot" />
          </div>

          <div className="nm-streaks">
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} style={{ "--i": i }} />
            ))}
          </div>

          <div className="nm-stage">
            <div className="nm-roadscape">
              {/* Parallax world, anchored to the road line */}
              <div className="nm-world">
                <div className="nm-dawn" />
                <div className="nm-sun" />
                <div className="nm-layer nm-far" style={{ backgroundImage: HILLS }} />
                <div className="nm-layer nm-mid" style={{ backgroundImage: SKYLINE }} />
                <div className="nm-layer nm-glow" style={{ backgroundImage: LAMP_GLOW }} />
                <div className="nm-layer nm-near" style={{ backgroundImage: LAMPS }} />
              </div>
              <div className="nm-ground" />

              {/* Truck */}
              <div className="nm-truck-track">
                <div className="nm-truck">
                  <span className="nm-wind" style={{ "--y": "30%" }} />
                  <span className="nm-wind" style={{ "--y": "48%" }} />
                  <span className="nm-wind" style={{ "--y": "66%" }} />

                  <svg viewBox="0 0 400 200" className="nm-truck-svg" role="presentation">
                    <defs>
                      <linearGradient id="nm-beam" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stopColor="#fff7cc" stopOpacity="0.95" />
                        <stop offset="0.35" stopColor="#ffd332" stopOpacity="0.45" />
                        <stop offset="1" stopColor="#ffd332" stopOpacity="0" />
                      </linearGradient>
                      <radialGradient id="nm-brake-glow">
                        <stop offset="0" stopColor="#ff4d4d" stopOpacity="0.9" />
                        <stop offset="1" stopColor="#ff4d4d" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Headlight beam */}
                    <polygon className="nm-beam" points="372,118 560,78 560,170 372,132" fill="url(#nm-beam)" />

                    {/* Ground shadow */}
                    <ellipse cx="200" cy="188" rx="185" ry="7" fill="rgba(0,0,0,0.55)" />

                    {/* Wheel dust */}
                    {[0, 0.09, 0.18, 0.27].map((d, i) => (
                      <circle
                        key={i}
                        className="nm-dust"
                        cx={40 - i * 5}
                        cy={180 - (i % 2) * 5}
                        r={4 + i}
                        fill="#9aa7b4"
                        style={{ "--d": `${d}s` }}
                      />
                    ))}

                    <g className="nm-body">
                      {/* Cargo box */}
                      <rect x="8" y="22" width="262" height="128" rx="8" fill="#14212a" stroke="#ffd332" strokeWidth="3" />
                      <rect x="8" y="128" width="262" height="10" fill="#ffd332" />
                      <rect x="20" y="34" width="70" height="4" rx="2" fill="#ffd332" opacity="0.35" />
                      {/* Logo stamped on the side */}
                      <image href={site.logo} x="94" y="30" width="92" height="92" className="nm-logo-stamp" />

                      {/* Brake light */}
                      <circle className="nm-brake-glow" cx="6" cy="108" r="24" fill="url(#nm-brake-glow)" />
                      <rect className="nm-brake-light" x="3" y="98" width="7" height="20" rx="2" fill="#ff4d4d" />

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

            {/* Route loader */}
            <div className="nm-loader">
              <div className="nm-loader-bar">
                <span className="nm-loader-clip">
                  <span className="nm-loader-fill">
                    <span className="nm-loader-head" />
                  </span>
                </span>
                <span className="nm-pin">
                  <svg viewBox="0 0 24 32" role="presentation">
                    <path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.4 12 32 12 32s12-11.6 12-20.3C24 5.2 18.6 0 12 0z" fill="#ffd332" />
                    <circle cx="12" cy="11.5" r="4.5" fill="#14212a" />
                  </svg>
                </span>
                <span className="nm-pin-ripple" />
              </div>
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

        {/* Light leaking through the door seam, then flooding out as they open */}
        <div className="nm-burst">
          <span className="nm-burst-rays" />
          <span className="nm-burst-core" />
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
