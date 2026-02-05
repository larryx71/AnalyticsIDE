"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { AnalyticsPanel } from "@/components/editor/AnalyticsPanel";
import { LeftSidebar } from "@/components/editor/LeftSidebar";
import { sampleFiles, SampleFile } from "@/lib/mock-data/sample-code";
import { fileAnalytics, FileAnalytics } from "@/lib/mock-data/analytics";
import { Button } from "@/components/ui/button";
import { PanelRightClose, PanelRight } from "lucide-react";

function EditorContent() {
  const searchParams = useSearchParams();
  const fileParam = searchParams.get("file");

  // Compute initial file from URL param
  const initialFile = useMemo(() => {
    return fileParam
      ? sampleFiles.find((f) => f.name === fileParam) || sampleFiles[0]
      : sampleFiles[0];
  }, [fileParam]);

  const [selectedFile, setSelectedFile] = useState<SampleFile | null>(initialFile);
  const [analytics, setAnalytics] = useState<FileAnalytics | null>(
    initialFile ? fileAnalytics[initialFile.name] || null : null
  );
  const [highlightedEvent, setHighlightedEvent] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(true);

  const handleSelectFile = (file: SampleFile) => {
    setSelectedFile(file);
    setAnalytics(fileAnalytics[file.name] || null);
    setHighlightedEvent(null);
  };

  const handleEventHover = (eventName: string | null) => {
    setHighlightedEvent(eventName);
  };

  const handleFlagToggle = (flagId: string, enabled: boolean) => {
    // In a real app, this would update the flag state in the backend
    console.log(`Flag ${flagId} toggled to ${enabled}`);
  };

  const handleFlagRemove = (flagId: string) => {
    // In a real app, this would trigger code modifications
    console.log(`Flag ${flagId} removed from code`);
  };

  const handleLineClick = (line: number) => {
    // In a real app, this would scroll the editor to the line
    console.log(`Navigate to line ${line}`);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex">
      {/* Left Sidebar with File Explorer and Feature Flags */}
      <div className="w-56 flex-shrink-0">
        <LeftSidebar
          selectedFile={selectedFile}
          onSelectFile={handleSelectFile}
          onFlagToggle={handleFlagToggle}
          onFlagRemove={handleFlagRemove}
          onLineClick={handleLineClick}
        />
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Editor Toolbar */}
        <div className="h-10 flex items-center justify-between px-4 border-b border-border bg-card/50">
          <div className="flex items-center gap-2">
            {selectedFile && (
              <>
                <span className="text-sm font-medium">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  {selectedFile.path}
                </span>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="gap-2"
          >
            {showAnalytics ? (
              <>
                <PanelRightClose className="h-4 w-4" />
                Hide Analytics
              </>
            ) : (
              <>
                <PanelRight className="h-4 w-4" />
                Show Analytics
              </>
            )}
          </Button>
        </div>

        {/* Editor Content */}
        <div className="flex-1 flex min-h-0">
          {/* Code Editor */}
          <div className="flex-1 min-w-0">
            {selectedFile ? (
              <CodeEditor
                file={selectedFile}
                analytics={analytics || undefined}
                onEventHover={handleEventHover}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a file to view
              </div>
            )}
          </div>

          {/* Analytics Panel */}
          {showAnalytics && (
            <div className="w-80 flex-shrink-0 border-l border-border bg-card/30">
              <AnalyticsPanel
                analytics={analytics}
                highlightedEvent={highlightedEvent}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[calc(100vh-3.5rem)] flex items-center justify-center">
          <div className="text-muted-foreground">Loading editor...</div>
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
