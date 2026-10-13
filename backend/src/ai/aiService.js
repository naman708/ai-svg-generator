import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_DESIGNER_PROMPT, buildUserPrompt } from "./promptBuilder.js";

/**
 * AI Service for generating structured SVG design instructions.
 * Supports:
 * 1. Google Gemini API (Free tier via Google AI Studio)
 * 2. OpenAI API
 * 3. Local deterministic domain synthesizer fallback
 */

export async function generateDesignInstructions({ topic, category, template, style, tone }) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  // Option 1: Google Gemini (Free Tier)
  if (geminiKey && geminiKey !== "your_gemini_api_key_here") {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const promptText = `${SYSTEM_DESIGNER_PROMPT}\n\n${buildUserPrompt({ topic, category, template, style, tone })}`;
      
      const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
      const response = await ai.models.generateContent({
        model: modelName,
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7
        }
      });

      const text = response.text;
      const parsed = JSON.parse(text);
      parsed.source = `gemini (${modelName})`;
      return parsed;
    } catch (err) {
      console.warn("Gemini API call failed, falling back to local synthesis engine:", err.message);
    }
  }

  // Option 2: OpenAI API
  if (openaiKey && openaiKey !== "your_openai_api_key_here") {
    try {
      const client = new OpenAI({ apiKey: openaiKey });
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_DESIGNER_PROMPT },
          { role: "user", content: buildUserPrompt({ topic, category, template, style, tone }) }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      });

      const responseText = completion.choices[0]?.message?.content;
      const parsed = JSON.parse(responseText);
      parsed.source = "openai";
      return parsed;
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to local synthesis engine:", err.message);
    }
  }

  // Option 3: Fallback deterministic domain synthesizer (Fast, offline, 100% reliable)
  return generateSyntheticDesign({ topic, category, template, style, tone });
}

/**
 * Intelligent domain-aware synthetic design generator.
 * Produces structured design instructions matching the chosen layout and topic.
 */
