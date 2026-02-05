"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles,
  Play,
  RotateCcw,
  Check,
  ChevronRight,
  FileCode,
  Zap,
  Code2,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DemoStep =
  | "idle"
  | "creating-project"
  | "adding-sdk"
  | "adding-component"
  | "adding-tracking"
  | "complete";

const beforeCode = `import { useState } from 'react';

interface SubscribeFormProps {
  onSubmit: (email: string) => void;
}

export function SubscribeForm({ onSubmit }: SubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(email);
      setEmail('');
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="subscribe-form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
}`;

const afterCode = `import { useState, useEffect } from 'react';
import { analytics } from '@/lib/analytics';

interface SubscribeFormProps {
  onSubmit: (email: string) => void;
}

export function SubscribeForm({ onSubmit }: SubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generated: Track component mount
  useEffect(() => {
    analytics.track('subscribe_form_viewed', {
      source: 'component_mount',
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Auto-generated: Track form submission attempt
    analytics.track('subscribe_form_submitted', {
      has_email: !!email,
    });
    
    try {
      await onSubmit(email);
      setEmail('');
      
      // Auto-generated: Track successful subscription
      analytics.track('subscribe_form_success', {
        email_domain: email.split('@')[1],
      });
    } catch (error) {
      console.error('Subscription failed:', error);
      
      // Auto-generated: Track subscription failure
      analytics.track('subscribe_form_error', {
        error_message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="subscribe-form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
}`;

const entryPointBefore = `import { createRoot } from 'react-dom/client';
import { App } from './App';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);`;

const entryPointAfter = `import { createRoot } from 'react-dom/client';
import { analytics } from '@/lib/analytics';
import { App } from './App';

// Auto-generated: Initialize analytics SDK
analytics.init({
  apiKey: process.env.ANALYTICS_API_KEY,
  environment: process.env.NODE_ENV,
  autoTrack: {
    pageViews: true,
    clicks: true,
    forms: true,
  },
});

const root = createRoot(document.getElementById('root')!);
root.render(<App />);`;

interface StepInfo {
  id: DemoStep;
  title: string;
  description: string;
  icon: React.ElementType;
}

const steps: StepInfo[] = [
  {
    id: "creating-project",
    title: "Creating New Project",
    description: "Initializing project structure...",
    icon: Package,
  },
  {
    id: "adding-sdk",
    title: "Adding Analytics SDK",
    description: "Auto-injecting analytics SDK into entry point...",
    icon: Zap,
  },
  {
    id: "adding-component",
    title: "New Component Detected",
    description: "Analyzing SubscribeForm.tsx for trackable events...",
    icon: FileCode,
  },
  {
    id: "adding-tracking",
    title: "Adding Event Tracking",
    description: "Instrumenting form submission, success, and error events...",
    icon: Code2,
  },
];

