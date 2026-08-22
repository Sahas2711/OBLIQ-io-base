"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  FolderOpen,
  Activity,
  Settings,
  Shield,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { name: "Clients", href: "/app/clients", icon: Users },
  { name: "Tasks", href: "/app/tasks", icon: CheckSquare },
  { name: "Documents", href: "/app/documents", icon: FolderOpen },
  { name: "Activity", href: "/app/activity", icon: Activity },
];

const secondaryNav = [
  { name: "Settings", href: "/app/settings/profile", icon: Settings },
];

interface AppSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:bg-white lg:border-r lg:border-neutral-200/60 lg:transition-all lg:duration-200",
        collapsed ? "lg:w-[72px]" : "lg:w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-neutral-200/60">
        <Link href="/app/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600">
            <Shield className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-neutral-900">
              OBLIQ
            </span>
          )}
        </Link>
        {onToggle && (
          <button
            onClick={onToggle}
            className={cn(
              "ml-auto p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors",
              collapsed && "ml-0 mt-2"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col py-4 px-3 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60"
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-neutral-200/60">
          {secondaryNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-neutral-200/60">
        <a
          href="/auth/logout"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:text-danger hover:bg-danger-light/50 transition-colors"
          title={collapsed ? "Log out" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </a>
      </div>
    </aside>
  );
}
