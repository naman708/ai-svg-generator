import { renderPromotionalBanner } from "../templates/layouts/promotionalBanner.js";
import { renderEducationalInfographic } from "../templates/layouts/educationalInfographic.js";
import { renderStatisticsMetrics } from "../templates/layouts/statisticsMetrics.js";
import { renderStepByStepRoadmap } from "../templates/layouts/stepByStepRoadmap.js";
import { renderQuoteThoughtLeadership } from "../templates/layouts/quoteThoughtLeadership.js";
import { renderAnnouncementBanner } from "../templates/layouts/announcementBanner.js";
import { renderComparisonLayout } from "../templates/layouts/comparisonLayout.js";
import { renderFeatureHighlights } from "../templates/layouts/featureHighlights.js";
import { renderListBulletInfographic } from "../templates/layouts/listBulletInfographic.js";
import { renderSocialSquareGraphic } from "../templates/layouts/socialSquareGraphic.js";

export const LAYOUT_REGISTRY = {
  promotional_banner: {
    id: "promotional_banner",
    name: "Promotional Banner",
    dimensions: { width: 1200, height: 630 },
    aspectRatio: "1200x630 (1.91:1 Landscape)",
    render: renderPromotionalBanner
  },
  educational_infographic: {
    id: "educational_infographic",
    name: "Educational Infographic",
    dimensions: { width: 800, height: 1200 },
    aspectRatio: "800x1200 (2:3 Portrait)",
    render: renderEducationalInfographic
  },
  statistics_metrics: {
    id: "statistics_metrics",
    name: "Statistics & Metrics",
    dimensions: { width: 1200, height: 630 },
    aspectRatio: "1200x630 (1.91:1 Landscape)",
    render: renderStatisticsMetrics
  },
  step_by_step_roadmap: {
    id: "step_by_step_roadmap",
    name: "Step-by-Step Roadmap",
    dimensions: { width: 1200, height: 630 },
    aspectRatio: "1200x630 (1.91:1 Landscape)",
    render: renderStepByStepRoadmap
  },
  quote_thought_leadership: {
    id: "quote_thought_leadership",
    name: "Quote & Thought Leadership",
    dimensions: { width: 1200, height: 630 },
    aspectRatio: "1200x630 (1.91:1 Landscape)",
    render: renderQuoteThoughtLeadership
  },
  announcement_banner: {
    id: "announcement_banner",
    name: "Announcement Banner",
    dimensions: { width: 1200, height: 630 },
    aspectRatio: "1200x630 (1.91:1 Landscape)",
    render: renderAnnouncementBanner
  },
  comparison_layout: {
    id: "comparison_layout",
    name: "Comparison Layout",
    dimensions: { width: 1200, height: 630 },
    aspectRatio: "1200x630 (1.91:1 Landscape)",
    render: renderComparisonLayout
  },
  feature_highlights: {
    id: "feature_highlights",
    name: "Feature Highlights Bento",
    dimensions: { width: 1200, height: 630 },
    aspectRatio: "1200x630 (1.91:1 Landscape)",
    render: renderFeatureHighlights
  },
  list_bullet_infographic: {
    id: "list_bullet_infographic",
    name: "List-Based Infographic",
    dimensions: { width: 800, height: 1200 },
    aspectRatio: "800x1200 (2:3 Portrait)",
    render: renderListBulletInfographic
  },
  social_square_graphic: {
    id: "social_square_graphic",
    name: "Social Square Graphic",
    dimensions: { width: 1080, height: 1080 },
    aspectRatio: "1080x1080 (1:1 Square)",
    render: renderSocialSquareGraphic
  }
};

/**
 * Main render function that takes design instructions JSON and compiles into clean SVG.
 */
export function renderSvgDesign(designData) {
  if (!designData) {
    throw new Error("Design data object is required");
  }

  const templateKey = designData.template || designData.layoutTemplate || "promotional_banner";
  const layout = LAYOUT_REGISTRY[templateKey] || LAYOUT_REGISTRY.promotional_banner;

  const renderedSvg = layout.render(designData);
  return {
    svg: renderedSvg,
    template: layout.id,
    dimensions: layout.dimensions,
    aspectRatio: layout.aspectRatio
  };
}
