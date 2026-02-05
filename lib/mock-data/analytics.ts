// Mock analytics data for each file

export interface SessionReplay {
  id: string;
  thumbnailColor: string; // Using gradient colors as placeholder for real thumbnails
  duration: string;
  timestamp: string;
  userId: string;
  userSegment: string;
  deviceType: "desktop" | "mobile" | "tablet";
}

export interface AnalyticsEvent {
  name: string;
  line: number;
  endLine?: number;
  dailyCount: number;
  weeklyTrend: number; // percentage change
  conversionRate?: number;
  errorRate?: number;
  avgTimeToTrigger?: number; // seconds
  topUserSegments?: string[];
  sessionReplays?: SessionReplay[];
}

// Helper to generate mock session replays
function generateSessionReplays(eventName: string, count: number = 3): SessionReplay[] {
  const colors = [
    "from-blue-500 to-purple-600",
    "from-green-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-pink-500 to-rose-600",
    "from-indigo-500 to-blue-600",
  ];
  const segments = ["Returning Customer", "New User", "Mobile User", "Power User", "First-time Buyer"];
  const devices: ("desktop" | "mobile" | "tablet")[] = ["desktop", "mobile", "tablet"];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `${eventName}-replay-${i + 1}`,
    thumbnailColor: colors[i % colors.length],
    duration: `${Math.floor(Math.random() * 3) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: `user_${Math.random().toString(36).substring(2, 8)}`,
    userSegment: segments[Math.floor(Math.random() * segments.length)],
    deviceType: devices[Math.floor(Math.random() * devices.length)],
  }));
}

export interface FileAnalytics {
  fileName: string;
  path: string;
  totalEvents: number;
  totalDailyTriggers: number;
  events: AnalyticsEvent[];
  insights: string[];
}

export const fileAnalytics: Record<string, FileAnalytics> = {
  "ProductCard.tsx": {
    fileName: "ProductCard.tsx",
    path: "src/components/ProductCard.tsx",
    totalEvents: 3,
    totalDailyTriggers: 18521,
    events: [
      {
        name: "product_viewed",
        line: 17,
        endLine: 21,
        dailyCount: 12453,
        weeklyTrend: 8.5,
        avgTimeToTrigger: 0.3,
        topUserSegments: ["Returning Customers", "Mobile Users"],
        sessionReplays: generateSessionReplays("product_viewed", 3),
      },
      {
        name: "add_to_cart_clicked",
        line: 24,
        endLine: 30,
        dailyCount: 3211,
        weeklyTrend: 12.3,
        conversionRate: 0.258,
        topUserSegments: ["High-Value Customers", "Desktop Users"],
        sessionReplays: generateSessionReplays("add_to_cart_clicked", 3),
      },
      {
        name: "wishlist_toggled",
        line: 36,
        endLine: 39,
        dailyCount: 2857,
        weeklyTrend: -3.2,
        topUserSegments: ["New Users", "Browse-Only"],
        sessionReplays: generateSessionReplays("wishlist_toggled", 2),
      },
    ],
    insights: [
      "Users who view products on mobile convert 23% less than desktop users",
      "Products viewed > 3 times by same user have 4x higher conversion",
      "Wishlist additions peak on Sundays between 8-10 PM",
    ],
  },
  "CheckoutFlow.tsx": {
    fileName: "CheckoutFlow.tsx",
    path: "src/components/CheckoutFlow.tsx",
    totalEvents: 7,
    totalDailyTriggers: 8934,
    events: [
      {
        name: "checkout_started",
        line: 28,
        endLine: 31,
        dailyCount: 3211,
        weeklyTrend: 5.2,
        conversionRate: 0.67,
        topUserSegments: ["Cart > $50", "Returning"],
        sessionReplays: generateSessionReplays("checkout_started", 3),
      },
      {
        name: "checkout_error",
        line: 70,
        endLine: 74,
        dailyCount: 487,
        weeklyTrend: 15.8,
        errorRate: 0.152,
        topUserSegments: ["Mobile Users", "New Users"],
        sessionReplays: generateSessionReplays("checkout_error", 4),
      },
      {
        name: "checkout_step_completed",
        line: 79,
        endLine: 82,
        dailyCount: 2891,
        weeklyTrend: 3.1,
        topUserSegments: ["Desktop Users", "Returning"],
        sessionReplays: generateSessionReplays("checkout_step_completed", 2),
      },
      {
        name: "payment_submitted",
        line: 93,
        endLine: 96,
        dailyCount: 2156,
        weeklyTrend: 4.8,
        topUserSegments: ["High-Value Customers"],
        sessionReplays: generateSessionReplays("payment_submitted", 3),
      },
      {
        name: "order_completed",
        line: 101,
        endLine: 105,
        dailyCount: 1987,
        weeklyTrend: 6.2,
        conversionRate: 0.618,
        topUserSegments: ["Returning Customers", "Desktop Users"],
        sessionReplays: generateSessionReplays("order_completed", 3),
      },
      {
        name: "payment_failed",
        line: 108,
        endLine: 111,
        dailyCount: 169,
        weeklyTrend: 22.4,
        errorRate: 0.078,
        topUserSegments: ["International Users", "New Cards"],
        sessionReplays: generateSessionReplays("payment_failed", 4),
      },
    ],
    insights: [
      "15.2% error rate on shipping validation - mostly invalid phone formats",
      "Payment failures increased 22% this week - investigate card validation",
      "Mobile users abandon checkout 34% more than desktop at payment step",
      "Average checkout completion time: 4.2 minutes",
    ],
  },
  "UserProfile.tsx": {
    fileName: "UserProfile.tsx",
    path: "src/components/UserProfile.tsx",
    totalEvents: 7,
    totalDailyTriggers: 5621,
    events: [
      {
        name: "profile_viewed",
        line: 14,
        endLine: 17,
        dailyCount: 2341,
        weeklyTrend: 2.1,
        topUserSegments: ["Active Users", "Post-Purchase"],
        sessionReplays: generateSessionReplays("profile_viewed", 3),
      },
      {
        name: "profile_tab_changed",
        line: 25,
        endLine: 28,
        dailyCount: 1876,
        weeklyTrend: -1.4,
        topUserSegments: ["Power Users"],
        sessionReplays: generateSessionReplays("profile_tab_changed", 2),
      },
      {
        name: "profile_edit_started",
        line: 33,
        endLine: 35,
        dailyCount: 567,
        weeklyTrend: 8.9,
        topUserSegments: ["New Users"],
        sessionReplays: generateSessionReplays("profile_edit_started", 3),
      },
      {
        name: "profile_updated",
        line: 41,
        endLine: 44,
        dailyCount: 423,
        weeklyTrend: 7.2,
        conversionRate: 0.746,
        topUserSegments: ["New Users", "Active Users"],
        sessionReplays: generateSessionReplays("profile_updated", 2),
      },
      {
        name: "profile_update_failed",
        line: 48,
        endLine: 51,
        dailyCount: 144,
        weeklyTrend: 12.3,
        errorRate: 0.254,
        topUserSegments: ["Mobile Users"],
        sessionReplays: generateSessionReplays("profile_update_failed", 4),
      },
      {
        name: "notification_preference_changed",
        line: 56,
        endLine: 59,
        dailyCount: 234,
        weeklyTrend: 15.6,
        topUserSegments: ["Privacy-Conscious"],
        sessionReplays: generateSessionReplays("notification_preference_changed", 2),
      },
      {
        name: "account_deletion_initiated",
        line: 63,
        endLine: 65,
        dailyCount: 36,
        weeklyTrend: -8.2,
        topUserSegments: ["Churning Users"],
        sessionReplays: generateSessionReplays("account_deletion_initiated", 3),
      },
    ],
    insights: [
      "25% of profile edit attempts fail - mostly on mobile devices",
      "Settings tab is rarely visited (< 5% of profile views)",
      "Account deletion requests down 8% this week",
      "Users who update profiles have 3x higher retention",
    ],
  },
};

export interface TrendDataPoint {
  date: string;
  value: number;
}

export function generateTrendData(
  baseValue: number,
  days: number = 14
): TrendDataPoint[] {
  const data: TrendDataPoint[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const variance = (Math.random() - 0.5) * 0.3 * baseValue;
    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(baseValue + variance),
    });
  }

  return data;
}
