// Presentation content for the restyled Service Template.
// Keyed by service slug. Anything missing falls back to sensible defaults
// in the template, so a new service renders even before it's curated here.

// Shared "Why Choose National Movers?" accordion (matches the original
// house-moving page: Affordability / Reliability / Experience / Local Touch / Peace of Mind).
export const WHY_CHOOSE = [
  { title: "Affordability", text: "We offer competitive rates, making us one of the most affordable house movers in Tauranga — clear, fixed quotes with no hidden fees on moving day." },
  { title: "Reliability", text: "Punctual, stress-free relocations every time. We turn up when we say we will and treat every deadline as a promise." },
  { title: "Experience", text: "Our team boasts years of experience in relocation services across Tauranga and all of New Zealand — there isn't much we haven't moved." },
  { title: "Local Touch", text: "As a Tauranga-based company, we know the streets, the access ways and the quickest routes to get your move done faster." },
  { title: "Peace of Mind", text: "Rest assured, your belongings are protected with comprehensive insurance options and police-vetted, professional crews." },
];

export const HOURS = [
  {
    icon: "clock",
    title: "Our Offices Are Open 7 Days a Week!",
    text: "Whether you're moving inside Tauranga or relocating to another city, our team of dedicated experts will make your journey smooth — your precious belongings carry zero damage while you rest easy.",
  },
  {
    icon: "truck",
    title: "We Operate 24×7!",
    text: "Whether your move is planned or a spur-of-the-moment decision, you can rely on National Movers to plan and handle your move without any delays or complications.",
  },
];

export const DEFAULT_STRIP =
  "Just leave everything to us, and we will make sure every single one of your invaluable belongings reaches its destination in pristine condition.";

