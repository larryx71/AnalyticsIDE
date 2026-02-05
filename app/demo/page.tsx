"use client";

import { AutoInstrumentDemo } from "@/components/demo/AutoInstrumentDemo";
import { Sparkles, Wand2, Code2, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Wand2,
    title: "Automatic SDK Injection",
    description:
      "When you create a new project, the analytics SDK is automatically added to your entry point with sensible defaults.",
  },
  {
    icon: Code2,
    title: "Smart Event Detection",
    description:
      "The IDE analyzes your components to identify trackable interactions like form submissions, button clicks, and navigation.",
  },
  {
    icon: BarChart3,
    title: "Context-Aware Tracking",
    description:
      "Events are instrumented with relevant context like component state, user actions, and error information.",
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Auto-Instrumentation
              </h1>
              <p className="text-muted-foreground">
                See how analytics tracking is automatically added to your code
              </p>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {features.map((feature, i) => (
            <Card key={i} className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo */}
        <AutoInstrumentDemo />
      </div>
    </div>
  );
}
