"use client";

import { sampleFiles, SampleFile } from "@/lib/mock-data/sample-code";
import { fileAnalytics } from "@/lib/mock-data/analytics";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileCode,
  Folder,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FileExplorerProps {
  selectedFile: SampleFile | null;
  onSelectFile: (file: SampleFile) => void;
}

export function FileExplorer({ selectedFile, onSelectFile }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["src", "src/components"])
  );

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder);
    } else {
      newExpanded.add(folder);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileStats = (fileName: string) => {
    const analytics = fileAnalytics[fileName];
    if (!analytics) return null;

    const hasErrors = analytics.events.some((e) => e.errorRate && e.errorRate > 0.1);
    return {
      eventCount: analytics.totalEvents,
      hasErrors,
    };
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border">
        <h3 className="text-sm font-semibold text-muted-foreground">Explorer</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Project Root */}
          <div className="space-y-0.5">
            {/* src folder */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-7 px-2 text-sm"
              onClick={() => toggleFolder("src")}
            >
              {expandedFolders.has("src") ? (
                <ChevronDown className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1" />
              )}
              <Folder className="h-4 w-4 mr-2 text-blue-400" />
              src
            </Button>

            {expandedFolders.has("src") && (
              <div className="ml-4">
                {/* components folder */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-7 px-2 text-sm"
                  onClick={() => toggleFolder("src/components")}
                >
                  {expandedFolders.has("src/components") ? (
                    <ChevronDown className="h-4 w-4 mr-1" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1" />
                  )}
                  <Folder className="h-4 w-4 mr-2 text-blue-400" />
                  components
                </Button>

                {expandedFolders.has("src/components") && (
                  <div className="ml-4 space-y-0.5">
                    {sampleFiles.map((file) => {
                      const stats = getFileStats(file.name);
                      const isSelected = selectedFile?.name === file.name;

                      return (
                        <Button
                          key={file.name}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start h-7 px-2 text-sm group",
                            isSelected && "bg-accent"
                          )}
                          onClick={() => onSelectFile(file)}
                        >
                          <FileCode className="h-4 w-4 mr-2 text-yellow-400" />
                          <span className="flex-1 text-left truncate">
                            {file.name}
                          </span>
                          {stats && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {stats.hasErrors && (
                                <AlertCircle className="h-3 w-3 text-red-500" />
                              )}
                              <Badge
                                variant="secondary"
                                className="h-5 px-1.5 text-xs bg-blue-500/10 text-blue-400"
                              >
                                <Activity className="h-3 w-3 mr-1" />
                                {stats.eventCount}
                              </Badge>
                            </div>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
