import { LAYOUT_REGISTRY, renderSvgDesign } from "./engine/svgRenderer.js";
import { XMLValidator } from "fast-xml-parser";

console.log("=== Testing 10 Modular SVG Layout Templates ===");

const sampleTopics = [
  { template: "promotional_banner", theme: "modern-corporate", category: "AI & Technology", content: { title: "Next-Gen AI Agents", subtitle: "Autonomous workflow execution", cta: "Deploy Now" } },
  { template: "educational_infographic", theme: "royal-indigo", category: "Education", content: { title: "Machine Learning Basics", subtitle: "Key training phases", sections: [{ title: "Data Ingestion", description: "Cleaning and vectorizing data" }, { title: "Model Training", description: "Backpropagation and optimization" }] } },
  { template: "statistics_metrics", theme: "cyberpunk-tech", category: "Finance", content: { title: "Quarterly Growth Highlights", metrics: [{ value: "99.9%", label: "Accuracy" }, { value: "3.5x", label: "Efficiency" }] } },
  { template: "step_by_step_roadmap", theme: "sunset-vibrant", category: "Productivity", content: { title: "4-Phase Migration", steps: [{ title: "Audit" }, { title: "Plan" }, { title: "Migrate" }, { title: "Verify" }] } },
  { template: "quote_thought_leadership", theme: "amber-warmth", category: "Leadership", content: { quote: "Innovation is taking two things that exist and putting them together in a new way.", author: "Tom Freston", role: "Media Executive" } },
  { template: "announcement_banner", theme: "crimson-energy", category: "Corporate", content: { title: "Global Summit 2026", date: "Nov 15-18", description: "Join top industry leaders in San Francisco." } },
  { template: "comparison_layout", theme: "modern-corporate", category: "Cloud & DevSecOps", content: { title: "Monolith vs Microservices", sideA: { title: "Monolith", tag: "Legacy", items: ["Tight coupling", "Slow builds"] }, sideB: { title: "Microservices", tag: "Cloud Native", items: ["Independent deploy", "Fault isolation"] } } },
  { template: "feature_highlights", theme: "emerald-eco", category: "Sustainability", content: { title: "Green Data Centers", heroFeature: { title: "Zero Carbon Compute", desc: "100% renewable power" }, sideFeatures: [{ title: "Water Cooling", desc: "Closed-loop system" }, { title: "AI Energy Tuning", desc: "Automated load shifting" }] } },
  { template: "list_bullet_infographic", theme: "clean-minimal-light", category: "Cybersecurity", content: { title: "Zero Trust Architecture", subtitle: "Top 5 security practices", items: [{ title: "Never Trust, Always Verify", desc: "Inspect all packet headers" }, { title: "Least Privilege", desc: "Limit access tokens" }] } },
  { template: "social_square_graphic", theme: "royal-indigo", category: "Marketing", content: { title: "Content Strategy 2026", subtitle: "Building brand authority with vector visuals", points: ["High engagement", "Crisp vector display", "Fast load times"] } }
];

let allPassed = true;

for (const sample of sampleTopics) {
  try {
    const result = renderSvgDesign(sample);
    const xmlValidation = XMLValidator.validate(result.svg);

    if (xmlValidation === true) {
      console.log(`[PASS] ${sample.template} (${result.dimensions.width}x${result.dimensions.height}) - Valid XML SVG`);
    } else {
      console.error(`[FAIL] ${sample.template} XML error:`, xmlValidation);
      allPassed = false;
    }
  } catch (err) {
    console.error(`[ERROR] ${sample.template}:`, err.message);
    allPassed = false;
  }
}

if (allPassed) {
  console.log("\nALL 10 SVG TEMPLATES PASSED XML VALIDATION!");
} else {
  process.exit(1);
}
