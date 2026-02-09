"use client";

import { useState } from "react";
import { FeatureFlag, FlagStatus } from "@/lib/mock-data/feature-flags";
import {
  FlagInsights,
  getFlagInsights,
  RolloutEvent,
} from "@/lib/mock-data/flag-insights";
import { SessionReplay } from "@/lib/mock-data/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Eye,
  Sparkles,
  Play,
  Monitor,
  Smartphone,
  Tablet,
  BarChart3,
  PieChart,
  GitBranch,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Target,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Cell,
  PieChart as RechartsPie,
  Pie,
} from "recharts";
import { cn } from "@/lib/utils";

interface FlagInsightsDashboardProps {
  flag: FeatureFlag;
  onClose: () => void;
}

const statusConfig: Record<FlagStatus, { label: string; color: string; bgColor: string }> = {
  active: { label: "Active", color: "text-green-500", bgColor: "bg-green-500/10" },
  inactive: { label: "Inactive", color: "text-gray-400", bgColor: "bg-gray-500/10" },
  rolled_out: { label: "Rolled Out", color: "text-blue-500", bgColor: "bg-blue-500/10" },
  stale: { label: "Stale", color: "text-orange-500", bgColor: "bg-orange-500/10" },
};

function SessionReplayThumbnail({ replay }: { replay: SessionReplay }) {
  const DeviceIcon = {
    desktop: Monitor,
    mobile: Smartphone,
    tablet: Tablet,
  }[replay.deviceType];

  return (
    <button
      className="group relative aspect-video rounded-lg overflow-hidden border border-border hover:border-blue-500/50 transition-all hover:scale-105"
      onClick={() => console.log("Opening replay:", replay.id)}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", replay.thumbnailColor)} />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center">
          <Play className="h-4 w-4 text-black fill-black ml-0.5" />
        </div>
      </div>
      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-xs font-medium bg-black/70 text-white">
        {replay.duration}
      </div>
      <div className="absolute top-1 left-1 flex items-center gap-1">
        <DeviceIcon className="h-3 w-3 text-white/80" />
        <span className="text-[10px] text-white/80">{replay.userSegment}</span>
      </div>
    </button>
  );
}

