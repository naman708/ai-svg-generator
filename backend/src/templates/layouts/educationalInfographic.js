import { renderIcon } from "../icons.js";
import { renderWrappedText, escapeXml } from "../../engine/textWrapper.js";
import { renderDefs, renderBackground } from "../components/baseDefs.js";
import { THEME_PALETTES } from "../../engine/colorUtils.js";

/**
 * 2. Educational Infographic Layout (800x1200 Portrait)
 * Structured concept breakdown with numbered step cards and detailed explanations.
 */
export function renderEducationalInfographic(data = {}) {
  const width = 800;
  const height = 1200;
  const palette = THEME_PALETTES[data.theme] || THEME_PALETTES["royal-indigo"];
  const id = "edu-" + (data.id || Math.random().toString(36).substring(2, 7));

  const badgeText = data.content?.badge || data.category || "EDUCATIONAL GUIDE";
  const title = data.content?.title || "Understanding Neural Networks";
  const subtitle = data.content?.subtitle || "Key architectural components powering modern artificial intelligence models.";
  
  const sections = data.content?.sections || [
    { title: "Input Perception Layer", description: "Standardizes high-dimensional raw tokens, embeddings, and feature tensors into uniform vectors.", icon: "layers" },
    { title: "Multi-Head Attention", description: "Dynamically calculates contextual relevance across long-range token sequences simultaneously.", icon: "brain" },
    { title: "Feedforward Activation", description: "Applies non-linear transformations and weighted projection layers to capture abstract representations.", icon: "cpu" },
    { title: "Output Normalization & Loss", description: "Computes probabilistic distributions and gradient descent updates to continually minimize prediction error.", icon: "target" }
  ];

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeXml(title)}">
  ${renderDefs(palette, id)}
  ${renderBackground(width, height, palette, id)}

  <!-- Header Section -->
  <g transform="translate(60, 60)">
    <!-- Pill Badge -->
    <rect x="0" y="0" width="${badgeText.length * 9 + 30}" height="30" rx="15" fill="${palette.primary}" fill-opacity="0.2" stroke="${palette.primary}" stroke-width="1.5" />
    <text x="15" y="20" fill="${palette.primary}" font-size="12" font-weight="700" font-family="Inter, sans-serif" letter-spacing="1.5">
      ${escapeXml(badgeText.toUpperCase())}
    </text>

    <!-- Main Title -->
    ${renderWrappedText({
      text: title,
      x: 0,
      y: 65,
      maxChars: 28,
      maxLines: 2,
      lineHeight: 44,
      fill: palette.text,
      fontSize: 36,
      fontWeight: "800"
    })}

    <!-- Subtitle -->
    ${renderWrappedText({
      text: subtitle,
      x: 0,
      y: 165,
      maxChars: 65,
      maxLines: 2,
      lineHeight: 24,
      fill: palette.textMuted,
      fontSize: 16,
      fontWeight: "400"
    })}
    
    <!-- Dividing Accent Line -->
    <line x1="0" y1="220" x2="680" y2="220" stroke="${palette.surfaceBorder}" stroke-width="1.5" stroke-dasharray="4 4" />
  </g>

  <!-- Educational Concept Cards (4 Stacked) -->
  <g transform="translate(60, 310)">
    ${sections.slice(0, 4).map((sec, idx) => {
      const cardY = idx * 195;
      const numStr = "0" + (idx + 1);
      const iconName = sec.icon || "book-open";

      return `
        <g transform="translate(0, ${cardY})">
          <!-- Card Container -->
          <rect x="0" y="0" width="680" height="170" rx="16" fill="url(#${id}-card-grad)" stroke="${palette.surfaceBorder}" stroke-width="1.5" filter="url(#${id}-shadow)" />
          
          <!-- Number Badge -->
          <rect x="25" y="25" width="48" height="48" rx="12" fill="${palette.primary}" />
          <text x="49" y="55" fill="#ffffff" font-size="20" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">
            ${numStr}
          </text>

          <!-- Card Header & Icon -->
          <text x="95" y="54" fill="${palette.text}" font-size="22" font-weight="700" font-family="Inter, sans-serif">
            ${escapeXml(sec.title || "Core Concept")}
          </text>
          ${renderIcon(iconName, 615, 30, 26, palette.accent || palette.primary, 2)}

          <!-- Card Body Description -->
          ${renderWrappedText({
            text: sec.description || "Detailed conceptual breakdown and functional analysis of the underlying principle.",
            x: 95,
            y: 95,
            maxChars: 52,
            maxLines: 3,
            lineHeight: 24,
            fill: palette.textMuted,
            fontSize: 15
          })}
        </g>
      `;
    }).join("")}
  </g>

  <!-- Footer Info -->
  <g transform="translate(60, 1130)">
    <line x1="0" y1="0" x2="680" y2="0" stroke="${palette.surfaceBorder}" stroke-width="1" />
    <text x="0" y="32" fill="${palette.textMuted}" font-size="13" font-family="Inter, sans-serif">
      AI-Powered Vector Infographic Engine • Generated Visual Guide
    </text>
    <text x="680" y="32" fill="${palette.primary}" font-size="13" font-weight="600" text-anchor="end" font-family="Inter, sans-serif">
      Open Standards • Production Ready
    </text>
  </g>
</svg>
  `.trim();
}
