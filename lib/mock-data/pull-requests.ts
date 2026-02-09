// Mock data for PR dashboard

export type PRStatus = "open" | "approved" | "changes_requested" | "needs_review";
export type PRCategory = "bug" | "feature" | "refactor" | "docs" | "chore";
export type CIStatus = "passing" | "failing" | "pending";

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  repo: string;
  author: string;
  authorAvatar?: string;
  status: PRStatus;
  category: PRCategory;
  createdAt: string;
  updatedAt: string;
  reviewers: string[];
  ciStatus: CIStatus;
  additions: number;
  deletions: number;
  comments: number;
}

export interface CategoryBreakdown {
  category: PRCategory;
  count: number;
  color: string;
}

export interface PRStats {
  openPRs: PullRequest[];
  reviewRequests: PullRequest[];
  mergedLast30Days: number;
  createdLast30Days: number;
  categoryBreakdown: CategoryBreakdown[];
  previousPeriodMerged: number;
  previousPeriodCreated: number;
  avgReviewTime: string;
  approvalRate: number;
  currentStreak: number;
}

// Helper to calculate days ago
function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

// Mock open PRs (user's own PRs waiting to be merged)
export const openPRs: PullRequest[] = [
  {
    id: "pr-1",
    number: 1247,
    title: "Fix checkout validation race condition",
    repo: "frontend",
    author: "you",
    status: "approved",
    category: "bug",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(0),
    reviewers: ["sarah.chen", "mike.johnson"],
    ciStatus: "passing",
    additions: 45,
    deletions: 12,
    comments: 8,
  },
  {
    id: "pr-2",
    number: 1243,
    title: "Add wishlist animation transitions",
    repo: "frontend",
    author: "you",
    status: "needs_review",
    category: "feature",
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
    reviewers: ["alex.wong"],
    ciStatus: "passing",
    additions: 120,
    deletions: 34,
    comments: 3,
  },
  {
    id: "pr-3",
    number: 892,
    title: "Refactor payment service error handling",
    repo: "backend",
    author: "you",
    status: "changes_requested",
    category: "refactor",
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
    reviewers: ["payments-team"],
    ciStatus: "passing",
    additions: 234,
    deletions: 189,
    comments: 12,
  },
];

// Mock review requests (PRs from others awaiting user's review)
export const reviewRequests: PullRequest[] = [
  {
    id: "pr-review-1",
    number: 1250,
    title: "Implement new user onboarding flow",
    repo: "frontend",
    author: "sarah.chen",
    status: "needs_review",
    category: "feature",
    createdAt: daysAgo(1),
    updatedAt: daysAgo(0),
    reviewers: ["you", "mike.johnson"],
    ciStatus: "passing",
    additions: 456,
    deletions: 23,
    comments: 5,
  },
  {
    id: "pr-review-2",
    number: 1248,
    title: "Fix memory leak in session handler",
    repo: "backend",
    author: "alex.wong",
    status: "needs_review",
    category: "bug",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(0),
    reviewers: ["you"],
    ciStatus: "passing",
    additions: 28,
    deletions: 15,
    comments: 2,
  },
  {
    id: "pr-review-3",
    number: 1241,
    title: "Update API documentation for v2 endpoints",
    repo: "docs",
    author: "mike.johnson",
    status: "needs_review",
    category: "docs",
    createdAt: daysAgo(4),
    updatedAt: daysAgo(3),
    reviewers: ["you", "sarah.chen"],
    ciStatus: "passing",
    additions: 890,
    deletions: 120,
    comments: 0,
  },
  {
    id: "pr-review-4",
    number: 887,
    title: "Add rate limiting to public API",
    repo: "backend",
    author: "security-team",
    status: "needs_review",
    category: "feature",
    createdAt: daysAgo(5),
    updatedAt: daysAgo(4),
    reviewers: ["you", "alex.wong"],
    ciStatus: "pending",
    additions: 156,
    deletions: 12,
    comments: 7,
  },
  {
    id: "pr-review-5",
    number: 1239,
    title: "Cleanup unused CSS variables",
    repo: "frontend",
    author: "design-team",
    status: "needs_review",
    category: "chore",
    createdAt: daysAgo(6),
    updatedAt: daysAgo(5),
    reviewers: ["you"],
    ciStatus: "passing",
    additions: 0,
    deletions: 234,
    comments: 1,
  },
];

// Category breakdown for merged PRs
export const categoryBreakdown: CategoryBreakdown[] = [
  { category: "feature", count: 5, color: "bg-blue-500/10 text-blue-500" },
  { category: "bug", count: 4, color: "bg-red-500/10 text-red-500" },
  { category: "refactor", count: 2, color: "bg-purple-500/10 text-purple-500" },
  { category: "docs", count: 1, color: "bg-green-500/10 text-green-500" },
  { category: "chore", count: 0, color: "bg-gray-500/10 text-gray-400" },
];

// Aggregated PR stats
export const prStats: PRStats = {
  openPRs,
  reviewRequests,
  mergedLast30Days: 12,
  createdLast30Days: 15,
  categoryBreakdown,
  previousPeriodMerged: 9,
  previousPeriodCreated: 11,
  avgReviewTime: "4.2h",
  approvalRate: 94,
  currentStreak: 8,
};

// Helper functions
export function getOpenPRsCount(): number {
  return openPRs.length;
}

export function getReviewRequestsCount(): number {
  return reviewRequests.length;
}

export function getOldReviewRequests(daysThreshold: number = 3): PullRequest[] {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - daysThreshold);
  return reviewRequests.filter((pr) => new Date(pr.createdAt) < threshold);
}

export function getOpenPRsByStatus(): { approved: number; needsReview: number; changesRequested: number } {
  return {
    approved: openPRs.filter((pr) => pr.status === "approved").length,
    needsReview: openPRs.filter((pr) => pr.status === "needs_review").length,
    changesRequested: openPRs.filter((pr) => pr.status === "changes_requested").length,
  };
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffDays > 0) {
    return `${diffDays}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else {
    return "just now";
  }
}
