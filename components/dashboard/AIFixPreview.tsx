"use client";

import { PriorityTask } from "@/lib/mock-data/tasks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  GitPullRequest,
  FileCode,
  X,
  Minus,
  Plus,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIFixPreviewProps {
  task: PriorityTask | null;
  onClose: () => void;
  onApply: () => void;
}

function DiffLine({
  type,
  content,
  lineNumber,
}: {
  type: "add" | "remove" | "context";
  content: string;
  lineNumber?: number;
}) {
  return (
    <div
      className={cn(
        "flex font-mono text-xs leading-6",
        type === "add" && "bg-green-500/10 text-green-400",
        type === "remove" && "bg-red-500/10 text-red-400",
        type === "context" && "text-muted-foreground"
      )}
    >
      <span className="w-8 flex-shrink-0 text-right pr-2 select-none opacity-50">
        {lineNumber || ""}
      </span>
      <span className="w-6 flex-shrink-0 text-center select-none">
        {type === "add" && <Plus className="h-4 w-4 inline" />}
        {type === "remove" && <Minus className="h-4 w-4 inline" />}
        {type === "context" && " "}
      </span>
      <pre className="flex-1 overflow-x-auto whitespace-pre">{content}</pre>
    </div>
  );
}

function DiffView({
  oldCode,
  newCode,
}: {
  oldCode: string;
  newCode: string;
}) {
  const oldLines = oldCode.split("\n");
  const newLines = newCode.split("\n");

  // Simple diff visualization - in a real app, use a proper diff library
  const diffLines: { type: "add" | "remove" | "context"; content: string }[] = [];

  // Simple line-by-line comparison
  const maxLength = Math.max(oldLines.length, newLines.length);
  
  for (let i = 0; i < maxLength; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];

    if (oldLine === undefined && newLine !== undefined) {
      // Line added
      diffLines.push({ type: "add", content: newLine });
    } else if (newLine === undefined && oldLine !== undefined) {
      // Line removed
      diffLines.push({ type: "remove", content: oldLine });
    } else if (oldLine === newLine) {
      // Line unchanged
      diffLines.push({ type: "context", content: oldLine || "" });
    } else {
      // Line changed - show as remove + add
      diffLines.push({ type: "remove", content: oldLine || "" });
      diffLines.push({ type: "add", content: newLine || "" });
    }
  }

  const removedCount = diffLines.filter((l) => l.type === "remove").length;
  const addedCount = diffLines.filter((l) => l.type === "add").length;

  return (
    <div className="rounded-lg border border-border bg-[#0a0a0a] overflow-hidden">
      <div className="bg-muted/30 px-3 py-2 border-b border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Proposed Changes</span>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-red-400">-{removedCount}</span>
          <span className="text-green-400">+{addedCount}</span>
        </div>
      </div>
      <ScrollArea className="max-h-[400px]">
        <div className="p-2">
          {diffLines.map((line, i) => (
            <DiffLine
              key={i}
              type={line.type}
              content={line.content}
              lineNumber={i + 1}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export function AIFixPreview({ task, onClose, onApply }: AIFixPreviewProps) {
  if (!task) return null;

  const hasFix = task.aiFixAvailable && task.suggestedFix;

  return (
    <Dialog open={!!task} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="flex items-center gap-2">
                AI-Generated Fix
                <Badge variant="secondary" className="text-xs">
                  Preview
                </Badge>
              </DialogTitle>
              <DialogDescription>
                {task.suggestedFix?.summary || task.title}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 py-4">
            {/* Task Info */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono">{task.file}</span>
                <span className="text-muted-foreground">
                  lines {task.lineRange[0]}-{task.lineRange[1]}
                </span>
              </div>
            </div>

            {/* Expected Impact */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Expected Impact
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {task.metrics.map((metric, i) => (
                  <div key={i}>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                    <p className="text-lg font-semibold">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Code Diff */}
            {hasFix ? (
              <DiffView
                oldCode={task.suggestedFix!.oldCode}
                newCode={task.suggestedFix!.newCode}
              />
            ) : (
              <div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No automated fix available for this task.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  This issue requires manual investigation.
                </p>
              </div>
            )}

            {/* Warning */}
            {hasFix && (
              <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-500">Review Before Applying</p>
                  <p className="text-muted-foreground mt-1">
                    AI-generated fixes should be reviewed by a developer before
                    merging. Consider adding tests for the affected functionality.
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          {hasFix && (
            <Button onClick={onApply} className="gap-2">
              <GitPullRequest className="h-4 w-4" />
              Create Pull Request
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