function MetricCard({
  metric,
}: {
  metric: { name: string; preValue: number; postValue: number; unit: string; isPercentage: boolean; higherIsBetter: boolean };
}) {
  const change = ((metric.postValue - metric.preValue) / metric.preValue) * 100;
  const isPositive = metric.higherIsBetter ? change > 0 : change < 0;
  const isNeutral = Math.abs(change) < 1;

  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground mb-2">{metric.name}</p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold">
              {metric.isPercentage ? `${metric.postValue}%` : `${metric.postValue}${metric.unit}`}
            </p>
            <p className="text-xs text-muted-foreground">
              was {metric.isPercentage ? `${metric.preValue}%` : `${metric.preValue}${metric.unit}`}
            </p>
          </div>
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium",
            isNeutral ? "bg-gray-500/10 text-gray-400" :
            isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
            {isNeutral ? (
              <Minus className="h-3 w-3" />
            ) : isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(change).toFixed(1)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ExposuresChart({ insights, rolloutEvents }: { insights: FlagInsights; rolloutEvents: RolloutEvent[] }) {
  const data = insights.exposuresOverTime.map((point) => ({
    ...point,
    date: new Date(point.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  // Find rollout event dates for reference lines
  const eventDates = rolloutEvents.map((event) => ({
    date: new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    percentage: event.percentage,
    description: event.description,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-500" />
            Exposures Over Time
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Exposures</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-500" />
              <span className="text-muted-foreground">Unique Users</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 25, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => v.toLocaleString()} />
              <Tooltip
                contentStyle={{
                  background: "#1a1a2e",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              {eventDates.map((event, i) => (
                <ReferenceLine
                  key={i}
                  x={event.date}
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                  label={{
                    value: `${event.percentage}%`,
                    position: "insideTopRight",
                    fill: "#f59e0b",
                    fontSize: 10,
                    offset: 5,
                  }}
                />
              ))}
              <Line type="monotone" dataKey="exposures" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="uniqueUsers" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Rollout Events Legend */}
        <div className="mt-4 flex flex-wrap gap-2">
          {rolloutEvents.map((event, i) => (
            <Badge key={i} variant="outline" className="text-xs bg-orange-500/10 text-orange-400 border-orange-500/30">
              {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}: {event.description}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function VariantPerformanceChart({ insights }: { insights: FlagInsights }) {
  const metrics = [
    { key: "conversionRate", label: "Conversion Rate", unit: "%" },
    { key: "engagementScore", label: "Engagement Score", unit: "" },
  ];

  const data = metrics.map((metric) => ({
    metric: metric.label,
    Control: insights.variantPerformance[0]?.[metric.key as keyof typeof insights.variantPerformance[0]] || 0,
    Treatment: insights.variantPerformance[1]?.[metric.key as keyof typeof insights.variantPerformance[0]] || 0,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-purple-500" />
          Variant Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="metric" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={100} />
              <Tooltip
                contentStyle={{
                  background: "#1a1a2e",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="Control" fill="#6b7280" radius={[0, 4, 4, 0]} barSize={16} />
              <Bar dataKey="Treatment" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="h-3 w-3 rounded bg-gray-500" />
            <span className="text-muted-foreground">Control</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-3 w-3 rounded bg-blue-500" />
            <span className="text-muted-foreground">Treatment</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SegmentBreakdownChart({ insights }: { insights: FlagInsights }) {
  const data = insights.segmentBreakdown;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <PieChart className="h-4 w-4 text-teal-500" />
          User Segment Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="h-40 w-40">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="segment"
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={2}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#1a1a2e",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2 ml-4">
            {data.map((segment) => (
              <div key={segment.segment} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.color }} />
                  <span>{segment.segment}</span>
                </div>
                <div className="text-muted-foreground">
                  {segment.count.toLocaleString()} ({segment.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FunnelImpact({ insights }: { insights: FlagInsights }) {
  const data = insights.funnelImpact;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-4 w-4 text-orange-500" />
          Funnel Impact
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((step, index) => {
            const improvement = step.treatmentRate - step.controlRate;
            const isPositive = improvement > 0;
            return (
              <div key={step.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{step.name}</span>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    isPositive ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-400"
                  )}>
                    {isPositive ? "+" : ""}{improvement.toFixed(1)}%
                  </span>
                </div>
                <div className="flex gap-1 h-4">
                  <div className="flex-1 bg-muted rounded-l overflow-hidden">
                    <div
                      className="h-full bg-gray-500 transition-all"
                      style={{ width: `${step.controlRate}%` }}
                    />
                  </div>
                  <div className="flex-1 bg-muted rounded-r overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${step.treatmentRate}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Control: {step.controlRate}%</span>
                  <span>Treatment: {step.treatmentRate}%</span>
                </div>
                {index < data.length - 1 && <Separator className="mt-2" />}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ErrorRateComparison({ insights }: { insights: FlagInsights }) {
  const { controlErrorRate, treatmentErrorRate, errorTypes } = insights.errorRateComparison;
  const improvement = ((controlErrorRate - treatmentErrorRate) / controlErrorRate) * 100;
  const isImproved = treatmentErrorRate < controlErrorRate;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          Error Rate Impact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-gray-400">{controlErrorRate}%</p>
            <p className="text-xs text-muted-foreground">Control</p>
          </div>
          <div className="px-4">
            <div className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
              isImproved ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
            )}>
              {isImproved ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
              {Math.abs(improvement).toFixed(0)}%
            </div>
          </div>
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-blue-500">{treatmentErrorRate}%</p>
            <p className="text-xs text-muted-foreground">Treatment</p>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Error Breakdown</p>
          {errorTypes.map((error) => (
            <div key={error.type} className="flex items-center justify-between text-sm">
              <span>{error.type}</span>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-gray-400">{error.controlCount}</span>
                <span className="text-blue-400">{error.treatmentCount}</span>
                {error.treatmentCount < error.controlCount && (
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function FlagInsightsDashboard({ flag, onClose }: FlagInsightsDashboardProps) {
  const insights = getFlagInsights(flag.id);
  const config = statusConfig[flag.status];
  const [selectedReplayFilter, setSelectedReplayFilter] = useState<string>("all");

  if (!insights) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
          <div>
            <p className="text-lg font-medium">No insights available</p>
            <p className="text-sm text-muted-foreground">This feature flag doesn&apos;t have analytics data yet.</p>
          </div>
          <Button variant="outline" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Editor
          </Button>
        </div>
      </div>
    );
  }

  const filteredReplays = selectedReplayFilter === "all"
    ? insights.sessionReplays
    : insights.sessionReplays.filter((r) => r.deviceType === selectedReplayFilter);

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{flag.name}</h1>
                <Badge variant="outline" className={cn("text-sm", config.color, config.bgColor)}>
                  {config.label}
                </Badge>
              </div>
              <code className="text-sm text-muted-foreground font-mono">{flag.key}</code>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold">{insights.totalExposures.toLocaleString()}</p>
              <p className="text-muted-foreground flex items-center gap-1">
                <Eye className="h-3 w-3" /> Total Exposures
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{insights.uniqueUsersExposed.toLocaleString()}</p>
              <p className="text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" /> Unique Users
              </p>
            </div>
          </div>
        </div>

        {/* Exposures Chart */}
        <ExposuresChart insights={insights} rolloutEvents={insights.rolloutEvents} />

        {/* Pre-Post Metrics */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Pre-Post Metric Analysis
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {insights.prePostMetrics.map((metric) => (
              <MetricCard key={metric.name} metric={metric} />
            ))}
          </div>
        </div>

        {/* Session Replays */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Play className="h-5 w-5 text-pink-500" />
              Session Replays
            </h2>
            <div className="flex items-center gap-2">
              {["all", "desktop", "mobile", "tablet"].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedReplayFilter === filter ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedReplayFilter(filter)}
                  className="text-xs capitalize"
                >
                  {filter === "all" ? "All" : filter}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            {filteredReplays.slice(0, 6).map((replay) => (
              <SessionReplayThumbnail key={replay.id} replay={replay} />
            ))}
          </div>
          {filteredReplays.length > 6 && (
            <Button variant="ghost" className="w-full text-sm text-muted-foreground">
              View all {filteredReplays.length} session replays
            </Button>
          )}
        </div>

        {/* AI Summary */}
        <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI-Generated Summary
              <Badge variant="outline" className={cn(
                "ml-2 text-xs",
                insights.aiSummary.overallSentiment === "positive" ? "text-green-500 bg-green-500/10" :
                insights.aiSummary.overallSentiment === "negative" ? "text-red-500 bg-red-500/10" :
                "text-gray-400 bg-gray-500/10"
              )}>
                {insights.aiSummary.overallSentiment.charAt(0).toUpperCase() + insights.aiSummary.overallSentiment.slice(1)} Impact
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">{insights.aiSummary.summary}</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Key Findings
                </h4>
                <ul className="space-y-1">
                  {insights.aiSummary.keyFindings.map((finding, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-green-500 mt-1">-</span>
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {insights.aiSummary.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">-</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  Notable Patterns
                </h4>
                <ul className="space-y-1">
                  {insights.aiSummary.notablePatterns.map((pattern, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-blue-500 mt-1">-</span>
                      {pattern}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Insights Grid */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Additional Insights</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <VariantPerformanceChart insights={insights} />
            <SegmentBreakdownChart insights={insights} />
            <FunnelImpact insights={insights} />
            <ErrorRateComparison insights={insights} />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
