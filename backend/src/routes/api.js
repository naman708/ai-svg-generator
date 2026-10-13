import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { LAYOUT_REGISTRY, renderSvgDesign } from "../engine/svgRenderer.js";
import { THEME_PALETTES } from "../engine/colorUtils.js";
import { generateDesignInstructions } from "../ai/aiService.js";
import { validateSvg, sanitizeSvg } from "../validator/svgValidator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUTS_DIR = path.resolve(__dirname, "../../outputs");

export const apiRouter = express.Router();

// Ensure output directories exist
if (!fs.existsSync(OUTPUTS_DIR)) {
  fs.mkdirSync(OUTPUTS_DIR, { recursive: true });
}

/**
 * GET /api/templates
 * Returns all available SVG layout templates and their specifications
 */
apiRouter.get("/templates", (req, res) => {
  const templates = Object.values(LAYOUT_REGISTRY).map(t => ({
    id: t.id,
    name: t.name,
    dimensions: t.dimensions,
    aspectRatio: t.aspectRatio
  }));
  res.json({ success: true, templates });
});

/**
 * GET /api/themes
 * Returns available color palettes and visual styles
 */
apiRouter.get("/themes", (req, res) => {
  const themes = Object.entries(THEME_PALETTES).map(([id, t]) => ({
    id,
    name: t.name,
    primary: t.primary,
    background: t.background,
    accent: t.accent
  }));
  res.json({ success: true, themes });
});

/**
 * POST /api/generate
 * Generates an AI-powered SVG banner/infographic from user inputs
 */
apiRouter.post("/generate", async (req, res) => {
  const startTime = Date.now();
  try {
    const { topic, category, template, style, tone, saveOutput = true } = req.body;

    if (!topic) {
      return res.status(400).json({ success: false, error: "Topic is required" });
    }

    // 1. Generate structured design instructions (AI / Synthesis)
    const designInstructions = await generateDesignInstructions({
      topic,
      category: category || "Technology and AI",
      template,
      style,
      tone
    });

    // 2. Render SVG via JavaScript template engine
    const rendered = renderSvgDesign(designInstructions);

    // 3. Sanitize and Validate SVG
    const sanitizedSvg = sanitizeSvg(rendered.svg);
    const validation = validateSvg(sanitizedSvg, { theme: designInstructions.theme });

    // 4. Optionally save to outputs folder
    let savedFilePath = null;
    let savedFileName = null;
    if (saveOutput) {
      const safeCategory = (designInstructions.category || "general").toLowerCase().replace(/[^a-z0-9]/g, "_");
      const categoryDir = path.join(OUTPUTS_DIR, safeCategory);
      if (!fs.existsSync(categoryDir)) fs.mkdirSync(categoryDir, { recursive: true });

      const timestamp = Date.now();
      savedFileName = `${designInstructions.template}_${timestamp}.svg`;
      savedFilePath = path.join(categoryDir, savedFileName);
      fs.writeFileSync(savedFilePath, sanitizedSvg, "utf8");
    }

    const durationMs = Date.now() - startTime;

    res.json({
      success: true,
      design: designInstructions,
      svg: sanitizedSvg,
      dimensions: rendered.dimensions,
      aspectRatio: rendered.aspectRatio,
      validation,
      savedFile: savedFileName ? `outputs/${(designInstructions.category || "general").toLowerCase().replace(/[^a-z0-9]/g, "_")}/${savedFileName}` : null,
      generationTimeMs: durationMs
    });
  } catch (err) {
    console.error("Generation error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/validate
 * Validates an SVG code payload against quality guidelines
 */
apiRouter.post("/validate", (req, res) => {
  const { svg, theme } = req.body;
  if (!svg) {
    return res.status(400).json({ success: false, error: "SVG content is required" });
  }
  const validation = validateSvg(svg, { theme });
  res.json({ success: true, validation });
});

/**
 * GET /api/designs
 * Lists all generated SVGs saved in the outputs repository
 */
apiRouter.get("/designs", (req, res) => {
  try {
    const results = [];

    function scanDir(dir, relativePath = "") {
      if (!fs.existsSync(dir)) return;
      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        if (item.isDirectory()) {
          scanDir(path.join(dir, item.name), path.join(relativePath, item.name));
        } else if (item.name.endsWith(".svg")) {
          const fullPath = path.join(dir, item.name);
          const stat = fs.statSync(fullPath);
          const relUrl = path.join(relativePath, item.name).replace(/\\/g, "/");
          results.push({
            name: item.name,
            path: relUrl,
            category: relativePath || "general",
            size: stat.size,
            createdAt: stat.mtime
          });
        }
      }
    }

    scanDir(OUTPUTS_DIR);
    res.json({ success: true, count: results.length, designs: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/designs/file/*
 * Serves a saved SVG file directly
 */
apiRouter.get("/designs/file/*", (req, res) => {
  const subPath = req.params[0];
  const fullPath = path.join(OUTPUTS_DIR, subPath);

  if (!fs.existsSync(fullPath)) {
    return res.status(404).send("SVG not found");
  }

  res.setHeader("Content-Type", "image/svg+xml");
  fs.createReadStream(fullPath).pipe(res);
});
