// Mock data for feature flag insights dashboard

import { SessionReplay } from "./analytics";

export interface ExposureDataPoint {
  date: string;
  exposures: number;
  uniqueUsers: number;
}

export interface RolloutEvent {
  date: string;
  percentage: number;
  description: string;
}

export interface MetricComparison {
  name: string;
  preValue: number;
  postValue: number;
  unit: string;
  isPercentage: boolean;
  higherIsBetter: boolean;
}

export interface VariantPerformance {
  variant: string;
  conversionRate: number;
  revenuePerUser: number;
  engagementScore: number;
  sampleSize: number;
}

export interface SegmentBreakdown {
  segment: string;
  count: number;
  percentage: number;
  color: string;
}

export interface FunnelStep {
  name: string;
  controlCount: number;
  treatmentCount: number;
  controlRate: number;
  treatmentRate: number;
}

export interface FlagInsights {
  flagId: string;
  flagKey: string;
  totalExposures: number;
  uniqueUsersExposed: number;
  exposuresOverTime: ExposureDataPoint[];
  rolloutEvents: RolloutEvent[];
  prePostMetrics: MetricComparison[];
  sessionReplays: SessionReplay[];
  aiSummary: {
    overallSentiment: "positive" | "neutral" | "negative";
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    notablePatterns: string[];
  };
  variantPerformance: VariantPerformance[];
  segmentBreakdown: SegmentBreakdown[];
  funnelImpact: FunnelStep[];
  errorRateComparison: {
    controlErrorRate: number;
    treatmentErrorRate: number;
    errorTypes: { type: string; controlCount: number; treatmentCount: number }[];
  };
}

// Helper to generate exposure data over last 30 days
function generateExposureData(baseExposures: number, growthFactor: number): ExposureDataPoint[] {
  const data: ExposureDataPoint[] = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    
    // Add some variance and growth
    const dayFactor = 1 + (29 - i) * growthFactor * 0.01;
    const variance = 0.8 + Math.random() * 0.4;
    const exposures = Math.round(baseExposures * dayFactor * variance);
    const uniqueUsers = Math.round(exposures * (0.7 + Math.random() * 0.2));
    
    data.push({ date: dateStr, exposures, uniqueUsers });
  }
  
  return data;
}

