import { renderIcon } from "../icons.js";
import { renderWrappedText, escapeXml } from "../../engine/textWrapper.js";
import { renderDefs, renderBackground } from "../components/baseDefs.js";
import { THEME_PALETTES } from "../../engine/colorUtils.js";

/**
 * 1. Promotional Banner Layout (1200x630 Landscape)
 * Ideal for product launches, marketing promotions, software highlights.
 * Strict boundary limits prevent ANY text overlap with the right bento card.
 */
export function renderPromotionalBanner(data = {}) {
  const width = 1200;
  const height = 630;
  const palette = THEME_PALETTES[data.theme] || THEME_PALETTES["modern-corporate"];
  const id = "promo-" + (data.id || Math.random().toString(36).substring(2, 7));

  const badgeText = data.content?.badge || data.category || "PROMOTION";
  const title = data.content?.title || "Unlock Next-Gen Potential";
  const subtitle = data.content?.subtitle || "Experience unprecedented performance and scalability today.";
  const ctaText = data.content?.cta || "Get Started Today";
  const features = data.content?.features || [
    { title: "Ultra Fast", description: "Engineered for maximum scale & reliability", icon: "zap" },
    { title: "Enterprise Grade", description: "Zero trust architecture and encryption", icon: "shield" },
    { title: "AI-Powered", description: "Powered by autonomous foundation models", icon: "sparkles" }
  ];

  // Dynamic calculations with strict safety boundaries
  const badgeWidth = Math.max(130, Math.min(320, badgeText.length * 10 + 36));
  const ctaBtnWidth = Math.max(210, Math.min(310, ctaText.length * 10.5 + 56));
  const ctaTextX = (ctaBtnWidth - 32) / 2;
  const ctaArrowX = ctaBtnWidth - 36;

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeXml(title)}">
  ${renderDefs(palette, id)}
  <defs>
    <!-- Hard Boundary ClipPath for Left Column to prevent any collision with right card -->
    <clipPath id="${id}-left-clip">
      <rect x="0" y="0" width="560" height="460" />
    </clipPath>
  </defs>
  ${renderBackground(width, height, palette, id)}

  <!-- Left Content Column with strict clipPath boundary -->
  <g transform="translate(80, 85)" clip-path="url(#${id}-left-clip)">
    <!-- Category Badge (Dynamic width with safe padding) -->
    <rect x="0" y="0" width="${badgeWidth}" height="32" rx="16" fill="${palette.primary}" fill-opacity="0.2" stroke="${palette.primary}" stroke-width="1.5" />
    <text x="18" y="21" fill="${palette.primary}" font-size="12" font-weight="700" font-family="Inter, sans-serif" letter-spacing="1.2">
      ${escapeXml(badgeText.toUpperCase())}
    </text>

    <!-- Main Headline (Tight maxChars: 19 guarantees zero collision with right card) -->
    ${renderWrappedText({
      text: title,
      x: 0,
      y: 72,
      maxChars: 19,
      maxLines: 3,
      lineHeight: 46,
      fill: palette.text,
      fontSize: 36,
      fontWeight: "800"
    })}

    <!-- Subtitle / Body Copy -->
    ${renderWrappedText({
      text: subtitle,
      x: 0,
      y: 220,
      maxChars: 38,
      maxLines: 3,
      lineHeight: 24,
      fill: palette.textMuted,
      fontSize: 15,
      fontWeight: "400"
    })}

    <!-- CTA Button (Dynamic width & calculated icon spacing) -->
    <g transform="translate(0, 325)" filter="url(#${id}-shadow)">
      <rect x="0" y="0" width="${ctaBtnWidth}" height="50" rx="25" fill="url(#${id}-primary-grad)" />
      <text x="${ctaTextX}" y="31" fill="#ffffff" font-size="15" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">
        ${escapeXml(ctaText)}
      </text>
      ${renderIcon("arrow-right", ctaArrowX, 15, 20, "#ffffff", 2.5)}
    </g>
  </g>

  <!-- Right Visual / Feature Cards Bento -->
  <g transform="translate(680, 105)">
    <!-- Big Decorative Backing Card -->
    <rect x="0" y="0" width="440" height="415" rx="20" fill="url(#${id}-card-grad)" stroke="${palette.surfaceBorder}" stroke-width="1.5" filter="url(#${id}-shadow)" />
    
    <!-- Feature items -->
    ${features.slice(0, 3).map((feat, idx) => {
      const yOffset = 24 + idx * 124;
      const featIcon = feat.icon || "star";
      return `
        <g transform="translate(25, ${yOffset})">
          <rect x="0" y="0" width="390" height="104" rx="14" fill="${palette.surface}" stroke="${palette.surfaceBorder}" stroke-width="1" />
          
          <!-- Icon Bubble -->
          <rect x="18" y="27" width="50" height="50" rx="12" fill="${palette.primary}" fill-opacity="0.15" />
          ${renderIcon(featIcon, 31, 40, 24, palette.primary, 2)}
          
          <!-- Feature Title -->
          <text x="82" y="38" fill="${palette.text}" font-size="16" font-weight="700" font-family="Inter, sans-serif">
            ${escapeXml(feat.title || "Feature")}
          </text>
          
          <!-- Feature Description (Wrapped dynamically to stay inside card) -->
          ${renderWrappedText({
            text: feat.description || feat.desc || "Optimized vector performance.",
            x: 82,
            y: 60,
            maxChars: 36,
            maxLines: 2,
            lineHeight: 18,
            fill: palette.textMuted,
            fontSize: 12
          })}
        </g>
      `;
    }).join("")}
  </g>
</svg>
  `.trim();
}
