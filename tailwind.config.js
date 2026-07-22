/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./data/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand tokens lifted from the original moversco theme CSS variables.
        brand: {
          DEFAULT: "#ffd332", // --skincolor
          light: "#ffdc39", // active link
          dark: "#14212a", // --skincolor-dark
        },
        ink: {
          DEFAULT: "#313437", // main menu / body headings
          soft: "#5b6167",
          strong: "#202020",
        },
        surface: {
          light: "#f2f2f2", // --skincolor-light
          muted: "#f7f7f7",
          border: "#ededed",
        },
        topbar: "#1b2024",
        // --themestek-moversco-dropmenu-active-link-custom-color
        dropdownActive: "#3368c6",
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
        heading: ["var(--font-nunito-sans)", "system-ui", "sans-serif"],
        menu: ["var(--font-biryani)", "var(--font-nunito-sans)", "sans-serif"],
        // --themestek-moversco-dropdownmenufont-family
        dropdown: ["Roboto", "Arial", "Helvetica", "sans-serif"],
      },
      maxWidth: {
        container: "1200px",
      },
      screens: {
        // --themestek-moversco-menu-breakpoint / --themestek-moversco-topbar-breakpoint
        hdr: "1200px",
      },
      boxShadow: {
        card: "0 12px 40px -12px rgba(20,33,42,0.18)",
        soft: "0 6px 24px -10px rgba(20,33,42,0.15)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
