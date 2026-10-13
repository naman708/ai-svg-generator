import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import {
  Sparkles,
  Download,
  Copy,
  Code,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Palette,
  Layout,
  Sliders,
  ExternalLink,
  AlertTriangle,
  X,
  Cpu
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const PRESET_TOPICS = [
  { topic: "Autonomous AI Agent Swarms", category: "Technology and AI", template: "promotional_banner", theme: "cyberpunk-tech" },
  { topic: "Anatomy of Large Language Models", category: "Technology and AI", template: "educational_infographic", theme: "royal-indigo" },
  { topic: "Enterprise Zero-Trust Defense", category: "Cybersecurity", template: "promotional_banner", theme: "cyberpunk-tech" },
  { topic: "Personalized Genomic Medicine", category: "Healthcare", template: "educational_infographic", theme: "emerald-eco" },
  { topic: "Quarterly Alpha & Hedge Fund Metrics", category: "Finance", template: "statistics_metrics", theme: "amber-warmth" },
  { topic: "Cognitive Science & Mastery Learning", category: "Education", template: "educational_infographic", theme: "royal-indigo" },
  { topic: "Omnichannel Headless Commerce", category: "E-commerce", template: "promotional_banner", theme: "sunset-vibrant" },
  { topic: "Carbon-Negative Cloud Data Centers", category: "Sustainability", template: "feature_highlights", theme: "emerald-eco" },
  { topic: "The 4-Hour Deep Work System", category: "Productivity", template: "step_by_step_roadmap", theme: "sunset-vibrant" },
  { topic: "High-Converting Copywriting Laws", category: "Marketing", template: "list_bullet_infographic", theme: "clean-minimal-light" }
];

const THEMES = [
  { id: "modern-corporate", name: "Modern Corporate", c1: "#0f172a", c2: "#3b82f6" },
  { id: "cyberpunk-tech", name: "Cyberpunk Tech", c1: "#09090b", c2: "#06b6d4" },
  { id: "emerald-eco", name: "Emerald Eco", c1: "#06281e", c2: "#10b981" },
  { id: "sunset-vibrant", name: "Sunset Vibrant", c1: "#1c102b", c2: "#f97316" },
  { id: "royal-indigo", name: "Royal Indigo", c1: "#0f172a", c2: "#6366f1" },
  { id: "clean-minimal-light", name: "Clean Minimal", c1: "#f8fafc", c2: "#2563eb" },
  { id: "crimson-energy", name: "Crimson Energy", c1: "#180c0e", c2: "#ef4444" },
  { id: "amber-warmth", name: "Warm Amber", c1: "#1c1917", c2: "#f59e0b" }
];

const TEMPLATES = [
  { id: "promotional_banner", name: "Promotional Banner (1200x630)" },
  { id: "educational_infographic", name: "Educational Infographic (800x1200)" },
  { id: "statistics_metrics", name: "Statistics & Metrics (1200x630)" },
  { id: "step_by_step_roadmap", name: "Step-by-Step Roadmap (1200x630)" },
  { id: "quote_thought_leadership", name: "Quote & Thought Leadership (1200x630)" },
  { id: "announcement_banner", name: "Announcement Banner (1200x630)" },
  { id: "comparison_layout", name: "Comparison Layout (1200x630)" },
  { id: "feature_highlights", name: "Feature Highlights Bento (1200x630)" },
  { id: "list_bullet_infographic", name: "List-Based Infographic (800x1200)" },
  { id: "social_square_graphic", name: "Social Square Graphic (1080x1080)" }
];

const LOADING_STEPS = [
  "Calling Gemini to analyze brief & design hierarchy...",
  "Synthesizing vector typography & harmonious palettes...",
  "Compiling pure SVG coordinates & validating boundaries...",
  "Finalizing vector elements and render passes..."
];

export default function App() {
  const [activeTab, setActiveTab] = useState("studio"); // 'studio' | 'gallery'
  const [topic, setTopic] = useState("Autonomous AI Agent Swarms");
  const [category, setCategory] = useState("Technology and AI");
  const [template, setTemplate] = useState("promotional_banner");
  const [theme, setTheme] = useState("cyberpunk-tech");
  const [tone, setTone] = useState("Professional and Authoritative");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(LOADING_STEPS[0]);
  const [aiWarning, setAiWarning] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Generated SVG state
  const [currentDesign, setCurrentDesign] = useState(null);
  const [svgContent, setSvgContent] = useState("");
  const [validation, setValidation] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 630 });
  const [generationStats, setGenerationStats] = useState(null);

  // Gallery state
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState("All");

  const svgContainerRef = useRef(null);

  // Initial generation on load
  useEffect(() => {
    handleGenerate();
    fetchGallery();
  }, []);

  // Cycle loading messages when loading
  useEffect(() => {
    if (!loading) return;
    let stepIdx = 0;
    setLoadingStep(LOADING_STEPS[0]);
    const interval = setInterval(() => {
      stepIdx = (stepIdx + 1) % LOADING_STEPS.length;
      setLoadingStep(LOADING_STEPS[stepIdx]);
    }, 1800);
    return () => clearInterval(interval);
  }, [loading]);

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${API_BASE}/designs`);
      const data = await res.json();
      if (data.success) {
        setGalleryItems(data.designs);
      }
    } catch {
      console.log("Could not load designs from server, will retry");
    }
  };

  const handleGenerate = async (overrideParams = {}) => {
    setLoading(true);
    setCopied(false);
    setAiWarning(null);

    try {
      const payload = {
        topic: overrideParams.topic || topic,
        category: overrideParams.category || category,
        template: overrideParams.template || template,
        style: overrideParams.theme || theme,
        tone,
        saveOutput: true
      };

      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setSvgContent(data.svg);
        setCurrentDesign(data.design);
        setValidation(data.validation);
        setDimensions(data.dimensions);
        setGenerationStats({
          timeMs: data.generationTimeMs,
          aspectRatio: data.aspectRatio,
          sizeKb: (new Blob([data.svg]).size / 1024).toFixed(1),
          source: data.source || "unknown"
        });

        if (data.aiWarning) {
          setAiWarning(data.aiWarning);
        }
      } else {
        alert("Generation error: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Failed to connect to backend: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (p) => {
    setTopic(p.topic);
    setCategory(p.category);
    setTemplate(p.template);
    setTheme(p.theme);
    handleGenerate({ topic: p.topic, category: p.category, template: p.template, theme: p.theme });
  };

  const handleCopySvg = () => {
    navigator.clipboard.writeText(svgContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${template}_${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPng = () => {
    const svgElem = svgContainerRef.current?.querySelector("svg");
    if (!svgElem) return;

    const svgData = new XMLSerializer().serializeToString(svgElem);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = dimensions.width || 1200;
    canvas.height = dimensions.height || 630;

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${template}_${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const filteredGallery = selectedGalleryCategory === "All"
    ? galleryItems
    : galleryItems.filter(item => item.category.toLowerCase().includes(selectedGalleryCategory.toLowerCase().replace(/[^a-z0-9]/g, "_")));

  return (
    <div className="app-root">
      {/* Top Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="brand">
            <div className="brand-icon">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="brand-title">VectorGen AI</span>
              <span className="brand-badge" style={{ marginLeft: 8 }}>v1.0 Pro</span>
            </div>
          </div>

          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === "studio" ? "active" : ""}`}
              onClick={() => setActiveTab("studio")}
            >
              <Layout size={15} />
              Studio Designer
            </button>
            <button
              className={`nav-tab ${activeTab === "gallery" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("gallery");
                fetchGallery();
              }}
            >
              <Layers size={15} />
              100+ SVG Portfolio ({galleryItems.length})
            </button>
          </div>
        </div>
      </header>

      {/* Mode 1: Interactive Studio */}
      {activeTab === "studio" && (
        <main className="studio-layout">
          {/* Controls Panel */}
          <aside className="control-panel">
            <div className="panel-header">
              <h2>Design Configuration</h2>
              <p>Configure parameters to synthesize structured SVG graphics.</p>
            </div>

            {/* Quick Presets */}
            <div className="form-group">
              <label className="form-label">
                <span>Quick Presets</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Instant topic demos</span>
              </label>
              <div className="presets-row">
                {PRESET_TOPICS.slice(0, 4).map((p, idx) => (
                  <button key={idx} className="preset-chip" onClick={() => handleApplyPreset(p)}>
                    {p.topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="topic-input">Topic or Concept Brief</label>
              <input
                id="topic-input"
                className="form-input"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Next-Gen Cloud Architecture"
              />
            </div>

            {/* Category Select */}
            <div className="form-group">
              <label className="form-label" htmlFor="category-select">Category</label>
              <select
                id="category-select"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Technology and AI">Technology and AI</option>
                <option value="Business and Startups">Business and Startups</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Sustainability">Sustainability</option>
                <option value="Productivity">Productivity</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            {/* Layout Template Select */}
            <div className="form-group">
              <label className="form-label" htmlFor="template-select">Layout Template</label>
              <select
                id="template-select"
                className="form-select"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              >
                {TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Color Theme Swatches */}
            <div className="form-group">
              <label className="form-label">Color Theme & Palette</label>
              <div className="theme-grid">
                {THEMES.map((th) => (
                  <div
                    key={th.id}
                    className={`theme-card ${theme === th.id ? "active" : ""}`}
                    onClick={() => setTheme(th.id)}
                    title={th.name}
                  >
                    <div className="theme-swatch">
                      <div style={{ flex: 1, background: th.c1 }} />
                      <div style={{ flex: 1, background: th.c2 }} />
                    </div>
                    <span className="theme-name">{th.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tone Selector */}
            <div className="form-group">
              <label className="form-label" htmlFor="tone-select">Brand Tone</label>
              <select
                id="tone-select"
                className="form-select"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="Professional and Authoritative">Professional and Authoritative</option>
                <option value="Modern Tech & Futuristic">Modern Tech & Futuristic</option>
                <option value="Bold and Energetic">Bold and Energetic</option>
                <option value="Clean & Minimalist">Clean & Minimalist</option>
                <option value="Academic & Scientific">Academic & Scientific</option>
              </select>
            </div>

            {/* Generate Button */}
            <button
              className="btn-generate"
              onClick={() => handleGenerate()}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  Synthesizing Vector Graphics...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate AI SVG Design
                </>
              )}
            </button>
          </aside>

          {/* SVG Previewer & Canvas */}
          <section className="preview-container">
            {/* Warning / Fallback Notice Banner */}
            {aiWarning && (
              <div className="warning-banner">
                <div className="warning-content">
                  <AlertTriangle size={16} />
                  <span>{aiWarning}</span>
                </div>
                <button className="btn-dismiss" onClick={() => setAiWarning(null)} title="Dismiss notice">
                  <X size={15} />
                </button>
              </div>
            )}

            {/* Top Toolbar */}
            <div className="preview-toolbar">
              <div className="meta-badges">
                {validation?.isValid && (
                  <span className="badge-pill status-pass">
                    <CheckCircle2 size={14} /> XML Valid SVG
                  </span>
                )}
                {generationStats && (
                  <>
                    <span className="badge-pill engine-source" title="Engine Source">
                      <Cpu size={12} /> {generationStats.source}
                    </span>
                    <span className="badge-pill dim">{generationStats.aspectRatio}</span>
                    <span className="badge-pill dim">{generationStats.sizeKb} KB</span>
                    <span className="badge-pill dim">{generationStats.timeMs}ms</span>
                  </>
                )}
              </div>

              <div className="toolbar-actions">
                <button className="btn-action" onClick={() => setZoom(z => Math.max(0.6, z - 0.1))} title="Zoom Out">
                  <ZoomOut size={14} />
                </button>
                <button className="btn-action" onClick={() => setZoom(1)} title="Reset Zoom">
                  {Math.round(zoom * 100)}%
                </button>
                <button className="btn-action" onClick={() => setZoom(z => Math.min(1.6, z + 0.1))} title="Zoom In">
                  <ZoomIn size={14} />
                </button>
                <button className="btn-action" onClick={() => setShowCode(!showCode)}>
                  <Code size={14} /> {showCode ? "Hide Code" : "Inspect SVG"}
                </button>
                <button className="btn-action" onClick={handleCopySvg}>
                  <Copy size={14} /> {copied ? "Copied!" : "Copy SVG"}
                </button>
                <button className="btn-action" onClick={handleExportPng}>
                  <ImageIcon size={14} /> PNG
                </button>
                <button className="btn-action primary" onClick={handleDownloadSvg}>
                  <Download size={14} /> Download SVG
                </button>
              </div>
            </div>

            {/* Canvas Stage */}
            <div className="svg-viewport">
              {/* Full Loader Overlay during Generation */}
              {loading && (
                <div className="loader-overlay">
                  <div className="loader-card">
                    <div className="spinner-wrapper">
                      <div className="spinner-outer" />
                      <div className="spinner-inner">
                        <Sparkles size={24} />
                      </div>
                    </div>
                    <div className="loader-title">Generating SVG Vector Graphic</div>
                    <div className="loader-status">
                      <span className="pulse-dot" />
                      {loadingStep}
                    </div>
                  </div>
                </div>
              )}

              <div
                ref={svgContainerRef}
                className="svg-display"
                style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            </div>

            {/* Code Inspector Drawer */}
            {showCode && (
              <div className="code-inspector">
                <div className="code-header">
                  <h3>SVG Source Code ({new Blob([svgContent]).size} bytes)</h3>
                  <button className="btn-action" onClick={handleCopySvg}>
                    <Copy size={12} /> Copy
                  </button>
                </div>
                <div className="code-block">{svgContent}</div>
              </div>
            )}
          </section>
        </main>
      )}

      {/* Mode 2: 100+ SVG Portfolio Gallery */}
      {activeTab === "gallery" && (
        <section className="gallery-container">
          <div className="gallery-header">
            <h2>100+ Automated SVG Design Portfolio</h2>
            <p style={{ color: "var(--text-muted)", marginTop: 4 }}>
              Programmatically generated across 10 categories and 10 modular layouts in compliance with technical assessment criteria.
            </p>

            <div className="gallery-filters">
              {["All", "Technology", "Business", "Cybersecurity", "Healthcare", "Finance", "Education", "E-commerce", "Sustainability", "Productivity", "Marketing"].map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${selectedGalleryCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedGalleryCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="gallery-grid">
            {filteredGallery.map((item, idx) => (
              <div key={idx} className="gallery-card">
                <div className="gallery-thumb">
                  <img
                    src={`${API_BASE}/designs/file/${item.path}`}
                    alt={item.name}
                    style={{ maxWidth: "100%", maxHeight: "240px", display: "block" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
                <div className="gallery-body">
                  <div className="gallery-title">{item.name.replace(/_/g, " ").replace(".svg", "")}</div>
                  <div className="gallery-meta">
                    <span className="tag-badge">{item.category}</span>
                    <span className="tag-badge">{(item.size / 1024).toFixed(1)} KB</span>
                    <a
                      href={`${API_BASE}/designs/file/${item.path}`}
                      download={item.name}
                      className="tag-badge"
                      style={{ color: "var(--primary)", textDecoration: "none", marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <Download size={12} /> Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
