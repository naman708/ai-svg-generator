import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_DESIGNER_PROMPT, buildUserPrompt } from "./promptBuilder.js";

/**
 * AI Service for generating structured SVG design instructions.
 * Waits for Gemini / OpenAI to fully generate without premature timeout.
 * Only falls back if an actual error is returned by the AI provider.
 */
export async function generateDesignInstructions({ topic, category, template, style, tone }) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  let lastErrorNotice = null;

  // Option 1: Google Gemini (Free Tier)
  if (geminiKey && geminiKey.trim() !== "" && geminiKey !== "your_gemini_api_key_here") {
    const preferredModel = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    const modelsToTry = [preferredModel, "gemini-3.8-flash", "gemini-3.8-flash"]
      .filter((m, i, arr) => arr.indexOf(m) === i);

    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const promptText = `${SYSTEM_DESIGNER_PROMPT}\n\n${buildUserPrompt({ topic, category, template, style, tone })}`;

    for (const modelName of modelsToTry) {
      try {
        console.log(`[AI] Calling Gemini (${modelName})... Waiting for full model response.`);
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
        console.log(`[AI] Gemini (${modelName}) successfully generated design!`);
        return parsed;
      } catch (err) {
        console.warn(`[AI] Gemini (${modelName}) returned an error: ${err.message}`);
        lastErrorNotice = err.message.includes("503") || err.message.includes("high demand")
          ? "Gemini experienced high demand (503)."
          : `Gemini: ${err.message}`;
        // If 503 high demand on preferred model, loop continues to try next model in modelsToTry
      }
    }
  }

  // Option 2: OpenAI API
  if (openaiKey && openaiKey.trim() !== "" && openaiKey !== "your_openai_api_key_here") {
    try {
      console.log("[AI] Calling OpenAI API...");
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
      console.log("[AI] OpenAI successfully generated design!");
      return parsed;
    } catch (err) {
      console.warn("[AI] OpenAI API returned an error:", err.message);
      lastErrorNotice = `OpenAI: ${err.message}`;
    }
  }

  // Option 3: Local deterministic domain synthesizer (Only used when no key provided or actual API error occurred)
  const synthetic = generateSyntheticDesign({ topic, category, template, style, tone });
  if (lastErrorNotice) {
    synthetic.aiWarning = `${lastErrorNotice} Auto-switched to Local Vector Synthesizer.`;
  }
  return synthetic;
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
    subtitle: `Practical strategies, core principles, and key takeaways for ${topic.toLowerCase()}.`
  };

  switch (selectedTemplate) {
    case "promotional_banner":
      baseContent.cta = "Explore the Guide";
      baseContent.features = [
        { title: "Fast Execution", description: "Built for speed and responsive everyday performance", icon: "zap" },
        { title: "Reliable by Design", description: "Battle-tested safeguards you can depend on", icon: "shield" },
        { title: "Clean Architecture", description: "Modular structure that adapts as your needs grow", icon: "sparkles" }
      ];
      break;

    case "educational_infographic":
      baseContent.sections = [
        { title: "The Core Foundation", description: `Understand the baseline concepts that make ${topic.toLowerCase()} work.`, icon: "book-open" },
        { title: "Key Mechanisms", description: "How components connect and pass information under the hood.", icon: "layers" },
        { title: "Practical Application", description: "Putting theory into practice with repeatable, tested workflows.", icon: "cpu" },
        { title: "Long-Term Value", description: "Building lasting habits and sustainable results over time.", icon: "target" }
      ];
      break;

    case "statistics_metrics":
      baseContent.metrics = [
        { value: "99.4%", label: "System Reliability", delta: "+8.2% YoY", desc: "Consistent uptime verified under real peak workloads", icon: "activity" },
        { value: "3.8x", label: "Workflow Speedup", delta: "3.8x Faster", desc: "Less manual friction and faster turnaround times", icon: "zap" },
        { value: "45%", label: "Lower Overhead", delta: "Sustained Margin", desc: "Streamlined processes that cut unnecessary recurring spend", icon: "dollar-sign" }
      ];
      break;

    case "step_by_step_roadmap":
      baseContent.steps = [
        { number: "01", title: "Discovery", desc: "Audit existing workflows and identify key friction points.", icon: "search" },
        { number: "02", title: "Blueprint", desc: "Draft a clean implementation plan with clear ownership.", icon: "layers" },
        { number: "03", title: "Validation", desc: "Run practical tests and gather direct feedback early.", icon: "check-circle" },
        { number: "04", title: "Scale", desc: "Roll out systematically across teams with continuous monitoring.", icon: "rocket" }
      ];
      break;

    case "quote_thought_leadership":
      baseContent.quote = `The best solutions don't overcomplicate things—they clear the noise so people can do their best work.`;
      baseContent.author = "Elena Vance";
      baseContent.role = "Design Director & Systems Architect";
      break;

    case "announcement_banner":
      baseContent.date = "VERSION 3.0 READY";
      baseContent.description = `A faster, cleaner, and more intuitive approach to ${topic.toLowerCase()} is now live.`;
      baseContent.highlights = [
        "Lightweight, responsive layouts across all screens",
        "Refined visual clarity with zero unnecessary bloat",
        "Built-in accessibility and high-contrast compliance"
      ];
      break;

    case "comparison_layout":
      baseContent.sideA = {
        title: "Traditional Approach",
        tag: "OUTDATED",
        items: [
          "Manual steps that invite avoidable errors",
          "Slow feedback loops that delay decisions",
          "Scattered documentation and unpredictable results"
        ]
      };
      baseContent.sideB = {
        title: "Modern Approach",
        tag: "STREAMLINED",
        items: [
          "Automated pipelines with instant validation",
          "Clear real-time visibility across every stage",
          "Consistent, high-quality deliverables every time"
        ]
      };
      break;

    case "feature_highlights":
      baseContent.heroFeature = {
        title: `Rethinking ${topic}`,
        tag: "CORE CAPABILITY",
        desc: `A fresh approach designed to help teams master ${topic.toLowerCase()} with greater clarity, speed, and confidence.`,
        icon: "sparkles"
      };
      baseContent.sideFeatures = [
        { title: "Instant Clarity", desc: "Crisp visual hierarchies that surface what matters most.", icon: "shield" },
        { title: "Modular Toolkit", desc: "Flexible components designed to fit smoothly into your workflow.", icon: "layers" }
      ];
      break;

    case "list_bullet_infographic":
      baseContent.items = [
        { title: "Start with Clear Goals", desc: "Define what success looks like before jumping into execution.", icon: "shield" },
        { title: "Cut Unnecessary Complexity", desc: "Simpler architectures are easier to maintain, debug, and scale.", icon: "layers" },
        { title: "Prioritize Human Usability", desc: "Make interfaces intuitive, legible, and accessible to everyone.", icon: "target" },
        { title: "Automate Routine Tasks", desc: "Free up mental bandwidth by letting machines handle the busywork.", icon: "activity" },
        { title: "Review and Refine Often", desc: "Small regular improvements consistently beat infrequent massive rewrites.", icon: "lock" }
      ];
      break;

    case "social_square_graphic":
      baseContent.points = [
        `Actionable, real-world principles for ${topic.toLowerCase()}`,
        "Focused on speed, clarity, and dependable results",
        "Clean vector design with zero visual clutter"
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
