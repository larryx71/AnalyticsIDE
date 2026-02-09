"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GitPullRequest,
  Eye,
  GitMerge,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  prStats,
  PullRequest,
  formatTimeAgo,
  getOpenPRsByStatus,
  getOldReviewRequests,
  CategoryBreakdown,
} from "@/lib/mock-data/pull-requests";

// Status icon component
function PRStatusIcon({ status }: { status: PullRequest["status"] }) {
  switch (status) {
    case "approved":
      return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />;
    case "needs_review":
      return <Clock className="h-3.5 w-3.5 text-yellow-500" />;
    case "changes_requested":
      return <AlertCircle className="h-3.5 w-3.5 text-orange-500" />;
    default:
      return <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
  }
}

// PR Preview Item for compact lists
function PRPreviewItem({ pr, showAuthor = false, isOld = false }: { pr: PullRequest; showAuthor?: boolean; isOld?: boolean }) {
  const timeAgo = formatTimeAgo(pr.createdAt);

  return (
    <div className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors">
      {showAuthor ? (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
          {pr.author.charAt(0).toUpperCase()}
        </div>
      ) : (
        <PRStatusIcon status={pr.status} />
      )}
      <span className="flex-1 text-xs truncate">{pr.title}</span>
      <span className={cn(
        "text-[10px] shrink-0",
        isOld && showAuthor ? "text-orange-500" : "text-muted-foreground"
      )}>
        {timeAgo}
      </span>
    </div>
  );
}

// Card 1: Your Open PRs
function OpenPRsCard() {
  const { openPRs } = prStats;
  const statusCounts = getOpenPRsByStatus();
  const count = openPRs.length;

  const statusSummary = [];
  if (statusCounts.approved > 0) statusSummary.push(`${statusCounts.approved} approved`);
  if (statusCounts.needsReview > 0) statusSummary.push(`${statusCounts.needsReview} needs review`);
  if (statusCounts.changesRequested > 0) statusSummary.push(`${statusCounts.changesRequested} needs changes`);

  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground">Your Open PRs</p>
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {statusSummary.join(", ") || "No open PRs"}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
            <GitPullRequest className="h-5 w-5" />
          </div>
        </div>
        
        {openPRs.length > 0 && (
          <div className="space-y-0.5 border-t border-border/50 pt-2 mt-2">
            {openPRs.slice(0, 3).map((pr) => (
              <PRPreviewItem key={pr.id} pr={pr} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Card 2: Review Requests
function ReviewRequestsCard() {
  const { reviewRequests } = prStats;
  const oldRequests = getOldReviewRequests(3);
  const count = reviewRequests.length;

  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground">Review Requests</p>
            <p className="text-2xl font-bold">{count}</p>
            <p className={cn(
              "text-xs mt-1",
              oldRequests.length > 0 ? "text-orange-500" : "text-muted-foreground"
            )}>
              {oldRequests.length > 0
                ? `${oldRequests.length} waiting 3+ days`
                : "All reviews are recent"}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-500">
            <Eye className="h-5 w-5" />
          </div>
        </div>
        
        {reviewRequests.length > 0 && (
          <div className="space-y-0.5 border-t border-border/50 pt-2 mt-2">
            {reviewRequests.slice(0, 3).map((pr) => (
              <PRPreviewItem 
                key={pr.id} 
                pr={pr} 
                showAuthor 
                isOld={oldRequests.some((old) => old.id === pr.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Category pill component
function CategoryPill({ breakdown }: { breakdown: CategoryBreakdown }) {
  if (breakdown.count === 0) return null;
  
  const labels: Record<string, string> = {
    feature: "Feature",
    bug: "Bug",
    refactor: "Refactor",
    docs: "Docs",
    chore: "Chore",
  };

  return (
    <Badge variant="outline" className={cn("text-[10px] font-medium", breakdown.color)}>
      {labels[breakdown.category]}: {breakdown.count}
    </Badge>
  );
}

// Card 3: PRs Merged (30d)
function MergedPRsCard() {
  const { mergedLast30Days, previousPeriodMerged, categoryBreakdown } = prStats;
  const change = mergedLast30Days - previousPeriodMerged;
  const isPositive = change >= 0;

  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground">PRs Merged (30d)</p>
            <p className="text-2xl font-bold">{mergedLast30Days}</p>
            <div className="flex items-center gap-1 mt-1">
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500" />
              )}
              <span className={cn(
                "text-xs",
                isPositive ? "text-green-500" : "text-red-500"
              )}>
                {isPositive ? "+" : ""}{change} from last month
              </span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
            <GitMerge className="h-5 w-5" />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5 border-t border-border/50 pt-3 mt-2">
          {categoryBreakdown.map((breakdown) => (
            <CategoryPill key={breakdown.category} breakdown={breakdown} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Card 4: Contribution Stats
function ContributionCard() {
  const { createdLast30Days, previousPeriodCreated, avgReviewTime, approvalRate, currentStreak } = prStats;
  const changePercent = Math.round(((createdLast30Days - previousPeriodCreated) / previousPeriodCreated) * 100);
  const isPositive = changePercent >= 0;

  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground">PRs Created (30d)</p>
            <p className="text-2xl font-bold">{createdLast30Days}</p>
            <div className="flex items-center gap-1 mt-1">
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500" />
              )}
              <span className={cn(
                "text-xs",
                isPositive ? "text-green-500" : "text-red-500"
              )}>
                {isPositive ? "+" : ""}{changePercent}% vs last month
              </span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 border-t border-border/50 pt-3 mt-2">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium">{avgReviewTime}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Avg Review</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              <span className="text-xs font-medium">{approvalRate}%</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Approval</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Flame className="h-3 w-3 text-orange-500" />
              <span className="text-xs font-medium">{currentStreak}d</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Streak</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PRStatsOverview() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <OpenPRsCard />
      <ReviewRequestsCard />
      <MergedPRsCard />
      <ContributionCard />
    </div>
  );
}
