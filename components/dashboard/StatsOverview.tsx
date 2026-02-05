"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  iconColor: string;
}

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconColor,
}: StatCardProps) {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className="flex items-center gap-1">
              {changeType === "positive" ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : changeType === "negative" ? (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              ) : null}
              <span
                className={cn(
                  "text-sm",
                  changeType === "positive" && "text-green-500",
                  changeType === "negative" && "text-red-500",
                  changeType === "neutral" && "text-muted-foreground"
                )}
              >
                {change}
              </span>
            </div>
          </div>
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              iconColor
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsOverview() {
  const stats: StatCardProps[] = [
    {
      title: "Critical Issues",
      value: "2",
      change: "+1 from last week",
      changeType: "negative",
      icon: AlertCircle,
      iconColor: "bg-red-500/10 text-red-500",
    },
    {
      title: "Affected Users",
      value: "14,443",
      change: "+12% this week",
      changeType: "negative",
      icon: Users,
      iconColor: "bg-orange-500/10 text-orange-500",
    },
    {
      title: "Est. Weekly Impact",
      value: "$96K",
      change: "Potential recovery",
      changeType: "neutral",
      icon: DollarSign,
      iconColor: "bg-green-500/10 text-green-500",
    },
    {
      title: "AI Fixes Available",
      value: "4",
      change: "Ready to apply",
      changeType: "positive",
      icon: TrendingUp,
      iconColor: "bg-blue-500/10 text-blue-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
