import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E85D4A",
          light: "#F4A698",
          dark: "#C94535",
          bg: "#FFF0ED",
        },

        bg: "#F5F5F7",
        surface: "#FFFFFF",
        "surface-hover": "#FAFAFA",

        border: "#E8E8ED",
        "border-light": "#F0F0F5",

        text: {
          primary: "#1A1A2E",
          secondary: "#6B7280",
          muted: "#9CA3AF",
        },

        success: "#22C55E",
        warning: "#EAB308",
        danger: "#EF4444",
        info: "#3B82F6",

        chart: {
          1: "#E85D4A",
          2: "#F4A698",
          3: "#FCD5CE",
          4: "#FFE8E0",
        },
      },

      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        full: "9999px",
      },

      boxShadow: {
        sm: "0 1px 3px rgba(0, 0, 0, 0.04)",
        md: "0 4px 12px rgba(0, 0, 0, 0.06)",
        lg: "0 8px 24px rgba(0, 0, 0, 0.08)",
      },

      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },

      fontSize: {
        xs: "clamp(10px, 2.5vw, 12px)",
        sm: "clamp(12px, 2.8vw, 14px)",
        base: "clamp(13px, 3vw, 16px)",
        lg: "clamp(16px, 3.5vw, 20px)",
        xl: "clamp(20px, 4vw, 28px)",
        "2xl": "clamp(24px, 5vw, 36px)",
      },

      spacing: {
        xs: "clamp(4px, 1vw, 6px)",
        sm: "clamp(8px, 1.5vw, 12px)",
        md: "clamp(12px, 2vw, 16px)",
        lg: "clamp(16px, 3vw, 24px)",
        xl: "clamp(20px, 4vw, 32px)",
      },

      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        slideUpMobile: {
          from: { opacity: "0", transform: "translateY(100%)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },

      animation: {
        fadeIn: "fadeIn 0.2s ease",
        slideUp: "slideUp 0.3s ease",
        slideUpMobile: "slideUpMobile 0.3s ease",
        slideInRight: "slideInRight 0.25s ease",
      },
    },
  },
  plugins: [],
};

export default config;