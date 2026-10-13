/**
 * Color palettes, gradients, and WCAG contrast calculation utilities.
 */

export const THEME_PALETTES = {
  "modern-corporate": {
    name: "Modern Corporate",
    background: "#0f172a",
    backgroundEnd: "#1e293b",
    surface: "#1e293b",
    surfaceBorder: "#334155",
    primary: "#3b82f6",
    secondary: "#60a5fa",
    accent: "#38bdf8",
    text: "#f8fafc",
    textMuted: "#94a3b8",
    cardBg: "rgba(30, 41, 59, 0.75)",
    tagBg: "#1d4ed8"
  },
  "cyberpunk-tech": {
    name: "Cyberpunk Tech",
    background: "#09090b",
    backgroundEnd: "#18181b",
    surface: "#18181b",
    surfaceBorder: "#27272a",
    primary: "#06b6d4",
    secondary: "#8b5cf6",
    accent: "#f43f5e",
    text: "#fafafa",
    textMuted: "#a1a1aa",
    cardBg: "rgba(24, 24, 27, 0.8)",
    tagBg: "#0e7490"
  },
  "emerald-eco": {
    name: "Emerald Sustainability",
    background: "#06281e",
    backgroundEnd: "#0b3d2e",
    surface: "#0e4a38",
    surfaceBorder: "#145a44",
    primary: "#10b981",
    secondary: "#34d399",
    accent: "#a7f3d0",
    text: "#f0fdf4",
    textMuted: "#a7f3d0",
    cardBg: "rgba(14, 74, 56, 0.75)",
    tagBg: "#047857"
  },
  "sunset-vibrant": {
    name: "Sunset Vibrant",
    background: "#1c102b",
    backgroundEnd: "#2e123d",
    surface: "#38174a",
    surfaceBorder: "#562270",
    primary: "#f97316",
    secondary: "#fb923c",
    accent: "#ec4899",
    text: "#ffffff",
    textMuted: "#fbcfe8",
    cardBg: "rgba(56, 23, 74, 0.8)",
    tagBg: "#c2410c"
  },
  "royal-indigo": {
    name: "Royal Indigo",
    background: "#0f172a",
    backgroundEnd: "#1e1b4b",
    surface: "#1e1b4b",
    surfaceBorder: "#312e81",
    primary: "#6366f1",
    secondary: "#818cf8",
    accent: "#c084fc",
    text: "#ffffff",
    textMuted: "#cbd5e1",
    cardBg: "rgba(30, 27, 75, 0.8)",
    tagBg: "#4338ca"
  },
  "clean-minimal-light": {
    name: "Clean Minimal Light",
    background: "#f8fafc",
    backgroundEnd: "#e2e8f0",
    surface: "#ffffff",
    surfaceBorder: "#cbd5e1",
    primary: "#2563eb",
    secondary: "#0284c7",
    accent: "#4f46e5",
    text: "#0f172a",
    textMuted: "#64748b",
    cardBg: "rgba(255, 255, 255, 0.95)",
    tagBg: "#dbeafe"
  },
  "crimson-energy": {
    name: "Crimson Energy",
    background: "#180c0e",
    backgroundEnd: "#2d1217",
    surface: "#3f141c",
    surfaceBorder: "#5b1d28",
    primary: "#ef4444",
    secondary: "#f87171",
    accent: "#fbbf24",
    text: "#ffffff",
    textMuted: "#fecaca",
    cardBg: "rgba(63, 20, 28, 0.8)",
    tagBg: "#b91c1c"
  },
  "amber-warmth": {
    name: "Warm Amber & Gold",
    background: "#1c1917",
    backgroundEnd: "#292524",
    surface: "#292524",
    surfaceBorder: "#44403c",
    primary: "#f59e0b",
    secondary: "#fbbf24",
    accent: "#fde68a",
    text: "#fafaf9",
    textMuted: "#d6d3d1",
    cardBg: "rgba(41, 37, 36, 0.85)",
    tagBg: "#b45309"
  }
};

/**
 * Returns luminance of a hex color (0 to 1).
 */
export function getLuminance(hex = "#000000") {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2) || "00", 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4) || "00", 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6) || "00", 16) / 255;

  const a = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Calculates WCAG contrast ratio between two hex colors.
 */
export function getContrastRatio(hex1, hex2) {
  try {
    const lum1 = getLuminance(hex1);
    const lum2 = getLuminance(hex2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  } catch {
    return 4.5;
  }
}
