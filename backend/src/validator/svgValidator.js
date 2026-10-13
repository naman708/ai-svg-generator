import { XMLValidator } from "fast-xml-parser";
import { getContrastRatio, THEME_PALETTES } from "../engine/colorUtils.js";

/**
 * Validates generated SVG files against assessment requirements (Sections 4 & 8):
 * - XML syntax correctness
 * - Valid viewBox & dimension attributes
 * - No forbidden AI prompts / script injections / suspicious tags
 * - Structural integrity and required design elements
 * - Contrast guidelines
 */
export function validateSvg(svgString, options = {}) {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    checks: {
      xmlSyntax: false,
      hasViewBox: false,
      hasDimensions: false,
      noForbiddenArtifacts: false,
      hasRequiredElements: false,
      cleanMetadata: false,
      contrastCompliance: true
    },
    metadata: {
      sizeBytes: Buffer.byteLength(svgString || "", "utf8"),
      nodeCount: 0
    }
  };

  if (!svgString || typeof svgString !== "string") {
    result.isValid = false;
    result.errors.push("Empty or non-string SVG payload provided");
    return result;
  }

  // 1. XML Syntax Validation
  const xmlCheck = XMLValidator.validate(svgString);
  if (xmlCheck === true) {
    result.checks.xmlSyntax = true;
  } else {
    result.isValid = false;
    result.errors.push(`XML Syntax Error: ${xmlCheck?.err?.msg || "Malformed XML structure"}`);
  }

  // 2. viewBox Check
  const viewBoxMatch = svgString.match(/viewBox=["']([0-9\s\.\,\-]+)["']/i);
  if (viewBoxMatch && viewBoxMatch[1]) {
    result.checks.hasViewBox = true;
    const parts = viewBoxMatch[1].trim().split(/\s+/);
    if (parts.length === 4) {
      result.metadata.viewBox = { minX: parts[0], minY: parts[1], width: parts[2], height: parts[3] };
    }
  } else {
    result.isValid = false;
    result.errors.push("Missing or invalid viewBox attribute in SVG root element");
  }

  // 3. Width & Height attributes
  const hasWidth = /width=["']\d+["']/i.test(svgString);
  const hasHeight = /height=["']\d+["']/i.test(svgString);
  if (hasWidth && hasHeight) {
    result.checks.hasDimensions = true;
  } else {
    result.warnings.push("Explicit width and height attributes recommended for reliable cross-browser scaling");
  }

  // 4. Forbidden AI Prompt artifacts / Security checks (Assessment 4.B)
  const forbiddenPatterns = [
    /<script\b/i,
    /javascript:/i,
    /onload=/i,
    /onerror=/i,
    /prompt:/i,
    /gpt-3/i,
    /gpt-4/i,
    /claude/i,
    /llm-instructions/i,
    /hidden\s*=\s*["']true["']/i
  ];

  let foundForbidden = false;
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(svgString)) {
      foundForbidden = true;
      result.isValid = false;
      result.errors.push(`Disallowed artifact or unsafe token detected matching: ${pattern.toString()}`);
    }
  }
  if (!foundForbidden) {
    result.checks.noForbiddenArtifacts = true;
    result.checks.cleanMetadata = true;
  }

  // 5. Check Required Graphic Elements
  const hasDefs = /<defs\b/i.test(svgString);
  const hasText = /<text\b/i.test(svgString);
  const hasShapes = /<(rect|circle|path|polygon)\b/i.test(svgString);

  if (hasText && hasShapes) {
    result.checks.hasRequiredElements = true;
  } else {
    result.isValid = false;
    result.errors.push("SVG lacks core visual elements (<text> and vector shape primitives)");
  }

  if (!hasDefs) {
    result.warnings.push("Reusable <defs> element not found; recommended for gradients and filters");
  }

  // 6. Contrast compliance estimation (if theme provided)
  if (options.theme && THEME_PALETTES[options.theme]) {
    const palette = THEME_PALETTES[options.theme];
    const ratio = getContrastRatio(palette.text, palette.background);
    if (ratio < 3.0) {
      result.warnings.push(`Low calculated contrast ratio (${ratio.toFixed(2)}:1) between text (${palette.text}) and background (${palette.background})`);
      result.checks.contrastCompliance = false;
    }
  }

  // Compute overall status
  result.status = result.isValid ? "passed" : "failed";
  return result;
}

/**
 * Sanitizes an SVG string to remove any trailing junk or comments.
 */
export function sanitizeSvg(svgString = "") {
  return svgString
    .replace(/<!--[\s\S]*?-->/g, (match) => {
      // Keep only short component annotations, strip excessive AI prompt blocks
      if (match.toLowerCase().includes("prompt") || match.toLowerCase().includes("model")) {
        return "";
      }
      return match;
    })
    .trim();
}
