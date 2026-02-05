"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Code2,
  Sparkles,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Priority tasks & insights",
  },
  {
    name: "Editor",
    href: "/editor",
    icon: Code2,
    description: "Code with analytics",
  },
  {
    name: "Auto-Instrument",
    href: "/demo",
    icon: Sparkles,
    description: "See auto-tracking in action",
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex h-14 items-center border-b border-border bg-card px-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mr-8">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-semibold text-lg">AnalyticsIDE</span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Live Analytics
        </div>
        <button className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
}
