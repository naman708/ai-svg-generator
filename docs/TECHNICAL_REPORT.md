# Technical Report: AI-Powered SVG Banner & Infographic Generation Engine

**Candidate / Author:** Gen AI Technical Assessment Candidate  
**Assessment:** AI-Powered SVG Banner & Infographic Generation Engine  
**Organization:** Shri Genesis Software Solutions  
**Date:** October 2026  

---

## 1. Solution Overview

The **AI-Powered SVG Banner & Infographic Generation Engine** is an automated, production-grade vector design generation platform. It programmatically transforms high-level topics, categories, and content briefs into publication-ready, scalable vector graphics (SVG) without human manual design intervention.

Rather than prompting Large Language Models (LLMs) to generate raw, unconstrained SVG XML strings—an approach that frequently produces malformed coordinates, text overlaps, clipped viewports, and non-deterministic visual quality—this engine employs a **two-tiered architectural pattern**:
1. **Generative AI as the Creative Director**: Interprets topic context, determines content hierarchy, drafts impactful copy (headlines, subtitles, data points), selects thematic color palettes, and specifies a tailored layout template.
2. **Deterministic JavaScript Vector Engine**: Compiles the structured design parameters into mathematically sound, 100% compliant, and beautifully rendered SVG markup using reusable templates, vector primitives, and open-source vector icon paths.

The system includes an **Automated Batch Generator** that successfully produced **100 distinct, high-quality SVG banners and infographics** across 10 industry categories and 10 layout topologies, complete with automated AST validation, responsive viewBox certification, and metadata cleaning.

---

## 2. Technology Stack

- **Backend Runtime:** Node.js (v20.x) with Express.js REST API.
- **Generative AI:** OpenAI API (`gpt-4o-mini`, `gpt-4o`) with JSON schema enforcement; decoupled fallback synthesis engine for zero-dependency offline reproducibility.
- **Template & Rendering Engine:** Custom modular JavaScript Vector Template Engine with dynamic line-wrapping and WCAG contrast calculators.
- **Validation & Sanitization:** `fast-xml-parser` for real-time Abstract Syntax Tree (AST) XML validation; custom regex security sanitizers for removing AI prompt leakage or unsafe attributes.
- **Frontend:** React 18 with Vite, CSS3 custom properties (modern dark-mode design system), and Lucide icons.
- **Vector Assets:** 100% open-source, MIT-licensed Lucide & Feather vector path primitives embedded inline.

---

## 3. AI Models, APIs, and Prompting Approach

### 3.1 LLM Integration Architecture
The system supports direct integration with OpenAI's API through the official SDK, utilizing strict JSON response formatting (`response_format: { type: "json_object" }`). If an API key is not configured or network access is restricted, the engine automatically delegates to an internal **Intelligent Domain-Aware Content Synthesizer**, ensuring 100% operational reliability.

### 3.2 Prompting Strategy & Structured Schema Contract
The prompt establishes a strict contract separating content semantics from low-level geometry. The AI is guided by a system prompt that specifies:
- The 10 available layout templates and their functional affordances.
- The 8 available harmonious color palettes.
- The curated catalog of available vector icon tags (`cpu`, `shield`, `zap`, `activity`, etc.).
- Strict constraints against hallucinating unsupported layout schemas.

The output JSON follows a deterministic interface:
```json
{
  "category": "Technology and AI",
  "topic": "Autonomous AI Agent Swarms",
  "template": "promotional_banner",
  "theme": "cyberpunk-tech",
  "content": {
    "badge": "AI ARCHITECTURE",
    "title": "Autonomous Agent Swarms",
    "subtitle": "Multi-agent collaborative networks orchestrating operations.",
    "cta": "Explore Swarms",
    "features": [
      { "title": "Self-Reflection", "description": "Iterative plan critique", "icon": "brain" }
    ]
  }
}
```

---

## 4. Template & Layout Generation Approach

To prevent repetitive, identical compositions where only colors or text change, the engine implements **10 structurally distinct vector layouts**:

1. **Promotional Banner (`promotional_banner`, 1200x630):** Hero layout with a high-contrast badge, 48px display typography, primary call-to-action button, and a right-hand bento feature card cluster.
2. **Educational Infographic (`educational_infographic`, 800x1200):** Vertical conceptual guide with 4 stacked, numbered cards featuring icon badges and detailed explanations.
3. **Statistics & Metrics (`statistics_metrics`, 1200x630):** High-impact KPI dashboard showcasing 3 numerical metrics, delta pills (+380%, +15%), and vector sparklines.
4. **Step-by-Step Roadmap (`step_by_step_roadmap`, 1200x630):** Chronological 4-stage progression connected by horizontal dashed vector nodes.
5. **Quote & Thought Leadership (`quote_thought_leadership`, 1200x630):** Executive editorial layout featuring a large vector quotation mark, author initial badge, and verification indicator.
6. **Announcement Banner (`announcement_banner`, 1200x630):** Release badge, date stamp chip, headline, and 3 checkmark highlight pills with an official release emblem.
7. **Comparison Layout (`comparison_layout`, 1200x630):** Dual-column split layout comparing legacy approaches against modern AI solutions, with a central "VS" pin.
8. **Feature Highlights Bento (`feature_highlights`, 1200x630):** Asymmetric bento-grid featuring one hero spotlight card and two secondary stacked cards.
9. **List-Based Infographic (`list_bullet_infographic`, 800x1200):** Vertical 5-item structured pillar list with circular number pins and status markers.
10. **Social Square Graphic (`social_square_graphic`, 1080x1080):** 1:1 square canvas designed for social feeds with central key takeaways and brand footer.

