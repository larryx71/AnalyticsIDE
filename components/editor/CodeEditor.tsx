"use client";

import { useEffect, useRef, useCallback } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { SampleFile } from "@/lib/mock-data/sample-code";
import { FileAnalytics } from "@/lib/mock-data/analytics";

interface CodeEditorProps {
  file: SampleFile;
  analytics?: FileAnalytics;
  onEventHover?: (eventName: string | null, line: number | null) => void;
}

export function CodeEditor({ file, analytics, onEventHover }: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);

  const addEventDecorations = useCallback((
    editorInstance: editor.IStandaloneCodeEditor,
    monaco: typeof import("monaco-editor"),
    analyticsData: FileAnalytics
  ) => {
    const newDecorations: editor.IModelDeltaDecoration[] = analyticsData.events.map(
      (event) => ({
        range: new monaco.Range(
          event.line,
          1,
          event.endLine || event.line,
          1
        ),
        options: {
          isWholeLine: true,
          className: "event-line-highlight",
          glyphMarginClassName: "event-glyph",
          glyphMarginHoverMessage: {
            value: `**${event.name}**\n\nDaily triggers: ${event.dailyCount.toLocaleString()}\n\nTrend: ${event.weeklyTrend > 0 ? "+" : ""}${event.weeklyTrend}%`,
          },
          overviewRuler: {
            color: event.errorRate ? "#ef4444" : "#3b82f6",
            position: monaco.editor.OverviewRulerLane.Right,
          },
        },
      })
    );

    const ids = editorInstance.deltaDecorations(decorationsRef.current, newDecorations);
    decorationsRef.current = ids;
  }, []);

  const handleEditorMount: OnMount = useCallback((editorInstance, monaco) => {
    editorRef.current = editorInstance;

    // Define custom theme
    monaco.editor.defineTheme("analytics-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0a0a0a",
        "editor.lineHighlightBackground": "#1a1a2e",
        "editorLineNumber.foreground": "#4a4a6a",
        "editorLineNumber.activeForeground": "#8a8aaa",
        "editor.selectionBackground": "#264f78",
        "editorGutter.background": "#0a0a0a",
      },
    });
    monaco.editor.setTheme("analytics-dark");

    // Add event decorations if analytics data is available
    if (analytics) {
      addEventDecorations(editorInstance, monaco, analytics);
    }

    // Handle hover events
    editorInstance.onMouseMove((e) => {
      if (e.target.position && analytics) {
        const line = e.target.position.lineNumber;
        const event = analytics.events.find(
          (ev) => line >= ev.line && line <= (ev.endLine || ev.line)
        );
        if (event) {
          onEventHover?.(event.name, line);
        } else {
          onEventHover?.(null, null);
        }
      }
    });

    editorInstance.onMouseLeave(() => {
      onEventHover?.(null, null);
    });
  }, [analytics, onEventHover, addEventDecorations]);

  useEffect(() => {
    if (editorRef.current && analytics) {
      // Re-add decorations when analytics change
      const monaco = (window as unknown as { monaco: typeof import("monaco-editor") }).monaco;
      if (monaco) {
        addEventDecorations(editorRef.current, monaco, analytics);
      }
    }
  }, [analytics, addEventDecorations]);

  return (
    <div className="h-full w-full overflow-hidden rounded-lg border border-border bg-[#0a0a0a]">
      <Editor
        height="100%"
        language="typescript"
        value={file.content}
        theme="vs-dark"
        onMount={handleEditorMount}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 13,
          lineHeight: 20,
          fontFamily: "var(--font-geist-mono), monospace",
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          glyphMargin: true,
          folding: true,
          lineNumbers: "on",
          renderLineHighlight: "all",
          cursorBlinking: "smooth",
          smoothScrolling: true,
          contextmenu: false,
        }}
      />
      <style jsx global>{`
        .event-line-highlight {
          background-color: rgba(59, 130, 246, 0.08) !important;
          border-left: 3px solid rgba(59, 130, 246, 0.5) !important;
        }
        .event-glyph {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 50%;
          margin-left: 5px;
          width: 8px !important;
          height: 8px !important;
          margin-top: 6px;
        }
        .monaco-editor .margin {
          background-color: #0a0a0a !important;
        }
      `}</style>
    </div>
  );
}
