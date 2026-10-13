import { renderIcon } from "../icons.js";
import { renderWrappedText, escapeXml } from "../../engine/textWrapper.js";
import { renderDefs, renderBackground } from "../components/baseDefs.js";
import { THEME_PALETTES } from "../../engine/colorUtils.js";

/**
 * 5. Quote & Thought Leadership Layout (1200x630 Landscape)
 * Executive statements, inspirational quotes, expert endorsements.
 */
export function renderQuoteThoughtLeadership(data = {}) {
  const width = 1200;
  const height = 630;
  const palette = THEME_PALETTES[data.theme] || THEME_PALETTES["amber-warmth"];
  const id = "quote-" + (data.id || Math.random().toString(36).substring(2, 7));

  const badgeText = data.content?.badge || data.category || "PERSPECTIVE & INSIGHT";
  const quote = data.content?.quote || "The future belongs to systems that combine deterministic engineering with adaptive generative intelligence.";
  const author = data.content?.author || "Elena Vance";
  const role = data.content?.role || "VP of Intelligent Systems, NextGen Labs";

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeXml(quote)}">
  ${renderDefs(palette, id)}
  ${renderBackground(width, height, palette, id)}

  <!-- Central Card -->
  <g transform="translate(100, 75)">
    <rect x="0" y="0" width="1000" height="480" rx="24" fill="url(#${id}-card-grad)" stroke="${palette.surfaceBorder}" stroke-width="1.5" filter="url(#${id}-shadow)" />

    <!-- Top Badge -->
    <g transform="translate(60, 50)">
      <rect x="0" y="0" width="${badgeText.length * 9 + 30}" height="30" rx="15" fill="${palette.primary}" fill-opacity="0.2" stroke="${palette.primary}" stroke-width="1.5" />
      <text x="15" y="20" fill="${palette.primary}" font-size="12" font-weight="700" font-family="Inter, sans-serif" letter-spacing="1.5">
        ${escapeXml(badgeText.toUpperCase())}
      </text>
    </g>

    <!-- Large Decorative Quote Glyph -->
    <g transform="translate(60, 110)">
      ${renderIcon("quote", 0, 0, 48, palette.primary, 2)}
    </g>

    <!-- Quote Body -->
    <g transform="translate(60, 180)">
      ${renderWrappedText({
        text: `“${quote}”`,
        x: 0,
        y: 20,
        maxChars: 44,
        maxLines: 4,
        lineHeight: 44,
        fill: palette.text,
        fontSize: 32,
        fontWeight: "600"
      })}
    </g>

    <!-- Author Profile Footer -->
    <g transform="translate(60, 390)">
      <!-- Avatar Circle with Initial -->
      <circle cx="28" cy="28" r="28" fill="${palette.primary}" />
      <text x="28" y="37" fill="#ffffff" font-size="22" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">
        ${escapeXml((author[0] || "A").toUpperCase())}
      </text>

      <!-- Author Name & Verified Badge -->
      <text x="75" y="24" fill="${palette.text}" font-size="20" font-weight="700" font-family="Inter, sans-serif">
        ${escapeXml(author)}
      </text>
      ${renderIcon("check-circle", author.length * 11 + 85, 8, 18, palette.accent || palette.primary, 2)}

      <!-- Role / Title -->
      <text x="75" y="46" fill="${palette.textMuted}" font-size="14" font-family="Inter, sans-serif">
        ${escapeXml(role)}
      </text>
    </g>
  </g>
</svg>
  `.trim();
}
