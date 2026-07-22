// A small, dependency-free inline-SVG icon set used across the site.
const paths = {
  home: "M3 11.5 12 4l9 7.5M5 10v10h5v-6h4v6h5V10",
  office:
    "M3 21h18M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M15 21V9h4a1 1 0 0 1 1 1v11M8 8h2M8 12h2M8 16h2",
  van: "M3 6h11v9H3zM14 9h4l3 3v3h-7zM6.5 18a1.5 1.5 0 1 0 0-.01M17.5 18a1.5 1.5 0 1 0 0-.01",
  kitchen:
    "M6 3h12v18H6zM6 9h12M9 6h0M9 13v4",
  sofa: "M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M2 12a2 2 0 0 1 2 2v3h16v-3a2 2 0 0 1 2-2M5 17v2M19 17v2",
  piano:
    "M4 4h16v16H4zM4 12h16M8 4v6M12 4v6M16 4v6",
  phone:
    "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.6 9.8a16 16 0 0 0 6 6l1.4-1.5a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z",
  mail: "M4 4h16v16H4zM4 6l8 6 8-6",
  map: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11ZM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2",
  check: "M20 6 9 17l-5-5",
  arrow: "M5 12h14M13 6l6 6-6 6",
  star: "M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18.8 6.2 21l1.1-6.5L2.6 9.8l6.5-.9L12 3Z",
  quote:
    "M7 7h4v6H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2ZM15 7h4v6h-4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M6 6l12 12M18 6 6 18",
  chevron: "M6 9l6 6 6-6",
  shield: "M12 3l8 3v6c0 5-3.4 7.7-8 9-4.6-1.3-8-4-8-9V6l8-3Z",
  truck: "M3 6h13v10H3zM16 9h3l2 3v4h-5M7 18a1.5 1.5 0 1 0 0-.01M17 18a1.5 1.5 0 1 0 0-.01",
  box: "M3 7l9-4 9 4-9 4-9-4ZM3 7v10l9 4 9-4V7M12 11v10",
  clipboard:
    "M9 4h6v3H9zM7 5H5v16h14V5h-2M9 12h6M9 16h4",
  users: "M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM21 20v-1a4 4 0 0 0-3-3.9M16 4.1a4 4 0 0 1 0 7.8",
  facebook:
    "M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v6h3v-6h2l1-3h-3V8a1 1 0 0 1 1-1Z",
  x: "M4 4l16 16M20 4L4 20",
  instagram:
    "M4 4h16v16H4zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM17 6.5h0",
  linkedin:
    "M6 9v9M6 6v0M10 18v-5a2 2 0 0 1 4 0v5M14 18v-5a3 3 0 0 1 4 0v5",
};

export default function Icon({ name, className = "", size = 24, strokeWidth = 2, ...rest }) {
  const d = paths[name];
  if (!d) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {d.split("M").filter(Boolean).map((seg, i) => (
        <path key={i} d={"M" + seg} />
      ))}
    </svg>
  );
}
