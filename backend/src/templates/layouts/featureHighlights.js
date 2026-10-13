import { renderIcon } from "../icons.js";
import { renderWrappedText, escapeXml } from "../../engine/textWrapper.js";
import { renderDefs, renderBackground } from "../components/baseDefs.js";
import { THEME_PALETTES } from "../../engine/colorUtils.js";

/**
 * 8. Feature Highlights (Bento Grid) Layout (1200x630 Landscape)
 * Asymmetric bento-grid layout: 1 hero feature card + 2 secondary stacked feature cards.
 */
export function renderFeatureHighlights(data = {}) {
  const width = 1200;
  const height = 630;
  const palette = THEME_PALETTES[data.theme] || THEME_PALETTES["emerald-eco"];
  const id = "feat-" + (data.id || Math.random().toString(36).substring(2, 7));

  const badgeText = data.content?.badge || data.category || "CAPABILITIES & HIGHLIGHTS";
  const title = data.content?.title || "Core Architecture Capabilities";
  
  const heroCard = data.content?.heroFeature || {
    title: "Autonomous Content Layouts",
    tag: "CORE ENGINE",
    desc: "Dynamically arranges complex vector structures, aligning typography, negative space, and visual weight according to human design guidelines.",
    icon: "sparkles"
  };

  const sideCards = data.content?.sideFeatures || [
    { title: "Pure Vector Output", desc: "Infinite resolution scalability with zero compression blur or artifacts.", icon: "layers" },
    { title: "Deterministic Validation", desc: "Integrated AST parsing, viewBox certification, and accessibility scoring.", icon: "shield" }
  ];

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeXml(title)}">
  ${renderDefs(palette, id)}
  ${renderBackground(width, height, palette, id)}

  <!-- Top Header -->
  <g transform="translate(80, 50)">
    <rect x="0" y="0" width="${badgeText.length * 9 + 30}" height="30" rx="15" fill="${palette.primary}" fill-opacity="0.2" stroke="${palette.primary}" stroke-width="1.5" />
    <text x="15" y="20" fill="${palette.primary}" font-size="12" font-weight="700" font-family="Inter, sans-serif" letter-spacing="1.5">
      ${escapeXml(badgeText.toUpperCase())}
    </text>

    ${renderWrappedText({
      text: title,
      x: 0,
      y: 65,
      maxChars: 40,
      maxLines: 1,
      lineHeight: 44,
      fill: palette.text,
      fontSize: 36,
      fontWeight: "800"
    })}
  </g>

  <!-- Left Hero Bento Card -->
  <g transform="translate(80, 160)">
    <rect x="0" y="0" width="500" height="410" rx="20" fill="url(#${id}-card-grad)" stroke="${palette.surfaceBorder}" stroke-width="1.5" filter="url(#${id}-shadow)" />
    
    <!-- Hero Icon Bubble -->
    <rect x="40" y="40" width="64" height="64" rx="16" fill="url(#${id}-primary-grad)" />
    ${renderIcon(heroCard.icon || "sparkles", 56, 56, 32, "#ffffff", 2.5)}

    <!-- Tag Pill -->
    <rect x="120" y="58" width="130" height="26" rx="13" fill="${palette.primary}" fill-opacity="0.15" />
    <text x="185" y="75" fill="${palette.primary}" font-size="11" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif" letter-spacing="1">
      ${escapeXml(heroCard.tag || "FEATURED")}
    </text>

    <!-- Hero Title -->
    <text x="40" y="160" fill="${palette.text}" font-size="28" font-weight="800" font-family="Inter, sans-serif">
      ${escapeXml(heroCard.title)}
    </text>

    <!-- Hero Body -->
    ${renderWrappedText({
      text: heroCard.desc,
      x: 40,
      y: 200,
      maxChars: 38,
      maxLines: 5,
      lineHeight: 28,
      fill: palette.textMuted,
      fontSize: 16
    })}

    <!-- Bottom Indicator -->
    <g transform="translate(40, 345)">
      <circle cx="6" cy="6" r="6" fill="${palette.accent || palette.primary}" />
      <text x="22" y="10" fill="${palette.text}" font-size="13" font-weight="600" font-family="Inter, sans-serif">
        Enterprise Standard Production Module
      </text>
    </g>
  </g>

  <!-- Right Stacked 2 Bento Cards -->
  <g transform="translate(610, 160)">
    ${sideCards.slice(0, 2).map((card, idx) => {
      const cardY = idx * 215;
      const iconName = card.icon || "cpu";

      return `
        <g transform="translate(0, ${cardY})">
          <rect x="0" y="0" width="510" height="195" rx="18" fill="url(#${id}-card-grad)" stroke="${palette.surfaceBorder}" stroke-width="1.5" filter="url(#${id}-shadow)" />
          
          <!-- Icon Bubble -->
          <rect x="30" y="30" width="48" height="48" rx="12" fill="${palette.primary}" fill-opacity="0.15" />
          ${renderIcon(iconName, 42, 42, 24, palette.primary, 2)}

          <!-- Title -->
          <text x="95" y="60" fill="${palette.text}" font-size="22" font-weight="700" font-family="Inter, sans-serif">
            ${escapeXml(card.title)}
          </text>

          <!-- Description -->
          ${renderWrappedText({
            text: card.desc,
            x: 30,
            y: 110,
            maxChars: 46,
            maxLines: 2,
            lineHeight: 24,
            fill: palette.textMuted,
            fontSize: 15
          })}
        </g>
      `;
    }).join("")}
  </g>
</svg>
  `.trim();
}