---

## 5. SVG Generation Process & Text-Wrapping Mechanics

SVG 1.1 and SVG 2.0 specifications lack automatic multi-line text wrapping outside of browser-dependent `<foreignObject>` elements. Because `<foreignObject>` renders unpredictably in vector editors (such as Adobe Illustrator, Figma, and Inkscape) and standalone image viewports, our engine implements a **deterministic text calculation engine**:
- **Character Budgeting:** Computes maximum character length per line based on font size and container bounding box.
- **Dynamic `<tspan>` Generation:** Emits calculated `<tspan x="..." dy="...">` elements, automatically truncating with ellipses if text boundaries are exceeded.
- **XML Sanitization:** Escapes all raw text through `escapeXml` (`&`, `<`, `>`, `"`, `'`) to ensure 100% syntactically valid XML.
- **Integrated Vector Icons:** Lucide and Feather vector paths are embedded directly as `<path>` strings, ensuring icons scale losslessly without external HTTP requests or broken CDN links.

---

## 6. Originality, Licensing, and IP Compliance

In strict compliance with Section 4.C and Section 12 of the assessment guidelines:
- **No Copyright Infringement:** No copyrighted templates, logos, or proprietary illustrations are used.
- **Open-Source Vector Icons:** All vector icons originate from the **Lucide Icons** library, distributed under the permissive **MIT License**.
- **No External Image Hotlinking:** All shapes, gradients, shadows, and textures are generated mathematically via native SVG `<defs>`, `<linearGradient>`, `<filter>`, and `<pattern>`.
- **Transparent Provenance:** No deceptive claims of manual drawing are made; the software cleanly discloses its automated procedural nature.

---

## 7. Metadata and SVG Cleaning Approach

Per Section 4.B of the assessment guidelines, generated SVGs must be free of extraneous AI artifacts:
- **Prompt Scrubbing:** Unnecessary model prompts, temperature arguments, and internal chain-of-thought comments are strictly excluded from the rendered SVG string.
- **Sanitization Pass:** `sanitizeSvg()` strips any internal commentary containing keywords such as `prompt:` or `model:`.
- **Zero Suspicious Scripts:** Disallows `<script>` tags, `onload`, `onerror`, or JavaScript protocol handlers.
- **Clean Structure:** Standardized `<defs>` blocks group all filters, patterns, and gradients with unique prefixes to prevent ID collisions.

---

## 8. Validation and Quality Assurance

Every generated SVG undergoes automated verification via `validateSvg()` before output:
1. **XML Syntax:** Verified using `fast-xml-parser` AST parser.
2. **viewBox Integrity:** Confirms valid `viewBox="0 0 W H"` coordinates and aspect ratio.
3. **Element Completeness:** Enforces the presence of essential vector primitives (`<rect>`, `<text>`, `<path>`).
4. **Security Check:** Scans against dangerous attributes and unauthorized script injections.
5. **Color Contrast:** Evaluates text-to-background contrast ratios using WCAG luminance calculations, flagging any ratio below 3.0:1.

---

## 9. Challenges Faced & Solutions

| Challenge | Root Cause | Solution Implemented |
| :--- | :--- | :--- |
| **SVG Text Overflow** | SVG lacks native CSS text wrapping; LLMs generate variable headline lengths. | Built an intelligent `renderWrappedText` utility calculating line breaks and generating `<tspan>` elements. |
| **Broken Icon Dependencies** | External CDN icon URLs fail offline and corrupt SVG rendering. | Curated an embedded dictionary of 30+ MIT-licensed vector icon paths compiled directly into the bundle. |
| **Visual Monotony Across 100 SVGs** | Batch generation engines often repeat identical layouts with only color tweaks. | Designed 10 fundamentally different layout templates across 3 aspect ratios (landscape, portrait, square) and 8 harmonious palettes. |
| **Deterministic Reliability** | Commercial LLM rate limits and API credential requirements can block batch evaluation. | Built a resilient dual-mode pipeline: primary OpenAI integration paired with a domain-aware synthetic fallback engine. |

---

## 10. Future Improvements

1. **Client-Side Visual Drag-and-Drop Editor:** Allow users to tweak card positions and text directly on the canvas.
2. **Direct Vector Export to PDF and EPS:** Integrate headless vector transcompilation into print-ready CMYK formats.
3. **Multi-Model Orchestration:** Add direct support for Anthropic Claude, Google Gemini, and local Ollama endpoints.
4. **Automated Font Inlining:** Embed base64-encoded WOFF2 font files into `<style>` blocks for complete offline typography fidelity.