function CodeBlock({
  code,
  highlights,
  title,
}: {
  code: string;
  highlights?: number[];
  title: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-[#0a0a0a] overflow-hidden">
      <div className="bg-muted/30 px-3 py-2 border-b border-border">
        <span className="text-xs text-muted-foreground">{title}</span>
      </div>
      <ScrollArea className="h-[300px]">
        <pre className="p-4 text-xs font-mono leading-5">
          {code.split("\n").map((line, i) => (
            <div
              key={i}
              className={cn(
                "px-2 -mx-2",
                highlights?.includes(i + 1) &&
                  "bg-green-500/10 border-l-2 border-green-500"
              )}
            >
              <span className="inline-block w-8 text-muted-foreground select-none">
                {i + 1}
              </span>
              {line}
            </div>
          ))}
        </pre>
      </ScrollArea>
    </div>
  );
}

export function AutoInstrumentDemo() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("idle");
  const [completedSteps, setCompletedSteps] = useState<Set<DemoStep>>(
    new Set()
  );
  const [showAfter, setShowAfter] = useState(false);
  const [codeView, setCodeView] = useState<"entry" | "component">("component");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const runDemo = () => {
    setCurrentStep("creating-project");
    setCompletedSteps(new Set());
    setShowAfter(false);
    setCodeView("entry");

    const stepSequence: DemoStep[] = [
      "creating-project",
      "adding-sdk",
      "adding-component",
      "adding-tracking",
      "complete",
    ];

    let stepIndex = 0;

    const advanceStep = () => {
      if (stepIndex < stepSequence.length - 1) {
        setCompletedSteps((prev) => new Set([...prev, stepSequence[stepIndex]]));
        stepIndex++;
        setCurrentStep(stepSequence[stepIndex]);

        if (stepSequence[stepIndex] === "adding-sdk") {
          setCodeView("entry");
        } else if (stepSequence[stepIndex] === "adding-component") {
          setCodeView("component");
        } else if (stepSequence[stepIndex] === "adding-tracking") {
          setTimeout(() => setShowAfter(true), 500);
        }

        if (stepIndex < stepSequence.length - 1) {
          timeoutRef.current = setTimeout(advanceStep, 2000);
        } else {
          setCompletedSteps((prev) => new Set([...prev, "adding-tracking"]));
        }
      }
    };

    timeoutRef.current = setTimeout(advanceStep, 1500);
  };

  const resetDemo = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setCurrentStep("idle");
    setCompletedSteps(new Set());
    setShowAfter(false);
    setCodeView("component");
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getHighlights = () => {
    if (codeView === "entry" && showAfter) {
      return [2, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    }
    if (codeView === "component" && showAfter) {
      return [2, 14, 15, 16, 17, 18, 25, 26, 27, 28, 34, 35, 36, 37, 41, 42, 43, 44, 45];
    }
    return [];
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Control Panel */}
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Auto-Instrumentation Demo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Watch how AnalyticsIDE automatically adds event tracking to your
              code when you create new projects or add new components.
            </p>

            <div className="flex gap-2">
              {currentStep === "idle" ? (
                <Button onClick={runDemo} className="gap-2">
                  <Play className="h-4 w-4" />
                  Run Demo
                </Button>
              ) : (
                <Button onClick={resetDemo} variant="outline" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Steps Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {steps.map((step) => {
              const isCompleted = completedSteps.has(step.id);
              const isCurrent = currentStep === step.id;
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-all",
                    isCurrent && "bg-blue-500/10 border border-blue-500/20",
                    isCompleted && "opacity-70"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      isCompleted && "bg-green-500/20 text-green-500",
                      isCurrent && "bg-blue-500/20 text-blue-500",
                      !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        !isCompleted && !isCurrent && "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-muted-foreground animate-pulse">
                        {step.description}
                      </p>
                    )}
                  </div>
                  {isCompleted && (
                    <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-500">
                      Done
                    </Badge>
                  )}
                </div>
              );
            })}

            {currentStep === "complete" && (
              <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 text-green-500">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Instrumentation Complete!</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  4 events have been automatically added to track form views,
                  submissions, successes, and errors.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Code Preview */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            variant={codeView === "component" ? "default" : "outline"}
            size="sm"
            onClick={() => setCodeView("component")}
          >
            SubscribeForm.tsx
          </Button>
          <Button
            variant={codeView === "entry" ? "default" : "outline"}
            size="sm"
            onClick={() => setCodeView("entry")}
          >
            index.tsx
          </Button>
        </div>

        {codeView === "component" ? (
          <CodeBlock
            code={showAfter ? afterCode : beforeCode}
            highlights={getHighlights()}
            title={
              showAfter
                ? "SubscribeForm.tsx (with auto-instrumentation)"
                : "SubscribeForm.tsx (original)"
            }
          />
        ) : (
          <CodeBlock
            code={
              completedSteps.has("adding-sdk") ? entryPointAfter : entryPointBefore
            }
            highlights={completedSteps.has("adding-sdk") ? getHighlights() : []}
            title={
              completedSteps.has("adding-sdk")
                ? "index.tsx (with analytics SDK)"
                : "index.tsx (original)"
            }
          />
        )}

        {showAfter && codeView === "component" && (
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                Auto-Generated Events
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "subscribe_form_viewed",
                  "subscribe_form_submitted",
                  "subscribe_form_success",
                  "subscribe_form_error",
                ].map((event) => (
                  <Badge
                    key={event}
                    variant="outline"
                    className="justify-start font-mono text-xs"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" />
                    {event}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
