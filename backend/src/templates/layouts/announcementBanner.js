import { renderIcon } from "../icons.js";
import { renderWrappedText, escapeXml } from "../../engine/textWrapper.js";
import { renderDefs, renderBackground } from "../components/baseDefs.js";
import { THEME_PALETTES } from "../../engine/colorUtils.js";

/**
 * 6. Announcement Banner Layout (1200x630 Landscape)
 * Product launches, major feature updates, conference keynotes.
 */
export function renderAnnouncementBanner(data = {}) {
  const width = 1200;
  const height = 630;
  const palette = THEME_PALETTES[data.theme] || THEME_PALETTES["crimson-energy"];
  const id = "announce-" + (data.id || Math.random().toString(36).substring(2, 7));

  const badgeText = data.content?.badge || "MAJOR RELEASE ANNOUNCEMENT";
  const dateTag = data.content?.date || "NOW AVAILABLE GLOBALLY";
  const title = data.content?.title || "Next-Generation Vector Graphics Engine";
  const description = data.content?.description || "Introducing autonomous layout composition, instantaneous SVG compilation, and automated accessibility verification.";
  
  const highlights = data.content?.highlights || [
    "Zero external bitmap dependencies",
    "Instant sub-second render pipeline",
    "WCAG AAA compliance certified"
  ];

  const badgeWidth = Math.max(120, badgeText.length * 10 + 28);
  const dateTagWidth = Math.max(120, dateTag.length * 10 + 28);

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeXml(title)}">
  ${renderDefs(palette, id)}
  ${renderBackground(width, height, palette, id)}

  <!-- Central Announcement Board -->
  <g transform="translate(80, 60)">
    <!-- Header Meta Row: Badge & Date Tag -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="${badgeWidth}" height="28" rx="6" fill="${palette.primary}" />
      <text x="${badgeWidth / 2}" y="19" fill="#ffffff" font-size="12" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif" letter-spacing="1">
        ${escapeXml(badgeText.toUpperCase())}
      </text>

      <rect x="${badgeWidth + 16}" y="0" width="${dateTagWidth}" height="28" rx="6" fill="${palette.surface}" stroke="${palette.surfaceBorder}" stroke-width="1" />
      <text x="${badgeWidth + 16 + dateTagWidth / 2}" y="19" fill="${palette.accent || palette.primary}" font-size="12" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif" letter-spacing="1">
        ${escapeXml(dateTag.toUpperCase())}
      </text>
    </g>

    <!-- Main Title -->
    <g transform="translate(0, 50)">
      ${renderWrappedText({
        text: title,
        x: 0,
        y: 40,
        maxChars: 34,
        maxLines: 2,
        lineHeight: 52,
        fill: palette.text,
        fontSize: 42,
        fontWeight: "900"
      })}
    </g>

    <!-- Description -->
    <g transform="translate(0, 160)">
      ${renderWrappedText({
        text: description,
        x: 0,
        y: 20,
        maxChars: 65,
        maxLines: 2,
        lineHeight: 26,
        fill: palette.textMuted,
        fontSize: 16
      })}
    </g>

    <!-- 3 Highlight Pills -->
    <g transform="translate(0, 240)">
      ${highlights.slice(0, 3).map((item, idx) => {
        const itemY = idx * 60;
        return `
          <g transform="translate(0, ${itemY})">
            <rect x="0" y="0" width="700" height="48" rx="12" fill="url(#${id}-card-grad)" stroke="${palette.surfaceBorder}" stroke-width="1" />
            <circle cx="28" cy="24" r="12" fill="${palette.primary}" fill-opacity="0.2" />
            ${renderIcon("check-circle", 18, 14, 20, palette.primary, 2)}
            ${renderWrappedText({
              text: item,
              x: 54,
              y: 29,
              maxChars: 66,
              maxLines: 1,
              lineHeight: 20,
              fill: palette.text,
              fontSize: 15,
              fontWeight: "600"
            })}
          </g>
        `;
      }).join("")}
    </g>
  </g>

  <!-- Right Visual Emblem Card -->
  <g transform="translate(850, 110)">
    <rect x="0" y="0" width="270" height="420" rx="20" fill="url(#${id}-card-grad)" stroke="${palette.surfaceBorder}" stroke-width="1.5" filter="url(#${id}-shadow)" />
    
    <!-- Central Icon Glow Motif -->
    <circle cx="135" cy="150" r="70" fill="${palette.primary}" fill-opacity="0.15" />
    <circle cx="135" cy="150" r="50" fill="${palette.primary}" fill-opacity="0.25" />
    ${renderIcon("rocket", 107, 122, 56, palette.primary, 2)}

    <text x="135" y="270" fill="${palette.text}" font-size="20" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">
      Official Release
    </text>
    <text x="135" y="300" fill="${palette.textMuted}" font-size="14" text-anchor="middle" font-family="Inter, sans-serif">
      Production Build Verified
    </text>

    <!-- Verification Pill -->
    <rect x="45" y="340" width="180" height="36" rx="18" fill="url(#${id}-primary-grad)" />
    <text x="135" y="363" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">
      EXPLORE NOW
    </text>
  </g>
</svg>
  `.trim();
}