// Helper to generate session replays
function generateSessionReplays(count: number): SessionReplay[] {
  const colors = [
    "from-blue-600 to-purple-600",
    "from-green-600 to-teal-600",
    "from-orange-600 to-red-600",
    "from-pink-600 to-rose-600",
    "from-indigo-600 to-blue-600",
    "from-yellow-600 to-orange-600",
  ];
  const devices: ("desktop" | "mobile" | "tablet")[] = ["desktop", "mobile", "tablet"];
  const segments = ["Power User", "New User", "Returning", "Enterprise", "Free Tier"];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `replay-flag-${i + 1}`,
    thumbnailColor: colors[i % colors.length],
    duration: `${Math.floor(Math.random() * 5) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: `user_${1000 + i}`,
    userSegment: segments[Math.floor(Math.random() * segments.length)],
    deviceType: devices[Math.floor(Math.random() * devices.length)],
  }));
}

// Mock insights data for each feature flag
export const flagInsights: Record<string, FlagInsights> = {
  "flag-1": {
    flagId: "flag-1",
    flagKey: "show_wishlist_v2",
    totalExposures: 45230,
    uniqueUsersExposed: 12450,
    exposuresOverTime: generateExposureData(1500, 2),
    rolloutEvents: [
      { date: "2024-01-10", percentage: 10, description: "Initial rollout to 10%" },
      { date: "2024-01-12", percentage: 25, description: "Increased to 25%" },
      { date: "2024-01-14", percentage: 50, description: "Increased to 50%" },
      { date: "2024-01-15", percentage: 100, description: "Full rollout" },
    ],
    prePostMetrics: [
      { name: "Wishlist Adds", preValue: 2.3, postValue: 4.1, unit: "per user", isPercentage: false, higherIsBetter: true },
      { name: "Conversion Rate", preValue: 3.2, postValue: 4.8, unit: "%", isPercentage: true, higherIsBetter: true },
      { name: "Time on Page", preValue: 45, postValue: 62, unit: "sec", isPercentage: false, higherIsBetter: true },
      { name: "Bounce Rate", preValue: 42, postValue: 35, unit: "%", isPercentage: true, higherIsBetter: false },
    ],
    sessionReplays: generateSessionReplays(9),
    aiSummary: {
      overallSentiment: "positive",
      summary: "The new wishlist design is performing exceptionally well. Users are engaging more with the wishlist feature, leading to higher conversion rates and longer session times.",
      keyFindings: [
        "Wishlist additions increased by 78% compared to control group",
        "Users spend 38% more time on product pages with the new design",
        "Mobile users show the highest improvement in engagement metrics",
        "The animation reduces perceived latency and improves user satisfaction",
      ],
      recommendations: [
        "Consider full rollout based on positive metrics across all segments",
        "Monitor server load as wishlist API calls have increased significantly",
        "Add analytics tracking for wishlist-to-cart conversion funnel",
      ],
      notablePatterns: [
        "Peak wishlist usage occurs between 7-9 PM in all timezones",
        "Users who add to wishlist are 3x more likely to complete purchase within 7 days",
        "The new animations perform better on newer devices; consider graceful degradation",
      ],
    },
    variantPerformance: [
      { variant: "Control", conversionRate: 3.2, revenuePerUser: 24.50, engagementScore: 65, sampleSize: 6225 },
      { variant: "Treatment", conversionRate: 4.8, revenuePerUser: 31.20, engagementScore: 82, sampleSize: 6225 },
    ],
    segmentBreakdown: [
      { segment: "Desktop", count: 5600, percentage: 45, color: "#3b82f6" },
      { segment: "Mobile", count: 4980, percentage: 40, color: "#10b981" },
      { segment: "Tablet", count: 1870, percentage: 15, color: "#f59e0b" },
    ],
    funnelImpact: [
      { name: "View Product", controlCount: 10000, treatmentCount: 10000, controlRate: 100, treatmentRate: 100 },
      { name: "Add to Wishlist", controlCount: 2300, treatmentCount: 4100, controlRate: 23, treatmentRate: 41 },
      { name: "Add to Cart", controlCount: 1500, treatmentCount: 2400, controlRate: 15, treatmentRate: 24 },
      { name: "Purchase", controlCount: 320, treatmentCount: 480, controlRate: 3.2, treatmentRate: 4.8 },
    ],
    errorRateComparison: {
      controlErrorRate: 0.8,
      treatmentErrorRate: 0.6,
      errorTypes: [
        { type: "API Timeout", controlCount: 45, treatmentCount: 32 },
        { type: "Validation Error", controlCount: 23, treatmentCount: 18 },
        { type: "Network Error", controlCount: 12, treatmentCount: 10 },
      ],
    },
  },
  "flag-2": {
    flagId: "flag-2",
    flagKey: "enable_quick_add",
    totalExposures: 38750,
    uniqueUsersExposed: 9820,
    exposuresOverTime: generateExposureData(1200, 1.5),
    rolloutEvents: [
      { date: "2024-01-05", percentage: 25, description: "Initial rollout to 25%" },
      { date: "2024-01-10", percentage: 50, description: "Increased to 50%" },
      { date: "2024-01-18", percentage: 75, description: "Increased to 75%" },
    ],
    prePostMetrics: [
      { name: "Cart Adds", preValue: 1.8, postValue: 2.9, unit: "per session", isPercentage: false, higherIsBetter: true },
      { name: "Time to Cart", preValue: 8.5, postValue: 3.2, unit: "sec", isPercentage: false, higherIsBetter: false },
      { name: "Cart Abandonment", preValue: 68, postValue: 54, unit: "%", isPercentage: true, higherIsBetter: false },
      { name: "Revenue/Session", preValue: 12.40, postValue: 18.60, unit: "$", isPercentage: false, higherIsBetter: true },
    ],
    sessionReplays: generateSessionReplays(12),
    aiSummary: {
      overallSentiment: "positive",
      summary: "Quick add functionality is streamlining the shopping experience significantly. The reduced friction is leading to more cart additions and lower abandonment rates.",
      keyFindings: [
        "Time to add items to cart reduced by 62%",
        "Cart additions per session increased by 61%",
        "Particularly effective on mobile where modal interactions were problematic",
        "Users are adding more variety of items per session",
      ],
      recommendations: [
        "Proceed to full rollout after confirming checkout funnel metrics",
        "Consider adding quantity selector to quick-add for power users",
        "A/B test different button placements for optimal conversion",
      ],
      notablePatterns: [
        "Quick add is most used during lunch hours (12-2 PM)",
        "Repeat purchasers use quick add 3x more than new users",
        "Products with images see 40% higher quick-add usage",
      ],
    },
    variantPerformance: [
      { variant: "Control", conversionRate: 2.8, revenuePerUser: 12.40, engagementScore: 58, sampleSize: 3275 },
      { variant: "Treatment", conversionRate: 4.2, revenuePerUser: 18.60, engagementScore: 76, sampleSize: 6545 },
    ],
    segmentBreakdown: [
      { segment: "New Users", count: 2945, percentage: 30, color: "#8b5cf6" },
      { segment: "Returning", count: 4910, percentage: 50, color: "#06b6d4" },
      { segment: "Power Users", count: 1965, percentage: 20, color: "#ec4899" },
    ],
    funnelImpact: [
      { name: "View Product", controlCount: 10000, treatmentCount: 10000, controlRate: 100, treatmentRate: 100 },
      { name: "Hover Product", controlCount: 6500, treatmentCount: 7200, controlRate: 65, treatmentRate: 72 },
      { name: "Add to Cart", controlCount: 1800, treatmentCount: 2900, controlRate: 18, treatmentRate: 29 },
      { name: "Checkout", controlCount: 576, treatmentCount: 1334, controlRate: 5.76, treatmentRate: 13.34 },
    ],
    errorRateComparison: {
      controlErrorRate: 1.2,
      treatmentErrorRate: 0.9,
      errorTypes: [
        { type: "Stock Check Failed", controlCount: 67, treatmentCount: 51 },
        { type: "Cart Sync Error", controlCount: 34, treatmentCount: 28 },
        { type: "Price Mismatch", controlCount: 19, treatmentCount: 12 },
      ],
    },
  },
  "flag-4": {
    flagId: "flag-4",
    flagKey: "enable_express_pay",
    totalExposures: 28400,
    uniqueUsersExposed: 7150,
    exposuresOverTime: generateExposureData(900, 1),
    rolloutEvents: [
      { date: "2024-01-08", percentage: 10, description: "Initial rollout to returning customers" },
      { date: "2024-01-15", percentage: 25, description: "Expanded to 25%" },
      { date: "2024-01-20", percentage: 50, description: "Current: 50% rollout" },
    ],
    prePostMetrics: [
      { name: "Checkout Time", preValue: 180, postValue: 45, unit: "sec", isPercentage: false, higherIsBetter: false },
      { name: "Completion Rate", preValue: 72, postValue: 89, unit: "%", isPercentage: true, higherIsBetter: true },
      { name: "Repeat Purchases", preValue: 23, postValue: 34, unit: "%", isPercentage: true, higherIsBetter: true },
      { name: "Support Tickets", preValue: 2.1, postValue: 0.8, unit: "per 1000", isPercentage: false, higherIsBetter: false },
    ],
    sessionReplays: generateSessionReplays(15),
    aiSummary: {
      overallSentiment: "positive",
      summary: "Express checkout is dramatically improving the purchase experience for returning customers. The streamlined flow is driving higher completion rates and repeat purchases.",
      keyFindings: [
        "Checkout time reduced by 75% for express-enabled users",
        "Checkout completion rate improved by 24%",
        "Returning customers are 48% more likely to make repeat purchases",
        "Support tickets related to checkout decreased by 62%",
      ],
      recommendations: [
        "Continue gradual rollout while monitoring fraud signals",
        "Add express checkout to mobile app for parity",
        "Consider offering express checkout as incentive for account creation",
      ],
      notablePatterns: [
        "Express checkout usage peaks during flash sales",
        "Users with saved payment methods convert at 2x the rate",
        "Average order value is 15% higher with express checkout",
      ],
    },
    variantPerformance: [
      { variant: "Control", conversionRate: 72, revenuePerUser: 67.80, engagementScore: 70, sampleSize: 3575 },
      { variant: "Treatment", conversionRate: 89, revenuePerUser: 78.20, engagementScore: 91, sampleSize: 3575 },
    ],
    segmentBreakdown: [
      { segment: "VIP Customers", count: 1430, percentage: 20, color: "#f59e0b" },
      { segment: "Regular", count: 3575, percentage: 50, color: "#3b82f6" },
      { segment: "Occasional", count: 2145, percentage: 30, color: "#6b7280" },
    ],
    funnelImpact: [
      { name: "Cart Review", controlCount: 10000, treatmentCount: 10000, controlRate: 100, treatmentRate: 100 },
      { name: "Enter Shipping", controlCount: 8500, treatmentCount: 9800, controlRate: 85, treatmentRate: 98 },
      { name: "Enter Payment", controlCount: 7800, treatmentCount: 9500, controlRate: 78, treatmentRate: 95 },
      { name: "Complete Purchase", controlCount: 7200, treatmentCount: 8900, controlRate: 72, treatmentRate: 89 },
    ],
    errorRateComparison: {
      controlErrorRate: 2.1,
      treatmentErrorRate: 0.8,
      errorTypes: [
        { type: "Payment Declined", controlCount: 156, treatmentCount: 48 },
        { type: "Address Validation", controlCount: 89, treatmentCount: 22 },
        { type: "Session Timeout", controlCount: 67, treatmentCount: 10 },
      ],
    },
  },
  "flag-8": {
    flagId: "flag-8",
    flagKey: "new_profile_tabs",
    totalExposures: 52100,
    uniqueUsersExposed: 14200,
    exposuresOverTime: generateExposureData(1700, 0.5),
    rolloutEvents: [
      { date: "2024-01-02", percentage: 50, description: "Initial 50% rollout" },
      { date: "2024-01-10", percentage: 75, description: "Increased to 75%" },
      { date: "2024-01-16", percentage: 100, description: "Full rollout" },
    ],
    prePostMetrics: [
      { name: "Profile Views", preValue: 2.1, postValue: 3.4, unit: "per session", isPercentage: false, higherIsBetter: true },
      { name: "Settings Changed", preValue: 0.8, postValue: 1.4, unit: "per user", isPercentage: false, higherIsBetter: true },
      { name: "Nav Errors", preValue: 3.2, postValue: 0.8, unit: "%", isPercentage: true, higherIsBetter: false },
      { name: "Task Completion", preValue: 76, postValue: 92, unit: "%", isPercentage: true, higherIsBetter: true },
    ],
    sessionReplays: generateSessionReplays(8),
    aiSummary: {
      overallSentiment: "positive",
      summary: "The redesigned profile tabs are significantly improving user navigation and task completion. Users are finding settings more easily and engaging more with profile customization.",
      keyFindings: [
        "Navigation errors reduced by 75%",
        "Users complete profile-related tasks 21% faster",
        "Settings engagement increased by 75%",
        "Positive feedback in user surveys increased by 40%",
      ],
      recommendations: [
        "Keep current design as default going forward",
        "Apply similar tab patterns to other complex pages",
        "Consider adding keyboard shortcuts for power users",
      ],
      notablePatterns: [
        "New users adapt to the interface faster than the old design",
        "Most accessed tabs: Account > Security > Preferences",
        "Tab switching is 60% more frequent, indicating better discoverability",
      ],
    },
    variantPerformance: [
      { variant: "Control", conversionRate: 76, revenuePerUser: 0, engagementScore: 62, sampleSize: 0 },
      { variant: "Treatment", conversionRate: 92, revenuePerUser: 0, engagementScore: 85, sampleSize: 14200 },
    ],
    segmentBreakdown: [
      { segment: "Free Users", count: 8520, percentage: 60, color: "#6b7280" },
      { segment: "Pro Users", count: 4260, percentage: 30, color: "#3b82f6" },
      { segment: "Enterprise", count: 1420, percentage: 10, color: "#8b5cf6" },
    ],
    funnelImpact: [
      { name: "Open Profile", controlCount: 10000, treatmentCount: 10000, controlRate: 100, treatmentRate: 100 },
      { name: "Navigate to Tab", controlCount: 6800, treatmentCount: 8900, controlRate: 68, treatmentRate: 89 },
      { name: "Make Change", controlCount: 4200, treatmentCount: 6700, controlRate: 42, treatmentRate: 67 },
      { name: "Save Successfully", controlCount: 3800, treatmentCount: 6200, controlRate: 38, treatmentRate: 62 },
    ],
    errorRateComparison: {
      controlErrorRate: 3.2,
      treatmentErrorRate: 0.8,
      errorTypes: [
        { type: "Tab Load Failed", controlCount: 234, treatmentCount: 45 },
        { type: "Save Error", controlCount: 89, treatmentCount: 34 },
        { type: "Validation Error", controlCount: 67, treatmentCount: 35 },
      ],
    },
  },
};

// Get insights for a specific flag
export function getFlagInsights(flagId: string): FlagInsights | null {
  return flagInsights[flagId] || null;
}

// Get insights by flag key
export function getFlagInsightsByKey(flagKey: string): FlagInsights | null {
  return Object.values(flagInsights).find((insight) => insight.flagKey === flagKey) || null;
}