export const serviceDetails = {
  "house-moving-service": {
    heroTitle: "House Moving Services Tauranga",
    heroSub: "Make moving simple with National Movers. Expert packing, safe transport, and reliable service for a stress-free experience.",
    features: [
      { icon: "check", title: "Efficient and Affordable", text: "We know everyone's budget is unique — our house moving service provides flexible, fair options." },
      { icon: "shield", title: "Security and Safety", text: "Our expert residential movers follow strict safety steps to keep furniture and valuables secure." },
      { icon: "clock", title: "Timely and Safe Delivery", text: "With our house movers Tauranga, items are picked up and delivered on time — no delays, no stresses." },
      { icon: "home", title: "Reliable Residential Moves", text: "Our residential movers Tauranga ensure smooth, stress-free relocations for every home." },
    ],
    rowsHeading: "Comprehensive Home Relocation Services in Tauranga",
    rows: [
      { title: "Expertise in Packing & Moving", image: "/wp-content/uploads/2023/10/img-01-1-1024x853.jpg", text: "Forget the anxiety of packing. Our experienced affordable house movers use high-quality materials to wrap and secure everything you own — from everyday essentials to full-service relocations, we provide peace of mind that your items will reach their new home safely." },
      { title: "Moving Across New Zealand with Precision", image: "/wp-content/uploads/2025/03/kitchen-move.jpg", text: "Relocating across Tauranga or nationwide? Our home movers company combines local knowledge with trained crews and modern trucks to ensure your household transportation is safe, precise and stress-free — however far you're going." },
      { title: "More Than Just Transportation", image: "/wp-content/uploads/2025/01/2149103441-1024x683.jpg", text: "Beyond the core elements of packing and transportation, we offer a range of additional services to ensure a seamless transition into your new home:", bullets: ["Furniture disassembly & assembly — our household movers Tauranga team takes care of bulky furniture at both ends", "Unpacking & debris removal — settle in faster with help sorting the aftermath", "Storage solutions — flexible options for safe, temporary storage during your move"] },
      { title: "Distance Should Not Worry You", image: "/wp-content/uploads/2025/01/long-distance-1024x683.jpg", text: "Whether it's two streets or two islands, the same care applies:", bullets: ["Short distance moves — moving locally doesn't mean it's a breeze; we bring the same care even just around the corner", "Cross-country relocation — carefully planned long-hauls with your belongings secured the entire way"] },
    ],
    adventure: {
      heading: "Your Tauranga Adventure Starts Today",
      text: "Don't let the moving process weigh you down. Contact National Movers today — request a quote online or call us, and our friendly team will make your transition completely stress-free.",
    },
    whyIntro: "There are countless moving companies in and around Tauranga, so for anyone to trust us with everything they own, we know we have to earn it — on the factors that matter most:",
    getStarted: {
      title: "Get in touch with National Movers for reliable house removal services today.",
      subtitle: "Request a quote online or call us to discuss your move. Let our friendly team make your transition stress-free.",
    },
  },

  "furniture-moving-service": {
    heroTitle: "Furniture Moving Services Tauranga",
    heroSub: "Sofas, beds, wardrobes, antiques — wrapped, lifted and delivered damage-free by trained furniture movers.",
    features: [
      { icon: "sofa", title: "Any Item, Any Size", text: "From a single armchair to a full house lot — no job is too big or too small." },
      { icon: "shield", title: "Wrapped & Protected", text: "Every piece is padded and wrapped before it moves an inch." },
      { icon: "box", title: "Assembly Included", text: "We disassemble bulky furniture and rebuild it at the other end." },
      { icon: "truck", title: "Right-Sized Trucks", text: "Clean, modern trucks fitted with tie rails and protective padding." },
    ],
    rowsHeading: "Complete Furniture Moving Services in Tauranga",
    rows: [
      { title: "Every Piece Wrapped & Protected", image: "/wp-content/uploads/2025/01/40330-1024x683.jpg", text: "Padded blankets, shrink wrap and corner protection go on before anything is lifted. Sofas, beds, dressers and tables travel strapped and cushioned so they arrive exactly as they left." },
      { title: "Disassembly & Reassembly Included", image: "/wp-content/uploads/2025/01/2149312723-1024x683.jpg", text: "Bulky beds, wardrobes and flat-pack furniture are taken apart by our crew, transported safely, and rebuilt in the right room at the other end — you don't lift a finger or lose a screw." },
      { title: "From a Single Item to a Full Home", image: "/wp-content/uploads/2025/01/66036-1024x683.jpg", text: "No job is too small or too big:", bullets: ["Single-item moves — a couch, fridge or table across town at a fair price", "Full house lots — every room packed, moved and placed", "Antiques & high-value pieces — extra padding and insurance options"] },
    ],
    getStarted: {
      title: "Get in touch with National Movers for reliable furniture moving services today.",
      subtitle: "Ready for a safe and stress-free move? Get a free quote and experience professional furniture removals Tauranga.",
    },
  },

  "kitchen-moving-service": {
    heroTitle: "Kitchen Moving Services Tauranga",
    heroSub: "Fridges, ovens, crockery and glassware — packed, moved and set up again without the breakages.",
    features: [
      { icon: "box", title: "Fragile-Item Experts", text: "Double-walled boxes, paper wrap and dividers keep glass and china intact." },
      { icon: "kitchen", title: "Appliance Handling", text: "Trolleys, straps and trained technique for fridges, ovens and washers." },
      { icon: "clipboard", title: "Labelled & Organised", text: "Every box labelled by cupboard so unpacking takes hours, not days." },
      { icon: "shield", title: "Zero-Breakage Focus", text: "Careful loading and padded transport built around fragile cargo." },
    ],
    rowsHeading: "Complete Kitchen Moving Services in Tauranga",
    rows: [
      { title: "Fragile Packing Done Right", image: "/wp-content/uploads/2025/01/2149312723-1024x683.jpg", text: "Glassware, crockery and china are packed in double-walled cartons with paper wrap and dividers — by people who do it every day. Your kitchen arrives ready to use, not ready to sweep up." },
      { title: "Heavy Appliances, Zero Drama", image: "/wp-content/uploads/2025/03/kitchen-move.jpg", text: "Fridges, ovens, dishwashers and washing machines are moved with appliance trolleys, lifting straps and trained technique — no scratched floors, no dented doors, and disconnect/reconnect coordination if you need it." },
      { title: "Unpacked & Set Up at the Other End", image: "/wp-content/uploads/2025/01/66036-1024x683.jpg", text: "We don't just drop boxes in a room:", bullets: ["Boxes labelled by cupboard so everything lands where it belongs", "Appliances positioned and ready to connect", "Optional unpacking service — kitchen working the same night"] },
    ],
    getStarted: {
      title: "Get in touch with National Movers for reliable kitchen moving services today.",
      subtitle: "Request a quote online or call us — our friendly team will make your kitchen move completely stress-free.",
    },
  },

  "office-relocation-service": {
    heroTitle: "Office Relocation Services Tauranga",
    heroSub: "Desks, IT and files relocated overnight or over the weekend — your team walks into a working office on Monday.",
    features: [
      { icon: "office", title: "Minimal Disruption", text: "Overnight and weekend relocations keep your business trading." },
      { icon: "box", title: "IT & Equipment Care", text: "Anti-static packing and padded crates for computers and electronics." },
      { icon: "clipboard", title: "Planned & Coordinated", text: "A move plan, timeline and dedicated coordinator for every office." },
      { icon: "shield", title: "Secure & Confidential", text: "Files and sensitive equipment transported securely, chain of custody intact." },
    ],
    rowsHeading: "Complete Office Relocation Services in Tauranga",
    rows: [
      { title: "Moves Planned Around Your Business", image: "/wp-content/uploads/2025/01/office-730681_1280.jpg", text: "A dedicated coordinator maps every desk, department and floor before a single box is packed. Your relocation runs on a written plan and a timeline built around your trading hours — overnight or over the weekend." },
      { title: "IT & Equipment Handled With Care", image: "/wp-content/uploads/2025/01/66036-1024x683.jpg", text: "Computers, servers and printers travel in anti-static packing and padded crates. We work in with your IT team on shutdown and setup so systems come back online without surprises." },
      { title: "Set Up and Working by Monday", image: "/wp-content/uploads/2025/09/WhatsApp-Image-2025-07-02-at-15.27.17-scaled.jpeg", text: "The goal is simple — zero lost trading hours:", bullets: ["Desks rebuilt and boxes delivered seat-by-seat", "Confidential files sealed and tracked door to door", "Old site left clean and handover-ready"] },
    ],
    getStarted: {
      title: "Get in touch with National Movers for a seamless office relocation today.",
      subtitle: "Request a quote online or call us — we'll plan your move around your business hours.",
    },
  },

  "piano-moving-service": {
    heroTitle: "Piano Moving Services Tauranga",
    heroSub: "Uprights to grands — moved with skids, ramps and padded wraps by a crew trained specifically for pianos.",
    features: [
      { icon: "piano", title: "Trained Piano Crew", text: "Specific lifting technique and equipment — not general labour guessing." },
      { icon: "shield", title: "Full Protection", text: "Thick padded wraps protect the case, keys, pedals and finish." },
      { icon: "home", title: "Stairs & Tight Access", text: "Skids, ramps and planned routes for difficult entries and exits." },
      { icon: "truck", title: "Nationwide Transport", text: "Secure, padded transport from Tauranga to anywhere in New Zealand." },
    ],
    rowsHeading: "Specialist Piano Moving Services in Tauranga",
    rows: [
      { title: "Specialist Equipment, Trained Crew", image: "/wp-content/uploads/2025/01/piano-e1752153923895.jpg", text: "Pianos aren't furniture — they're instruments. Our piano crew uses skids, ramps and heavy-duty padded wraps, with technique that protects the case, action and soundboard at every step." },
      { title: "Stairs & Tight Access Are Our Specialty", image: "/wp-content/uploads/2025/01/2149103441-1024x683.jpg", text: "Steep driveways, narrow hallways, internal stairs — we assess the route first, plan every turn, and bring the extra hands and gear the job needs. No guesswork, no gouged walls." },
      { title: "Long-Distance Piano Transport", image: "/wp-content/uploads/2025/01/long-distance-1024x683.jpg", text: "From Tauranga to anywhere in New Zealand:", bullets: ["Strapped upright in padded, climate-aware trucks", "Grand pianos partially disassembled and moved on their side, the proper way", "Placement and positioning in the new room, checked with you"] },
    ],
    getStarted: {
      title: "Get a free piano moving quote today!",
      subtitle: "Tell us about your piano and its access — we'll come back with a fixed, no-surprises price.",
    },
  },

  "two-men-and-a-van-tauranga": {
    heroTitle: "Two Men and a Van Tauranga",
    heroSub: "Flexible, affordable two men and a van service — perfect for small moves, single items, and long-distance runs.",
    features: [
      { icon: "clipboard", title: "Pre-Move Survey", text: "We assess your items and access first so the day runs to plan." },
      { icon: "box", title: "Flexible Packing", text: "Pack yourself or let us handle it — materials supplied either way." },
      { icon: "van", title: "Two Pros & a Clean Van", text: "A tidy, well-equipped van with two trained movers — no strangers off a marketplace." },
      { icon: "clock", title: "Prompt Service", text: "On time, efficient, and often same-week availability." },
    ],
    rowsHeading: "Two Men With a Van — Made Simple",
    rows: [
      { title: "What Is the Two Men With a Van Service?", image: "/wp-content/uploads/2025/01/40330-1024x683.jpg", text: "The affordable middle ground between DIY and a full moving crew: two trained movers, a fitted van, and all the padding and straps your items need. Ideal for flats, small homes, offices and single large items." },
      { title: "Protection on Every Job", image: "/wp-content/uploads/2025/01/2149312723-1024x683.jpg", text: "Blankets, shrink wrap and tie-downs come standard. Your items are loaded properly and secured for the drive — whether it's across Tauranga or across the island." },
      { title: "Special Requirements Welcome", image: "/wp-content/uploads/2025/01/66036-1024x683.jpg", text: "Tell us what's unusual about your move:", bullets: ["Awkward access, stairs or tight hallways", "Fragile, heavy or high-value single items", "Urgent and after-hours bookings where possible"] },
    ],
    getStarted: {
      title: "Planning to relocate? Let our two men with a van take the load.",
      subtitle: "Request a quote online or call us — flexible, affordable moving help is a message away.",
    },
  },
};

export function getServiceDetails(slug) {
  return serviceDetails[slug] || null;
}
