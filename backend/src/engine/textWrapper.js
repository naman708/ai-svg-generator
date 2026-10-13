/**
 * Text formatting, escaping and SVG text wrapping utilities.
 * Generates standard SVG <text> with <tspan> rows to prevent overflow and overlap.
 */

export function escapeXml(unsafe = "") {
  if (typeof unsafe !== "string") unsafe = String(unsafe || "");
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Splits text into lines respecting word boundaries and max character count.
 */
export function wrapText(text = "", maxCharsPerLine = 40) {
  if (!text) return [];
  const words = String(text).trim().split(/\s+/);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
    } else if ((currentLine + " " + word).length <= maxCharsPerLine) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Generates an SVG <text> block with <tspan> lines.
 * Strictly guarantees that no line exceeds `maxChars`.
 */
export function renderWrappedText({
  text = "",
  x = 0,
  y = 0,
  maxChars = 40,
  maxLines = 6,
  lineHeight = 24,
  fill = "#ffffff",
  fontSize = 16,
  fontWeight = "normal",
  textAnchor = "start",
  fontFamily = "Inter, system-ui, -apple-system, sans-serif",
  opacity = 1
}) {
  const lines = wrapText(text, maxChars);
  const displayLines = lines.slice(0, maxLines);
  
  if (lines.length > maxLines && displayLines.length > 0) {
    const lastIdx = displayLines.length - 1;
    let last = displayLines[lastIdx];
    if (last.length + 3 > maxChars) {
      last = last.slice(0, Math.max(1, maxChars - 3));
    }
    displayLines[lastIdx] = last.replace(/[\s\.\,]+$/, "") + "...";
  }

  const tspans = displayLines.map((line, index) => {
    const dy = index === 0 ? 0 : lineHeight;
    return `<tspan x="${x}" dy="${dy}">${escapeXml(line)}</tspan>`;
  }).join("");

  return `
    <text x="${x}" y="${y}" fill="${fill}" font-size="${fontSize}" font-weight="${fontWeight}" text-anchor="${textAnchor}" font-family="${fontFamily}" opacity="${opacity}">
      ${tspans}
    </text>
  `;
}
