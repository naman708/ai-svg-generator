# 🎨 AI-Powered SVG Banner & Infographic Generation Engine

An automated, production-grade vector design generation engine built with **Node.js, Express, Generative AI (OpenAI API), JavaScript Template Engine, and React**.

This project fulfills all requirements specified in the **Gen AI Developer - Practical Technical Assessment** for Shri Genesis Software Solutions.

---

## 🌟 Key Capabilities

- **10 Distinct Modular Vector Layouts:**
  - `promotional_banner` (1200x630 Landscape)
  - `educational_infographic` (800x1200 Portrait)
  - `statistics_metrics` (1200x630 Landscape)
  - `step_by_step_roadmap` (1200x630 Landscape)
  - `quote_thought_leadership` (1200x630 Landscape)
  - `announcement_banner` (1200x630 Landscape)
  - `comparison_layout` (1200x630 Landscape)
  - `feature_highlights` (1200x630 Landscape)
  - `list_bullet_infographic` (800x1200 Portrait)
  - `social_square_graphic` (1080x1080 Square)
- **100 Batch SVG Portfolio Generated:** 100 unique designs across 10 categories (Technology, Cybersecurity, Healthcare, Finance, E-commerce, Education, Sustainability, Productivity, Startups, Marketing) with 100% valid XML compliance.
- **Smart Text-Wrapping Engine:** Dynamic `<tspan>` calculation preventing text overflow, overlapping, and clipping.
- **Embedded MIT Vector Icons:** 30+ curated vector icon paths from Lucide/Feather icons embedded inline with zero external HTTP dependencies.
- **Automated Validation & Sanitization:** AST XML validation, viewBox compliance, WCAG contrast estimation, and automated removal of AI prompts and metadata artifacts.
- **Interactive React Studio UI:** Live previewer, zoom controls, syntax inspector, SVG download, PNG export, and an interactive 100+ SVG portfolio gallery.

---

## 📁 Project Architecture

```
ai-svg-generator/
├── backend/
│   ├── src/
│   │   ├── ai/                 # LLM prompts, OpenAI client & domain synthesizer
│   │   ├── engine/             # Text-wrapping, color palettes & master SVG renderer
│   │   ├── templates/          # 10 modular SVG layout templates, defs & vector icons
│   │   ├── validator/          # XML AST validator, viewBox checker & sanitizer
│   │   ├── batch/              # 100-design batch generator & topics catalogue
│   │   ├── routes/             # Express API endpoints (/api/generate, /api/designs, etc.)
│   │   └── server.js           # Express app entry point
│   ├── outputs/                # 100 generated SVG files categorized by topic
│   └── package.json
├── frontend/                   # React 18 + Vite + CSS Design System
│   ├── src/
│   │   ├── App.jsx             # Studio designer, previewer & portfolio gallery
│   │   └── App.css             # Modern dark-mode styling
│   └── package.json
├── docs/                       # Official Assessment Reports
│   ├── TECHNICAL_REPORT.md     # Comprehensive 2-4 page technical submission report
│   ├── EXECUTION_REPORT.md     # Batch execution statistics & benchmark metrics
│   └── CONTACT_SHEET.html      # Visual HTML contact sheet displaying all 100 designs
└── README.md
```

---

## 🚀 Quickstart & Execution Instructions

### 🚂 Railway Deployment (1-Click Monorepo)
This repository is pre-configured with `railway.json` to deploy both frontend and backend as a single service on [Railway](https://railway.app/).
See [**`RAILWAY_DEPLOYMENT.md`**](file:///C:/Users/praba/ai-svg-generator/RAILWAY_DEPLOYMENT.md) for full step-by-step instructions.

---

### 1. Prerequisites
- **Node.js** v18+ (tested on Node.js v20.20.2)
- **npm** v9+

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env    # Optional: configure OPENAI_API_KEY
```

> **Note on API Keys:** The backend includes an intelligent offline domain synthesizer fallback. If `OPENAI_API_KEY` is not provided, the application automatically runs in deterministic synthesis mode, ensuring seamless execution during evaluation.

Start the backend server:
```bash
npm start
# Server starts at http://localhost:5000
```

### 3. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
# React Studio opens at http://localhost:5173
```

### 4. Running the 100-SVG Batch Generator
To execute the automated batch generation of 100 unique SVG designs:
```bash
cd backend
npm run batch
```
This automatically:
1. Generates 100 unique SVGs across 10 categories and 10 layouts.
2. Validates every SVG against XML syntax and viewBox rules.
3. Saves the files into `backend/outputs/<category_folder>/`.
4. Compiles the catalog into `backend/outputs/manifest.json`.
5. Updates the interactive visual contact sheet in `docs/CONTACT_SHEET.html`.
6. Generates the benchmark metrics in `docs/EXECUTION_REPORT.md`.

---

## 📊 Viewing the Outputs & Deliverables

1. **Visual Contact Sheet:** Open `docs/CONTACT_SHEET.html` directly in any web browser to view all 100 generated designs in a responsive gallery.
2. **Interactive UI Gallery:** Launch the React app (`npm run dev` in `frontend/`) and navigate to the **"100+ SVG Portfolio"** tab to filter and inspect designs live.
3. **Raw SVG Files:** Browse `backend/outputs/` where designs are neatly organized into 10 subdirectories.
4. **Technical Report:** Read `docs/TECHNICAL_REPORT.md` for in-depth design rationale, architecture, and compliance disclosures.
5. **Execution Report:** Read `docs/EXECUTION_REPORT.md` for generation time, success rates, and validation results.

---

## 🛡️ License & IP Disclosures
- **Vector Icons:** Embedded from the [Lucide Icons](https://lucide.dev/) library under the **MIT License**.
- **Fonts:** System sans-serif stack (`Inter`, `-apple-system`, `sans-serif`) requiring zero external font network requests.
- **Code:** Created as part of the Shri Genesis Software Solutions Practical Technical Assessment.