export function generateSyntheticDesign({ topic = "Artificial Intelligence Systems", category = "Technology", template, style, tone }) {
  const selectedTemplate = template || pickTemplateForTopic(topic, category);
  const selectedTheme = style || pickThemeForCategory(category);
  const badge = `${category} • 2026`;

  const baseContent = {
    badge,
    title: topic,
    subtitle: `Comprehensive visual breakdown and tactical implementation guide for ${topic.toLowerCase()}.`
  };

  switch (selectedTemplate) {
    case "promotional_banner":
      baseContent.cta = "Discover Solutions";
      baseContent.features = [
        { title: "Peak Performance", description: "Engineered for maximum scale & reliability", icon: "zap" },
        { title: "Bank-Grade Security", description: "Zero trust architecture and encryption", icon: "shield" },
        { title: "Next-Gen Intelligence", description: "Powered by autonomous foundation models", icon: "sparkles" }
      ];
      break;

    case "educational_infographic":
      baseContent.sections = [
        { title: "Core Fundamentals", description: `Understanding baseline mechanics and principles governing ${topic.toLowerCase()}.`, icon: "book-open" },
        { title: "Architectural Pipeline", description: "High-throughput data transformations and structured processing layers.", icon: "layers" },
        { title: "Operational Execution", description: "Deploying automated execution workflows with deterministic guarantees.", icon: "cpu" },
        { title: "Long-Term Impact", description: "Measurable strategic returns and continuous capability enhancement.", icon: "target" }
      ];
      break;

    case "statistics_metrics":
      baseContent.metrics = [
        { value: "99.8%", label: "Operational Reliability", delta: "+12.4%", desc: "Continuous uptime SLA verified under enterprise load", icon: "activity" },
        { value: "5.2x", label: "Productivity Velocity", delta: "+420%", desc: "Accelerated development delivery cycle efficiency", icon: "zap" },
        { value: "$18.4M", label: "Annual Cost Reduction", delta: "+55% YoY", icon: "dollar-sign" },
      ];
      break;

    case "step_by_step_roadmap":
      baseContent.steps = [
        { number: "01", title: "Assessment", desc: "Conducting initial diagnostic and systems discovery.", icon: "search" },
        { number: "02", title: "Prototyping", desc: "Synthesizing vector templates and workflow pipelines.", icon: "layers" },
        { number: "03", title: "Integration", desc: "Enforcing rigorous validation and contract testing.", icon: "check-circle" },
        { number: "04", title: "Full Scale", desc: "Global distribution across automated endpoints.", icon: "rocket" }
      ];
      break;

    case "quote_thought_leadership":
      baseContent.quote = `Transforming ${topic.toLowerCase()} requires pairing human creative direction with automated vector precision.`;
      baseContent.author = "Dr. Maya Patel";
      baseContent.role = "Chief AI Architect & Systems Strategist";
      break;

    case "announcement_banner":
      baseContent.date = "RELEASE 4.0 ACTIVE";
      baseContent.description = `The new benchmark for ${topic.toLowerCase()} is here with zero latency and high-fidelity output.`;
      baseContent.highlights = [
        "Fully automated vector rendering pipeline",
        "Deterministic WCAG accessibility compliance",
        "Open-source modular component library"
      ];
      break;

    case "comparison_layout":
      baseContent.sideA = {
        title: "Traditional Methods",
        tag: "OUTDATED",
        items: [
          "Manual and error-prone asset generation",
          "High rendering costs and browser overhead",
          "Inconsistent typography and broken viewBoxes"
        ]
      };
      baseContent.sideB = {
        title: "Autonomous Engine",
        tag: "NEXT-GEN",
        items: [
          "Sub-second procedural vector compilation",
          "Strict XML schema validation and linting",
          "100% scalable vector output across devices"
        ]
      };
      break;

    case "feature_highlights":
      baseContent.heroFeature = {
        title: `Next-Gen ${topic}`,
        tag: "FLAGSHIP CAPABILITY",
        desc: `Built ground-up to redefine how organizations interact with ${topic.toLowerCase()}, ensuring resilience, modularity, and speed.`,
        icon: "sparkles"
      };
      baseContent.sideFeatures = [
        { title: "Deterministic Output", desc: "Guaranteed valid SVG syntax and responsive viewBox compliance.", icon: "shield" },
        { title: "Reusable Vector Tokens", desc: "Configurable palettes, fonts, and licensed vector icons.", icon: "layers" }
      ];
      break;

    case "list_bullet_infographic":
      baseContent.items = [
        { title: "Define Deterministic Contracts", desc: "Anchor creative outputs with structured schema enforcement.", icon: "shield" },
        { title: "Eliminate External Couplings", desc: "Bundle vector primitives inline to prevent asset load failures.", icon: "layers" },
        { title: "Ensure Universal Accessibility", desc: "Maintain WCAG AAA color contrast ratios across all templates.", icon: "target" },
        { title: "Implement Automated Testing", desc: "Verify XML syntax, element geometry, and boundary checks.", icon: "activity" },
        { title: "Commit to Ethical Transparency", desc: "Clean metadata and verify open-source asset licensing.", icon: "lock" }
      ];
      break;

    case "social_square_graphic":
      baseContent.points = [
        `Instant programmatic generation for ${topic.toLowerCase()}`,
        "Scalable from mobile feeds to billboard displays",
        "Zero AI prompt leakage or unnecessary metadata"
      ];
      break;
  }

  return {
    id: "gen_" + Math.random().toString(36).substring(2, 9),
    category,
    topic,
    template: selectedTemplate,
    theme: selectedTheme,
    source: "synthetic-engine",
    content: baseContent
  };
}

function pickTemplateForTopic(topic = "", category = "") {
  const combined = (topic + " " + category).toLowerCase();
  if (combined.includes("metric") || combined.includes("stat") || combined.includes("finance") || combined.includes("growth")) {
    return "statistics_metrics";
  }
  if (combined.includes("step") || combined.includes("roadmap") || combined.includes("guide") || combined.includes("process")) {
    return "step_by_step_roadmap";
  }
  if (combined.includes("vs") || combined.includes("comparison") || combined.includes("difference")) {
    return "comparison_layout";
  }
  if (combined.includes("quote") || combined.includes("leadership") || combined.includes("saying")) {
    return "quote_thought_leadership";
  }
  if (combined.includes("launch") || combined.includes("release") || combined.includes("announcement")) {
    return "announcement_banner";
  }
  if (combined.includes("education") || combined.includes("learning") || combined.includes("how to")) {
    return "educational_infographic";
  }
  if (combined.includes("pillar") || combined.includes("list") || combined.includes("top 5")) {
    return "list_bullet_infographic";
  }
  return "promotional_banner";
}

function pickThemeForCategory(category = "") {
  const cat = (category || "").toLowerCase();
  if (cat.includes("cyber") || cat.includes("security")) return "cyberpunk-tech";
  if (cat.includes("sustain") || cat.includes("eco") || cat.includes("green")) return "emerald-eco";
  if (cat.includes("market") || cat.includes("startup")) return "sunset-vibrant";
  if (cat.includes("finance") || cat.includes("invest")) return "amber-warmth";
  if (cat.includes("health") || cat.includes("medic")) return "crimson-energy";
  if (cat.includes("education") || cat.includes("learn")) return "clean-minimal-light";
  return "modern-corporate";
}
