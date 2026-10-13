import { renderIcon } from "../icons.js";
import { renderWrappedText, escapeXml } from "../../engine/textWrapper.js";
import { renderDefs, renderBackground } from "../components/baseDefs.js";
import { THEME_PALETTES } from "../../engine/colorUtils.js";

/**
 * 4. Step-by-Step Roadmap Layout (1200x630 Landscape)
 * 4-stage sequential workflow with connecting vector paths and chronological stages.
 */
export function renderStepByStepRoadmap(data = {}) {
  const width = 1200;
  const height = 630;
  const palette = THEME_PALETTES[data.theme] || THEME_PALETTES["sunset-vibrant"];
  const id = "steps-" + (data.id || Math.random().toString(36).substring(2, 7));

  const badgeText = data.content?.badge || data.category || "PROCESS WORKFLOW";
  const title = data.content?.title || "Strategic Implementation Roadmap";
  const subtitle = data.content?.subtitle || "Step-by-step framework to transition from conceptualization to global production.";

  const steps = data.content?.steps || [
    { number: "01", title: "Discovery", desc: "Data gathering, audit, and requirement scoping.", icon: "search" },
    { number: "02", title: "Architecture", desc: "Vector pipeline & system integration blueprints.", icon: "layers" },
    { number: "03", title: "Validation", desc: "Quality benchmarking and automated regression testing.", icon: "check-circle" },
    { number: "04", title: "Scale", desc: "Autonomous execution and multi-region deployment.", icon: "rocket" }
  ];

  const badgeWidth = Math.max(140, badgeText.length * 11 + 32);

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeXml(title)}">
  ${renderDefs(palette, id)}
  ${renderBackground(width, height, palette, id)}

  <!-- Header Section -->
  <g transform="translate(80, 65)">
    <rect x="0" y="0" width="${badgeWidth}" height="30" rx="15" fill="${palette.primary}" fill-opacity="0.2" stroke="${palette.primary}" stroke-width="1.5" />
    <text x="${badgeWidth / 2}" y="20" fill="${palette.primary}" font-size="12" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif" letter-spacing="1.2">
      ${escapeXml(badgeText.toUpperCase())}
    </text>

    <!-- Main Title -->
    ${renderWrappedText({
      text: title,
      x: 0,
      y: 65,
      maxChars: 38,
      maxLines: 1,
      lineHeight: 44,
      fill: palette.text,
      fontSize: 38,
      fontWeight: "800"
    })}

    <!-- Subtitle -->
    ${renderWrappedText({
      text: subtitle,
      x: 0,
      y: 110,
      maxChars: 80,
      maxLines: 2,
      lineHeight: 24,
      fill: palette.textMuted,
      fontSize: 16
    })}
  </g>

  <!-- Horizontal Connector Line between Nodes -->
  <line x1="180" y1="260" x2="1020" y2="260" stroke="${palette.primary}" stroke-width="3" stroke-dasharray="6 6" opacity="0.6" />

  <!-- 4 Step Cards -->
  <g transform="translate(80, 210)">
    ${steps.slice(0, 4).map((step, idx) => {
      const stepX = idx * 265;
      const numStr = step.number || ("0" + (idx + 1));
      const iconName = step.icon || "sparkles";

      return `
        <g transform="translate(${stepX}, 0)">
          <!-- Circular Node Pin on the connecting line -->
          <circle cx="115" cy="50" r="28" fill="${palette.background}" stroke="${palette.primary}" stroke-width="3" filter="url(#${id}-shadow)" />
          <text x="115" y="56" fill="${palette.primary}" font-size="15" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">
            ${numStr}
          </text>

          <!-- Step Card Container below the node -->
          <g transform="translate(0, 100)">
            <rect x="0" y="0" width="230" height="220" rx="16" fill="url(#${id}-card-grad)" stroke="${palette.surfaceBorder}" stroke-width="1.5" filter="url(#${id}-shadow)" />
            
            <!-- Icon Wrapper -->
            <rect x="20" y="20" width="44" height="44" rx="10" fill="${palette.primary}" fill-opacity="0.15" />
            ${renderIcon(iconName, 30, 30, 24, palette.primary, 2)}

            <!-- Step Title (Safely bounded) -->
            ${renderWrappedText({
              text: step.title || "Step Phase",
              x: 20,
              y: 95,
              maxChars: 18,
              maxLines: 1,
              lineHeight: 22,
              fill: palette.text,
              fontSize: 18,
              fontWeight: "700"
            })}

            <!-- Step Description -->
            ${renderWrappedText({
              text: step.desc || step.description || "Detailed workflow step explanation and milestones.",
              x: 20,
              y: 125,
              maxChars: 22,
              maxLines: 4,
              lineHeight: 22,
              fill: palette.textMuted,
              fontSize: 13
            })}
          </g>
        </g>
      `;
    }).join("")}
  </g>
</svg>
  `.trim();
}
