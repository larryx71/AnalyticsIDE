"use client";

import { useState } from "react";
import { FileAnalytics, generateTrendData, SessionReplay } from "@/lib/mock-data/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ChevronRight,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Lightbulb,
  BarChart3,
  AlertCircle,
  Play,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { cn } from "@/lib/utils";

interface AnalyticsPanelProps {
  analytics: FileAnalytics | null;
  highlightedEvent?: string | null;
}

function SessionReplayThumbnail({ replay }: { replay: SessionReplay }) {
  const DeviceIcon = {
    desktop: Monitor,
    mobile: Smartphone,
    tablet: Tablet,
  }[replay.deviceType];

  return (
    <button
      className="group relative aspect-video rounded-md overflow-hidden border border-border hover:border-blue-500/50 transition-all hover:scale-105"
      onClick={() => {
        // In a real app, this would open the session replay player
        console.log("Opening replay:", replay.id);
      }}
    >
      {/* Thumbnail placeholder with gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br",
        replay.thumbnailColor
      )} />
      
      {/* Play overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="h-6 w-6 rounded-full bg-white/90 flex items-center justify-center">
          <Play className="h-3 w-3 text-black fill-black ml-0.5" />
        </div>
      </div>

      {/* Duration badge */}
      <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded text-[10px] font-medium bg-black/70 text-white">
        {replay.duration}
      </div>

      {/* Device icon */}
      <div className="absolute top-1 left-1">
        <DeviceIcon className="h-3 w-3 text-white/80" />
      </div>
    </button>
  );
}

export function AnalyticsPanel({
  analytics,
  highlightedEvent,
}: AnalyticsPanelProps) {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  if (!analytics) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
        <div className="space-y-2">
          <BarChart3 className="h-12 w-12 mx-auto opacity-50" />
          <p>Select a file to view analytics</p>
        </div>
      </div>
    );
  }

  const toggleEvent = (eventName: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventName)) {
      newExpanded.delete(eventName);
    } else {
      newExpanded.add(eventName);
    }
    setExpandedEvents(newExpanded);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* Header Stats */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daily Triggers</p>
                <p className="text-2xl font-bold">
                  {analytics.totalDailyTriggers.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Events</p>
                <p className="text-2xl font-bold">{analytics.totalEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Tracked Events
          </h3>

          {analytics.events.map((event) => {
            const isExpanded = expandedEvents.has(event.name);
            const isHighlighted = highlightedEvent === event.name;
            const trendData = generateTrendData(event.dailyCount);

            return (
              <Card
                key={event.name}
                className={cn(
                  "transition-all duration-200",
                  isHighlighted && "ring-2 ring-blue-500 bg-blue-500/5"
                )}
              >
                <CardHeader
                  className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleEvent(event.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <div>
                        <CardTitle className="text-sm font-mono">
                          {event.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          Line {event.line}
                          {event.endLine && event.endLine !== event.line
                            ? `-${event.endLine}`
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {event.dailyCount.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 justify-end">
                        {event.weeklyTrend > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : event.weeklyTrend < 0 ? (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        ) : (
                          <Minus className="h-3 w-3 text-muted-foreground" />
                        )}
                        <span
                          className={cn(
                            "text-xs",
                            event.weeklyTrend > 0 && "text-green-500",
                            event.weeklyTrend < 0 && "text-red-500"
                          )}
                        >
                          {event.weeklyTrend > 0 ? "+" : ""}
                          {event.weeklyTrend}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="p-3 pt-0 space-y-3">
                    <Separator />

                    {/* Sparkline Chart */}
                    <div className="h-16">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <XAxis dataKey="date" hide />
                          <Tooltip
                            contentStyle={{
                              background: "#1a1a2e",
                              border: "1px solid #333",
                              borderRadius: "8px",
                              fontSize: "12px",
                            }}
                            labelStyle={{ color: "#888" }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-2">
                      {event.conversionRate && (
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-xs text-muted-foreground">
                            Conversion
                          </p>
                          <p className="text-sm font-medium">
                            {(event.conversionRate * 100).toFixed(1)}%
                          </p>
                        </div>
                      )}
                      {event.errorRate && (
                        <div className="rounded-lg bg-red-500/10 p-2">
                          <p className="text-xs text-red-400">Error Rate</p>
                          <p className="text-sm font-medium text-red-500">
                            {(event.errorRate * 100).toFixed(1)}%
                          </p>
                        </div>
                      )}
                      {event.avgTimeToTrigger && (
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-xs text-muted-foreground">
                            Avg Time
                          </p>
                          <p className="text-sm font-medium">
                            {event.avgTimeToTrigger}s
                          </p>
                        </div>
                      )}
                    </div>

                    {/* User Segments */}
                    {event.topUserSegments && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Top Segments
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {event.topUserSegments.map((segment) => (
                            <Badge
                              key={segment}
                              variant="secondary"
                              className="text-xs"
                            >
                              {segment}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Session Replays */}
                    {event.sessionReplays && event.sessionReplays.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Play className="h-3 w-3" />
                            Session Replays
                          </p>
                          {event.sessionReplays.length > 3 && (
                            <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                              View all ({event.sessionReplays.length})
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {event.sessionReplays.slice(0, 3).map((replay) => (
                            <SessionReplayThumbnail key={replay.id} replay={replay} />
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Insights */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Insights
          </h3>

          <div className="space-y-2">
            {analytics.insights.map((insight, i) => (
              <Card key={i} className="bg-muted/30">
                <CardContent className="p-3 flex items-start gap-2">
                  {insight.toLowerCase().includes("error") ||
                  insight.toLowerCase().includes("fail") ||
                  insight.toLowerCase().includes("abandon") ? (
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-sm text-muted-foreground">{insight}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
