"use client";

import { useState } from "react";
import {
  FeatureFlag,
  FlagStatus,
  getFeatureFlagsForFile,
} from "@/lib/mock-data/feature-flags";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Flag,
  ChevronDown,
  ChevronRight,
  Trash2,
  AlertTriangle,
  Check,
  User,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureFlagsPanelProps {
  fileName: string | null;
  onFlagToggle?: (flagId: string, enabled: boolean) => void;
  onFlagRemove?: (flagId: string) => void;
  onLineClick?: (line: number) => void;
  onViewInsights?: (flag: FeatureFlag) => void;
}

const statusConfig: Record<
  FlagStatus,
  { label: string; color: string; bgColor: string }
> = {
  active: {
    label: "Active",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  inactive: {
    label: "Inactive",
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
  },
  rolled_out: {
    label: "Rolled Out",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  stale: {
    label: "Stale",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
};

export function FeatureFlagsPanel({
  fileName,
  onFlagToggle,
  onFlagRemove,
  onLineClick,
  onViewInsights,
}: FeatureFlagsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [localFlags, setLocalFlags] = useState<Record<string, FeatureFlag>>({});
  const [removedFlags, setRemovedFlags] = useState<Set<string>>(new Set());
  const [flagToRemove, setFlagToRemove] = useState<FeatureFlag | null>(null);

  const flags = fileName ? getFeatureFlagsForFile(fileName) : [];
  const visibleFlags = flags.filter((f) => !removedFlags.has(f.id));

  const handleToggle = (flag: FeatureFlag, enabled: boolean) => {
    const newStatus: FlagStatus = enabled ? "active" : "inactive";
    setLocalFlags((prev) => ({
      ...prev,
      [flag.id]: { ...flag, status: newStatus },
    }));
    onFlagToggle?.(flag.id, enabled);
  };

  const handleRemoveConfirm = () => {
    if (flagToRemove) {
      setRemovedFlags((prev) => new Set([...prev, flagToRemove.id]));
      onFlagRemove?.(flagToRemove.id);
      setFlagToRemove(null);
    }
  };

  const getFlagState = (flag: FeatureFlag) => {
    return localFlags[flag.id] || flag;
  };

  if (!fileName) {
    return null;
  }

  return (
    <>
      <div className="border-t border-border h-full flex flex-col">
        {/* Header */}
        <button
          className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors flex-shrink-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <Flag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground">
              Feature Flags
            </span>
          </div>
          {visibleFlags.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {visibleFlags.length}
            </Badge>
          )}
        </button>

        {/* Content */}
        {isExpanded && (
          <ScrollArea className="flex-1 min-h-0">
            <div className="px-3 pb-3 space-y-2">
              {visibleFlags.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No feature flags in this file
                </p>
              ) : (
                visibleFlags.map((flag) => {
                  const flagState = getFlagState(flag);
                  const config = statusConfig[flagState.status];
                  const isStale = flagState.status === "stale";
                  const isToggleable =
                    flagState.status === "active" ||
                    flagState.status === "inactive";

                  return (
                    <Card
                      key={flag.id}
                      className={cn(
                        "bg-muted/30 border-border/50",
                        isStale && "border-orange-500/30"
                      )}
                    >
                      <CardContent className="p-3 space-y-2">
                        {/* Flag Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0 space-y-1">
                            <span className="text-sm font-medium line-clamp-2">
                              {flag.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px]",
                                  config.color,
                                  config.bgColor
                                )}
                              >
                                {config.label}
                              </Badge>
                              <code className="text-[10px] text-muted-foreground font-mono truncate">
                                {flag.key}
                              </code>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {/* Insights Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewInsights?.(flag);
                              }}
                              title="View insights"
                            >
                              <BarChart3 className="h-3.5 w-3.5" />
                            </Button>

                            {/* Toggle or Remove Button */}
                            {isToggleable && (
                              <Switch
                                checked={flagState.status === "active"}
                                onCheckedChange={(checked) =>
                                  handleToggle(flag, checked)
                                }
                                className="scale-90"
                              />
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {flag.description}
                        </p>

                        {/* Rollout Progress (for partial rollouts) */}
                        {flagState.status === "active" &&
                          flag.rolloutPercentage < 100 && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-muted-foreground">
                                  Rollout
                                </span>
                                <span className="font-medium">
                                  {flag.rolloutPercentage}%
                                </span>
                              </div>
                              <div className="h-1 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500 rounded-full transition-all"
                                  style={{ width: `${flag.rolloutPercentage}%` }}
                                />
                              </div>
                            </div>
                          )}

                        {/* Stale Warning & Remove Button */}
                        {isStale && (
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1 text-orange-500">
                              <AlertTriangle className="h-3 w-3" />
                              <span className="text-[10px]">
                                Not modified in 6+ months
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-6 text-xs px-2"
                              onClick={() => setFlagToRemove(flag)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Remove
                            </Button>
                          </div>
                        )}

                        {/* Line References */}
                        <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                          <span className="text-[10px] text-muted-foreground">
                            Lines:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {flag.lineReferences.map((line) => (
                              <button
                                key={line}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-muted hover:bg-blue-500/20 hover:text-blue-400 transition-colors font-mono"
                                onClick={() => onLineClick?.(line)}
                              >
                                L{line}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Owner */}
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{flag.owner}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Remove Confirmation Dialog */}
      <Dialog open={!!flagToRemove} onOpenChange={() => setFlagToRemove(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Remove Feature Flag
            </DialogTitle>
            <DialogDescription>
              This will remove all references to{" "}
              <code className="px-1 py-0.5 rounded bg-muted font-mono text-xs">
                {flagToRemove?.key}
              </code>{" "}
              from the code.
            </DialogDescription>
          </DialogHeader>

          {flagToRemove && (
            <div className="space-y-4 py-4">
              {/* Flag Info */}
              <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{flagToRemove.name}</span>
                  <Badge
                    variant="outline"
                    className="text-orange-500 bg-orange-500/10"
                  >
                    Stale
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {flagToRemove.description}
                </p>
              </div>

              {/* Affected Lines */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Affected lines:</p>
                <div className="rounded-lg border border-border bg-[#0a0a0a] p-3">
                  {flagToRemove.lineReferences.map((line) => (
                    <div
                      key={line}
                      className="flex items-center gap-2 text-xs font-mono"
                    >
                      <span className="text-muted-foreground w-8">L{line}</span>
                      <span className="text-red-400">
                        - if (flags.{flagToRemove.key}) {"{ ... }"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning */}
              <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  This action will modify your code. Make sure to review the
                  changes before committing.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setFlagToRemove(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveConfirm}>
              <Check className="h-4 w-4 mr-2" />
              Remove Flag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
