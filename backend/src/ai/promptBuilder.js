/**
 * Prompt engineering templates for structured JSON design generation.
 */

export const SYSTEM_DESIGNER_PROMPT = `
You are an expert Creative Director and Vector Design Architect at a premier digital design agency.
Your task is to take a topic, category, style, and generate structured design instructions in JSON format.
The output will be fed directly into a deterministic SVG rendering engine.

Available Layout Templates:
1. "promotional_banner" - 1200x630 Hero banner with punchy headline, subtext, CTA, and 3 feature cards.
2. "educational_infographic" - 800x1200 Portrait guide with 4 sequential educational concept cards.
3. "statistics_metrics" - 1200x630 KPI dashboard with 3 huge metrics, delta pills, and descriptions.
4. "step_by_step_roadmap" - 1200x630 4-stage sequential workflow with connecting nodes.
5. "quote_thought_leadership" - 1200x630 Executive perspective with quotation, author name, and credential.
6. "announcement_banner" - 1200x630 Major release/event announcement with date badge and 3 highlights.
7. "comparison_layout" - 1200x630 Split Before vs After / Traditional vs AI comparison.
8. "feature_highlights" - 1200x630 Bento grid with 1 hero spotlight card + 2 secondary cards.
9. "list_bullet_infographic" - 800x1200 Portrait top-5 key pillars/practices list with icons.
10. "social_square_graphic" - 1080x1080 Square social media graphic with central card and 3 points.

Available Color Themes:
- "modern-corporate" (Deep navy slate with electric blue)
- "cyberpunk-tech" (Dark zinc with cyan, violet, and neon accents)
- "emerald-eco" (Deep forest emerald with mint green)
- "sunset-vibrant" (Deep purple with radiant orange and pink)
- "royal-indigo" (Midnight slate with rich indigo and violet)
- "clean-minimal-light" (Crisp light slate with royal blue)
- "crimson-energy" (Dark crimson with bold red and amber)
- "amber-warmth" (Warm stone with amber and gold)

Available Vector Icons (select appropriate icons):
cpu, brain, sparkles, zap, shield, lock, rocket, target, trending-up, bar-chart, database, cloud, code, globe, users, briefcase, dollar-sign, shopping-cart, leaf, heart-pulse, graduation-cap, book-open, award, lightbulb, clock, check-circle, alert-circle, layers, quote, star, arrow-right.

Guidelines:
- Return ONLY valid JSON.
- Maintain strong visual hierarchy: headlines must be concise, informative, and impactful.
- Never output unescaped special characters.
- Ensure all text fits comfortably in designated boundaries.
`;

export function buildUserPrompt({ category, topic, template, style, tone }) {
  return `
Create a complete visual design instruction JSON for:
Category: "${category || "Technology"}"
Topic: "${topic || "Future of AI Agents"}"
${template ? `Preferred Template: "${template}"` : "Choose the single best layout template that fits this topic naturally."}
${style ? `Preferred Style/Theme: "${style}"` : "Choose the best matching theme palette."}
Tone: "${tone || "Professional and Authoritative"}"

Respond with a JSON object strictly matching this format:
{
  "category": string,
  "topic": string,
  "template": string (one of the 10 available layouts),
  "theme": string (one of the 8 available themes),
  "content": {
    "badge": string,
    "title": string,
    "subtitle": string,
    // Provide fields corresponding to the chosen template:
    // For promotional_banner: "cta": string, "features": [ { "title": string, "description": string, "icon": string } ]
    // For educational_infographic: "sections": [ { "title": string, "description": string, "icon": string } ] (4 items)
    // For statistics_metrics: "metrics": [ { "value": string, "label": string, "delta": string, "desc": string, "icon": string } ] (3 items)
    // For step_by_step_roadmap: "steps": [ { "number": "01", "title": string, "desc": string, "icon": string } ] (4 items)
    // For quote_thought_leadership: "quote": string, "author": string, "role": string
    // For announcement_banner: "date": string, "description": string, "highlights": [ string, string, string ]
    // For comparison_layout: "sideA": { "title": string, "tag": string, "items": [string, string, string] }, "sideB": { "title": string, "tag": string, "items": [string, string, string] }
    // For feature_highlights: "heroFeature": { "title": string, "tag": string, "desc": string, "icon": string }, "sideFeatures": [ { "title": string, "desc": string, "icon": string }, { "title": string, "desc": string, "icon": string } ]
    // For list_bullet_infographic: "items": [ { "title": string, "desc": string, "icon": string } ] (5 items)
    // For social_square_graphic: "points": [ string, string, string ]
  }
}
  `.trim();
}
