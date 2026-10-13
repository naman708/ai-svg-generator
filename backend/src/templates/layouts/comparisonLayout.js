import { renderIcon } from "../icons.js";
import { renderWrappedText, escapeXml } from "../../engine/textWrapper.js";
import { renderDefs, renderBackground } from "../components/baseDefs.js";
import { THEME_PALETTES } from "../../engine/colorUtils.js";

/**
 * 7. Comparison Layout (1200x630 Landscape)
 * Side-by-side dual evaluation: Traditional vs AI, Legacy vs Modern, Problem vs Solution.
 */
export function renderComparisonLayout(data = {}) {
  const width = 1200;
  const height = 630;
  const palette = THEME_PALETTES[data.theme] || THEME_PALETTES["modern-corporate"];
  const id = "comp-" + (data.id || Math.random().toString(36).substring(2, 7));

  const badgeText = data.content?.badge || data.category || "COMPARATIVE ANALYSIS";
  const title = data.content?.title || "Legacy Infrastructure vs. Autonomous Engine";
  
  const colA = data.content?.sideA || {
    title: "Manual Workflow",
    tag: "Legacy Approach",
    items: [
      "Slow multi-day design iteration cycles",
      "High human coordination overhead",
      "Inconsistent layout & spacing standards"
    ]
  };

  const colB = data.content?.sideB || {
    title: "AI Generation Engine",
    tag: "Modern Solution",
    items: [
      "Sub-second vector generation at scale",
      "Automated WCAG & syntax validation",
      "Standardized modular design tokens"
    ]
  };

  const badgeWidth = Math.max(140, badgeText.length * 11 + 32);

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeXml(title)}">
  ${renderDefs(palette, id)}
  ${renderBackground(width, height, palette, id)}

  <!-- Header -->
  <g transform="translate(80, 50)">
    <rect x="0" y="0" width="${badgeWidth}" height="30" rx="15" fill="${palette.primary}" fill-opacity="0.2" stroke="${palette.primary}" stroke-width="1.5" />
    <text x="${badgeWidth / 2}" y="20" fill="${palette.primary}" font-size="12" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif" letter-spacing="1.2">
      ${escapeXml(badgeText.toUpperCase())}
    </text>

    ${renderWrappedText({
      text: title,
      x: 0,
      y: 65,
      maxChars: 46,
      maxLines: 1,
      lineHeight: 44,
      fill: palette.text,
      fontSize: 36,
      fontWeight: "800"
    })}
  </g>

  <!-- Left Column: Legacy / Problem -->
  <g transform="translate(80, 170)">
    <rect x="0" y="0" width="480" height="400" rx="20" fill="url(#${id}-card-grad)" stroke="${palette.surfaceBorder}" stroke-width="1.5" filter="url(#${id}-shadow)" />
    
    <!-- Header inside Left Card -->
    <g transform="translate(35, 35)">
      <rect x="0" y="0" width="130" height="26" rx="6" fill="#ef4444" fill-opacity="0.2" stroke="#ef4444" stroke-width="1" />
      <text x="65" y="18" fill="#f87171" font-size="12" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">
        ${escapeXml(colA.tag || "BEFORE")}
      </text>

      ${renderWrappedText({
        text: colA.title,
        x: 0,
        y: 65,
        maxChars: 24,
        maxLines: 1,
        lineHeight: 28,
        fill: palette.text,
        fontSize: 24,
        fontWeight: "800"
      })}
    </g>

    <!-- Points List -->
    <g transform="translate(35, 140)">
      ${colA.items.slice(0, 3).map((item, idx) => {
        const itemY = idx * 75;
        return `
          <g transform="translate(0, ${itemY})">
            <circle cx="16" cy="16" r="16" fill="#ef4444" fill-opacity="0.15" />
            ${renderIcon("alert-circle", 6, 6, 20, "#ef4444", 2)}
            ${renderWrappedText({
              text: item,
              x: 48,
              y: 16,
              maxChars: 30,
              maxLines: 2,
              lineHeight: 22,
              fill: palette.textMuted,
              fontSize: 15
            })}
          </g>
        `;
      }).join("")}
    </g>
  </g>

  <!-- Central "VS" Badge -->
  <g transform="translate(580, 340)">
    <circle cx="20" cy="20" r="28" fill="${palette.background}" stroke="${palette.primary}" stroke-width="2" filter="url(#${id}-shadow)" />
    <text x="20" y="27" fill="${palette.text}" font-size="16" font-weight="900" text-anchor="middle" font-family="Inter, sans-serif">
      VS
    </text>
  </g>

  <!-- Right Column: AI / Modern -->
  <g transform="translate(640, 170)">
    <rect x="0" y="0" width="480" height="400" rx="20" fill="url(#${id}-card-grad)" stroke="${palette.primary}" stroke-width="2" filter="url(#${id}-shadow)" />
    
    <!-- Header inside Right Card -->
    <g transform="translate(35, 35)">
      <rect x="0" y="0" width="130" height="26" rx="6" fill="${palette.primary}" fill-opacity="0.2" stroke="${palette.primary}" stroke-width="1" />
      <text x="65" y="18" fill="${palette.primary}" font-size="12" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">
        ${escapeXml(colB.tag || "AFTER")}
      </text>

      ${renderWrappedText({
        text: colB.title,
        x: 0,
        y: 65,
        maxChars: 24,
        maxLines: 1,
        lineHeight: 28,
        fill: palette.text,
        fontSize: 24,
        fontWeight: "800"
      })}
    </g>

    <!-- Points List -->
    <g transform="translate(35, 140)">
      ${colB.items.slice(0, 3).map((item, idx) => {
        const itemY = idx * 75;
        return `
          <g transform="translate(0, ${itemY})">
            <circle cx="16" cy="16" r="16" fill="${palette.primary}" fill-opacity="0.2" />
            ${renderIcon("check-circle", 6, 6, 20, palette.primary, 2)}
            ${renderWrappedText({
              text: item,
              x: 48,
              y: 16,
              maxChars: 30,
              maxLines: 2,
              lineHeight: 22,
              fill: palette.text,
              fontSize: 15,
              fontWeight: "500"
            })}
          </g>
        `;
      }).join("")}
    </g>
  </g>
</svg>
  `.trim();
}
