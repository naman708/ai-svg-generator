import { renderIcon } from "../icons.js";
import { renderWrappedText, escapeXml } from "../../engine/textWrapper.js";
import { renderDefs, renderBackground } from "../components/baseDefs.js";
import { THEME_PALETTES } from "../../engine/colorUtils.js";

/**
 * 10. Social Square Graphic (1080x1080 Square)
 * Square format designed for LinkedIn, Twitter, and modern digital feeds.
 */
export function renderSocialSquareGraphic(data = {}) {
  const width = 1080;
  const height = 1080;
  const palette = THEME_PALETTES[data.theme] || THEME_PALETTES["royal-indigo"];
  const id = "social-" + (data.id || Math.random().toString(36).substring(2, 7));

  const badgeText = data.content?.badge || data.category || "TECH DISPATCH";
  const title = data.content?.title || "Architecting Vector Graphics with Generative AI";
  const subtitle = data.content?.subtitle || "How structured JSON contracts bridge the gap between creative LLMs and pixel-perfect vector execution.";
  
  const points = data.content?.points || [
    "Eliminate hallucinated SVG coordinate skewing",
    "Preserve strict WCAG contrast compliance",
    "Instantaneous rendering without Chromium overhead"
  ];

  const badgeWidth = Math.max(140, badgeText.length * 11 + 32);

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeXml(title)}">
  ${renderDefs(palette, id)}
  ${renderBackground(width, height, palette, id)}

  <!-- Central Canvas Card -->
  <g transform="translate(80, 80)">
    <rect x="0" y="0" width="920" height="920" rx="28" fill="url(#${id}-card-grad)" stroke="${palette.surfaceBorder}" stroke-width="2" filter="url(#${id}-shadow)" />

    <!-- Top Badge Row -->
    <g transform="translate(60, 60)">
      <rect x="0" y="0" width="${badgeWidth}" height="32" rx="16" fill="${palette.primary}" fill-opacity="0.2" stroke="${palette.primary}" stroke-width="1.5" />
      <text x="${badgeWidth / 2}" y="21" fill="${palette.primary}" font-size="12" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif" letter-spacing="1.2">
        ${escapeXml(badgeText.toUpperCase())}
      </text>
    </g>

    <!-- Main Title -->
    <g transform="translate(60, 120)">
      ${renderWrappedText({
        text: title,
        x: 0,
        y: 48,
        maxChars: 30,
        maxLines: 3,
        lineHeight: 54,
        fill: palette.text,
        fontSize: 44,
        fontWeight: "900"
      })}
    </g>

    <!-- Subtitle -->
    <g transform="translate(60, 310)">
      ${renderWrappedText({
        text: subtitle,
        x: 0,
        y: 20,
        maxChars: 54,
        maxLines: 3,
        lineHeight: 28,
        fill: palette.textMuted,
        fontSize: 18
      })}
    </g>

    <line x1="60" y1="410" x2="860" y2="410" stroke="${palette.surfaceBorder}" stroke-width="1.5" />

    <!-- 3 Core Points -->
    <g transform="translate(60, 440)">
      ${points.slice(0, 3).map((pt, idx) => {
        const ptY = idx * 95;
        return `
          <g transform="translate(0, ${ptY})">
            <rect x="0" y="0" width="800" height="74" rx="16" fill="${palette.surface}" stroke="${palette.surfaceBorder}" stroke-width="1" />
            <circle cx="36" cy="37" r="18" fill="${palette.primary}" fill-opacity="0.2" />
            ${renderIcon("check-circle", 26, 27, 20, palette.primary, 2)}
            
            ${renderWrappedText({
              text: pt,
              x: 72,
              y: 44,
              maxChars: 65,
              maxLines: 1,
              lineHeight: 22,
              fill: palette.text,
              fontSize: 16,
              fontWeight: "600"
            })}
          </g>
        `;
      }).join("")}
    </g>

    <!-- Footer Branding -->
    <g transform="translate(60, 770)">
      <rect x="0" y="0" width="800" height="80" rx="16" fill="url(#${id}-primary-grad)" fill-opacity="0.12" stroke="${palette.primary}" stroke-width="1" />
      
      <!-- Brand Icon & Text -->
      <circle cx="40" cy="40" r="20" fill="${palette.primary}" />
      ${renderIcon("sparkles", 30, 30, 20, "#ffffff", 2)}
      
      <text x="75" y="46" fill="${palette.text}" font-size="16" font-weight="700" font-family="Inter, sans-serif">
        AI-Powered SVG Generation Engine
      </text>

      <text x="770" y="46" fill="${palette.primary}" font-size="14" font-weight="700" text-anchor="end" font-family="Inter, sans-serif">
        GENAI-ASSESSMENT #2026
      </text>
    </g>
  </g>
</svg>
  `.trim();
}
