"use client";

import { useState } from "react";
import { PriorityTask, priorityTasks } from "@/lib/mock-data/tasks";
import { TaskCard } from "./TaskCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface TaskListProps {
  onViewFix: (task: PriorityTask) => void;
  onOpenInEditor: (task: PriorityTask) => void;
}

type FilterType = "all" | "error" | "optimization" | "feature" | "performance";

export function TaskList({ onViewFix, onOpenInEditor }: TaskListProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredTasks =
    filter === "all"
      ? priorityTasks
      : priorityTasks.filter((t) => t.type === filter);

  const counts = {
    all: priorityTasks.length,
    error: priorityTasks.filter((t) => t.type === "error").length,
    optimization: priorityTasks.filter((t) => t.type === "optimization").length,
    feature: priorityTasks.filter((t) => t.type === "feature").length,
    performance: priorityTasks.filter((t) => t.type === "performance").length,
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as FilterType)}
        className="w-full"
      >
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all" className="gap-2">
            All
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {counts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="error" className="gap-2">
            Errors
            <Badge
              variant="secondary"
              className="ml-1 h-5 px-1.5 text-xs bg-red-500/10 text-red-500"
            >
              {counts.error}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="optimization" className="gap-2">
            Optimizations
            <Badge
              variant="secondary"
              className="ml-1 h-5 px-1.5 text-xs bg-blue-500/10 text-blue-500"
            >
              {counts.optimization}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="feature" className="gap-2">
            Features
            <Badge
              variant="secondary"
              className="ml-1 h-5 px-1.5 text-xs bg-purple-500/10 text-purple-500"
            >
              {counts.feature}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onViewFix={onViewFix}
            onOpenInEditor={onOpenInEditor}
          />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No tasks match the current filter.
        </div>
      )}
    </div>
  );
}
