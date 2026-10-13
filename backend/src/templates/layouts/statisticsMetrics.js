import { renderIcon } from "../icons.js";
import { renderWrappedText, escapeXml } from "../../engine/textWrapper.js";
import { renderDefs, renderBackground } from "../components/baseDefs.js";
import { THEME_PALETTES } from "../../engine/colorUtils.js";

/**
 * 3. Statistics & Metrics Layout (1200x630 Landscape)
 * High-impact numerical KPI dashboards, reports, and growth summaries.
 */
export function renderStatisticsMetrics(data = {}) {
  const width = 1200;
  const height = 630;
  const palette = THEME_PALETTES[data.theme] || THEME_PALETTES["cyberpunk-tech"];
  const id = "stats-" + (data.id || Math.random().toString(36).substring(2, 7));

  const badgeText = data.content?.badge || data.category || "ANNUAL METRICS & BENCHMARKS";
  const title = data.content?.title || "Key Performance Indicators";
  const subtitle = data.content?.subtitle || "Measurable business outcomes, operational benchmarks, and systemic throughput.";

  const metrics = data.content?.metrics || [
    { value: "99.98%", label: "Uptime SLA", delta: "+0.4% QoQ", icon: "activity", desc: "Enterprise high-availability cluster resilience" },
    { value: "4.8x", label: "Throughput Multiplier", delta: "+380%", icon: "zap", desc: "Accelerated vector pipeline processing latency" },
    { value: "$42.5M", label: "Capital Saved", delta: "+64% YoY", icon: "dollar-sign", desc: "Cumulative automation infrastructure cost savings" }
  ];

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeXml(title)}">
  ${renderDefs(palette, id)}
  ${renderBackground(width, height, palette, id)}

  <!-- Header Banner -->
  <g transform="translate(80, 70)">
    <!-- Pill Badge -->
    <rect x="0" y="0" width="${badgeText.length * 9 + 30}" height="30" rx="15" fill="${palette.primary}" fill-opacity="0.2" stroke="${palette.primary}" stroke-width="1.5" />
    <text x="15" y="20" fill="${palette.primary}" font-size="12" font-weight="700" font-family="Inter, sans-serif" letter-spacing="1.5">
      ${escapeXml(badgeText.toUpperCase())}
    </text>

    <!-- Headline -->
    ${renderWrappedText({
      text: title,
      x: 0,
      y: 65,
      maxChars: 38,
      maxLines: 1,
      lineHeight: 46,
      fill: palette.text,
      fontSize: 40,
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

  <!-- 3 Metric Cards Grid -->
  <g transform="translate(80, 230)">
    ${metrics.slice(0, 3).map((m, idx) => {
      const cardX = idx * 360;
      const cardWidth = 320;
      const iconName = m.icon || "trending-up";

      return `
        <g transform="translate(${cardX}, 0)">
          <!-- Card Backdrop -->
          <rect x="0" y="0" width="${cardWidth}" height="320" rx="20" fill="url(#${id}-card-grad)" stroke="${palette.surfaceBorder}" stroke-width="1.5" filter="url(#${id}-shadow)" />
          
          <!-- Card Header: Icon & Delta Pill -->
          <g transform="translate(24, 24)">
            <rect x="0" y="0" width="46" height="46" rx="12" fill="${palette.primary}" fill-opacity="0.2" stroke="${palette.primary}" stroke-width="1" />
            ${renderIcon(iconName, 11, 11, 24, palette.primary, 2)}
            
            <!-- Delta Pill -->
            <rect x="180" y="6" width="90" height="28" rx="14" fill="${palette.accent || palette.primary}" fill-opacity="0.2" stroke="${palette.accent || palette.primary}" stroke-width="1" />
            <text x="225" y="24" fill="${palette.accent || palette.primary}" font-size="12" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">
              ${escapeXml(m.delta || "Verified")}
            </text>
          </g>

          <!-- Big Metric Value -->
          <text x="24" y="145" fill="${palette.text}" font-size="48" font-weight="900" font-family="Inter, sans-serif" letter-spacing="-1">
            ${escapeXml(m.value)}
          </text>

          <!-- Metric Label -->
          <text x="24" y="185" fill="${palette.primary}" font-size="18" font-weight="700" font-family="Inter, sans-serif">
            ${escapeXml(m.label)}
          </text>

          <!-- Divider Line -->
          <line x1="24" y1="210" x2="296" y2="210" stroke="${palette.surfaceBorder}" stroke-width="1" />

          <!-- Metric Description -->
          ${renderWrappedText({
            text: m.desc || "Verified operational metrics recorded under real-world workloads.",
            x: 24,
            y: 235,
            maxChars: 32,
            maxLines: 3,
            lineHeight: 20,
            fill: palette.textMuted,
            fontSize: 13
          })}

          <!-- Mini Vector Sparkline/Bar Visual -->
          <g transform="translate(24, 290)">
            <rect x="0" y="0" width="40" height="6" rx="3" fill="${palette.primary}" fill-opacity="0.3" />
            <rect x="50" y="0" width="55" height="6" rx="3" fill="${palette.primary}" fill-opacity="0.5" />
            <rect x="115" y="0" width="70" height="6" rx="3" fill="${palette.primary}" fill-opacity="0.7" />
            <rect x="195" y="0" width="80" height="6" rx="3" fill="${palette.accent || palette.primary}" />
          </g>
        </g>
      `;
    }).join("")}
  </g>
</svg>
  `.trim();
}
