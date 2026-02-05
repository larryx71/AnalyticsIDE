"use client";

import { SampleFile } from "@/lib/mock-data/sample-code";
import { FileExplorer } from "./FileExplorer";
import { FeatureFlagsPanel } from "./FeatureFlagsPanel";

interface LeftSidebarProps {
  selectedFile: SampleFile | null;
  onSelectFile: (file: SampleFile) => void;
  onFlagToggle?: (flagId: string, enabled: boolean) => void;
  onFlagRemove?: (flagId: string) => void;
  onLineClick?: (line: number) => void;
}

export function LeftSidebar({
  selectedFile,
  onSelectFile,
  onFlagToggle,
  onFlagRemove,
  onLineClick,
}: LeftSidebarProps) {
  return (
    <div className="h-full flex flex-col border-r border-border bg-card/50 overflow-hidden">
      {/* File Explorer - takes remaining space */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <FileExplorerSection
          selectedFile={selectedFile}
          onSelectFile={onSelectFile}
        />
      </div>

      {/* Feature Flags Panel - fixed max height, scrollable */}
      <div className="flex-shrink-0 max-h-[55%] overflow-hidden">
        <FeatureFlagsPanel
          fileName={selectedFile?.name || null}
          onFlagToggle={onFlagToggle}
          onFlagRemove={onFlagRemove}
          onLineClick={onLineClick}
        />
      </div>
    </div>
  );
}

// Extracted FileExplorer content to avoid the border styling conflict
function FileExplorerSection({
  selectedFile,
  onSelectFile,
}: {
  selectedFile: SampleFile | null;
  onSelectFile: (file: SampleFile) => void;
}) {
  return (
    <FileExplorer selectedFile={selectedFile} onSelectFile={onSelectFile} />
  );
}
