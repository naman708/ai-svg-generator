import { renderIcon } from "../icons.js";
import { renderWrappedText, escapeXml } from "../../engine/textWrapper.js";
import { renderDefs, renderBackground } from "../components/baseDefs.js";
import { THEME_PALETTES } from "../../engine/colorUtils.js";

/**
 * 9. List-Based Infographic Layout (800x1200 Portrait)
 * Comprehensive ordered list: Top 5 factors, core pillars, best practices.
 */
export function renderListBulletInfographic(data = {}) {
  const width = 800;
  const height = 1200;
  const palette = THEME_PALETTES[data.theme] || THEME_PALETTES["clean-minimal-light"];
  const id = "list-" + (data.id || Math.random().toString(36).substring(2, 7));

  const badgeText = data.content?.badge || data.category || "EXECUTIVE SUMMARY";
  const title = data.content?.title || "5 Pillars of Modern Engineering";
  const subtitle = data.content?.subtitle || "Core operational tenets required to build and sustain scalable cloud applications.";

  const items = data.content?.items || [
    { title: "Deterministic Validation", desc: "Enforce strict syntactic and schema contracts prior to output delivery.", icon: "shield" },
    { title: "Observability by Default", desc: "Real-time telemetry, structured audit logs, and anomaly detection.", icon: "activity" },
    { title: "Zero External Coupling", desc: "Self-contained vector primitives eliminating external font or image failures.", icon: "layers" },
    { title: "Continuous Benchmarking", desc: "Automated latency, memory footprint, and quality regression tests.", icon: "target" },
    { title: "Responsible AI Governance", desc: "Complete transparency of asset provenance, licensing, and clean metadata.", icon: "lock" }
  ];

  const badgeWidth = Math.max(140, badgeText.length * 11 + 32);

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeXml(title)}">
  ${renderDefs(palette, id)}
  ${renderBackground(width, height, palette, id)}

  <!-- Header Banner -->
  <g transform="translate(60, 60)">
    <rect x="0" y="0" width="${badgeWidth}" height="30" rx="15" fill="${palette.primary}" fill-opacity="0.15" stroke="${palette.primary}" stroke-width="1.5" />
    <text x="${badgeWidth / 2}" y="20" fill="${palette.primary}" font-size="12" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif" letter-spacing="1.2">
      ${escapeXml(badgeText.toUpperCase())}
    </text>

    <!-- Main Title -->
    ${renderWrappedText({
      text: title,
      x: 0,
      y: 65,
      maxChars: 30,
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
      fontSize: 16
    })}

    <line x1="0" y1="225" x2="680" y2="225" stroke="${palette.surfaceBorder}" stroke-width="1.5" stroke-dasharray="4 4" />
  </g>

  <!-- 5 Sequential List Cards -->
  <g transform="translate(60, 315)">
    ${items.slice(0, 5).map((item, idx) => {
      const cardY = idx * 155;
      const num = idx + 1;
      const iconName = item.icon || "check-circle";

      return `
        <g transform="translate(0, ${cardY})">
          <rect x="0" y="0" width="680" height="135" rx="16" fill="url(#${id}-card-grad)" stroke="${palette.surfaceBorder}" stroke-width="1.5" filter="url(#${id}-shadow)" />
          
          <!-- Number Box -->
          <rect x="24" y="24" width="46" height="46" rx="12" fill="${palette.primary}" />
          <text x="47" y="53" fill="#ffffff" font-size="20" font-weight="800" text-anchor="middle" font-family="Inter, sans-serif">
            ${num}
          </text>

          <!-- Row Content -->
          <g transform="translate(90, 24)">
            ${renderWrappedText({
              text: item.title,
              x: 0,
              y: 22,
              maxChars: 38,
              maxLines: 1,
              lineHeight: 24,
              fill: palette.text,
              fontSize: 19,
              fontWeight: "700"
            })}

            ${renderWrappedText({
              text: item.desc,
              x: 0,
              y: 54,
              maxChars: 52,
              maxLines: 2,
              lineHeight: 22,
              fill: palette.textMuted,
              fontSize: 14
            })}
          </g>

          <!-- Right Icon -->
          ${renderIcon(iconName, 620, 28, 24, palette.accent || palette.primary, 2)}
        </g>
      `;
    }).join("")}
  </g>

  <!-- Footer -->
  <g transform="translate(60, 1130)">
    <line x1="0" y1="0" x2="680" y2="0" stroke="${palette.surfaceBorder}" stroke-width="1" />
    <text x="0" y="32" fill="${palette.textMuted}" font-size="13" font-family="Inter, sans-serif">
      Synthesized Vector Framework • Shri Genesis AI Technical Assessment
    </text>
    <text x="680" y="32" fill="${palette.primary}" font-size="13" font-weight="600" text-anchor="end" font-family="Inter, sans-serif">
      100% Vector Scalable
    </text>
  </g>
</svg>
  `.trim();
}
