"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TaskList } from "@/components/dashboard/TaskList";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { AIFixPreview } from "@/components/dashboard/AIFixPreview";
import { PriorityTask } from "@/lib/mock-data/tasks";
import { Sparkles, Brain, TrendingUp } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState<PriorityTask | null>(null);

  const handleViewFix = (task: PriorityTask) => {
    setSelectedTask(task);
  };

  const handleOpenInEditor = (task: PriorityTask) => {
    router.push(`/editor?file=${encodeURIComponent(task.file)}`);
  };

  const handleCloseFix = () => {
    setSelectedTask(null);
  };

  const handleApplyFix = () => {
    // In a real app, this would apply the fix
    setSelectedTask(null);
    // Could show a toast or navigate to editor
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
            <h1 className="text-2xl font-bold tracking-tight">
                Good morning! Here&apos;s what needs attention.
            </h1>
              <p className="text-muted-foreground">
                AI-prioritized tasks based on your analytics data
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <StatsOverview />
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Priority Tasks</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>4 AI fixes ready to apply</span>
            </div>
          </div>

          <TaskList
            onViewFix={handleViewFix}
            onOpenInEditor={handleOpenInEditor}
          />
        </div>
      </div>

      {/* AI Fix Preview Modal */}
      <AIFixPreview
        task={selectedTask}
        onClose={handleCloseFix}
        onApply={handleApplyFix}
      />
    </div>
  );
}
