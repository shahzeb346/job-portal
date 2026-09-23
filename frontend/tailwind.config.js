/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF9F6",
        "paper-dim": "#F4F1EE",
        ink: "#111827",
        "ink-soft": "#64748B",
        "ink-faint": "#94A3B8",
        line: "#E2E8F0",
        primary: "#4F46E5",
        "primary-dark": "#4338CA",
        accent: "#EEF2FF",
        "accent-soft": "#F5F3FF",
        salary: "#ECFDF5",
        "salary-border": "#A7F3D0",
        salaryText: "#047857",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06)",
        none: "none",
      },
    },
  },
  plugins: [],
};
