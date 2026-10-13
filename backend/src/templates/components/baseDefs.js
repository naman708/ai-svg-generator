/**
 * Base SVG definitions, filters, gradients, and decorative background patterns.
 */

export function renderDefs(palette, idPrefix = "tmpl") {
  return `
    <defs>
      <!-- Base Background Linear Gradient -->
      <linearGradient id="${idPrefix}-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${palette.background}" />
        <stop offset="100%" stop-color="${palette.backgroundEnd || palette.background}" />
      </linearGradient>

      <!-- Primary Gradient for Accents and Cards -->
      <linearGradient id="${idPrefix}-primary-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${palette.primary}" />
        <stop offset="100%" stop-color="${palette.accent || palette.secondary}" />
      </linearGradient>

      <!-- Glass / Surface Card Gradient -->
      <linearGradient id="${idPrefix}-card-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${palette.surface}" stop-opacity="0.9" />
        <stop offset="100%" stop-color="${palette.surface}" stop-opacity="0.6" />
      </linearGradient>

      <!-- Modern Drop Shadow Filter -->
      <filter id="${idPrefix}-shadow" x="-10%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.35" />
      </filter>

      <!-- Subtle Glow Filter for Accents -->
      <filter id="${idPrefix}-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      <!-- Tech Dot Pattern -->
      <pattern id="${idPrefix}-dot-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.2" fill="${palette.primary}" fill-opacity="0.12" />
      </pattern>
    </defs>
  `;
}

/**
 * Renders decorative background accents (abstract glowing orbs, subtle grid, framing).
 */
export function renderBackground(width, height, palette, idPrefix = "tmpl", variant = "default") {
  return `
    <!-- Main Canvas Background -->
    <rect width="${width}" height="${height}" fill="url(#${idPrefix}-bg-grad)" />

    <!-- Ambient Grid Texture -->
    <rect width="${width}" height="${height}" fill="url(#${idPrefix}-dot-grid)" />

    <!-- Ambient Glow Orbs -->
    <g opacity="0.3">
      <circle cx="${width * 0.9}" cy="${height * 0.1}" r="${width * 0.25}" fill="${palette.primary}" filter="url(#${idPrefix}-glow)" />
      <circle cx="${width * 0.05}" cy="${height * 0.9}" r="${width * 0.2}" fill="${palette.accent || palette.secondary}" filter="url(#${idPrefix}-glow)" />
    </g>

    <!-- Border Accent Line -->
    <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="8" fill="none" stroke="${palette.surfaceBorder}" stroke-width="1" />
  `;
}
