"use client";

import { PriorityTask } from "@/lib/mock-data/tasks";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Zap,
  TrendingUp,
  Lightbulb,
  ArrowUpRight,
  Users,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: PriorityTask;
  onViewFix: (task: PriorityTask) => void;
  onOpenInEditor: (task: PriorityTask) => void;
}

const typeIcons = {
  error: AlertCircle,
  performance: Zap,
  optimization: TrendingUp,
  feature: Lightbulb,
};

const typeColors = {
  error: "text-red-500",
  performance: "text-yellow-500",
  optimization: "text-blue-500",
  feature: "text-purple-500",
};

const severityColors = {
  critical: "bg-red-500/10 text-red-500 border-red-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

export function TaskCard({ task, onViewFix, onOpenInEditor }: TaskCardProps) {
  const Icon = typeIcons[task.type];

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all hover:border-border hover:bg-card hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-muted",
                typeColors[task.type]
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={cn("text-xs", severityColors[task.severity])}
                >
                  {task.severity}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {task.file}:{task.lineRange[0]}-{task.lineRange[1]}
                </span>
              </div>
              <h3 className="font-semibold leading-tight text-foreground">
                {task.title}
              </h3>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {task.description}
        </p>

        {/* Metrics */}
        <div className="flex flex-wrap gap-4">
          {task.metrics.map((metric, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">
                {metric.label}:
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  metric.trend === "up" && metric.label.includes("Error")
                    ? "text-red-500"
                    : metric.trend === "up"
                    ? "text-green-500"
                    : metric.trend === "down"
                    ? "text-red-500"
                    : "text-foreground"
                )}
              >
                {metric.value}
              </span>
              {metric.trend === "up" && (
                <ArrowUpRight className="h-3 w-3 text-current" />
              )}
            </div>
          ))}
        </div>

        {/* Affected Users */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {task.affectedUsers.toLocaleString()} users affected this week
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          {task.aiFixAvailable && (
            <Button
              size="sm"
              onClick={() => onViewFix(task)}
              className="gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              View AI Fix
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenInEditor(task)}
            className="gap-1.5"
          >
            Open in Editor
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>

      {/* Decorative gradient */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-px bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100",
          task.severity === "critical" && "from-transparent via-red-500 to-transparent",
          task.severity === "high" && "from-transparent via-orange-500 to-transparent",
          task.severity === "medium" && "from-transparent via-yellow-500 to-transparent",
          task.severity === "low" && "from-transparent via-blue-500 to-transparent"
        )}
      />
    </Card>
  );
}
