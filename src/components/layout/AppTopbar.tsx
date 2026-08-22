"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Shield, Search, Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { notifications, currentUser } from "@/lib/data/mock-data";

interface AppTopbarProps {
  onMobileMenuToggle: () => void;
  mobileMenuOpen: boolean;
}

export function AppTopbar({ onMobileMenuToggle, mobileMenuOpen }: AppTopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-neutral-200/60">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile menu + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="p-1.5 rounded-md text-neutral-600 hover:bg-neutral-100 lg:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/app/dashboard" className="flex items-center gap-2 lg:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600">
              <Shield className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold text-neutral-900">OBLIQ</span>
          </Link>
          {/* Desktop: search bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md ml-0 lg:ml-0">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search clients, tasks, documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-4 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Right: Mobile search toggle, notifications, profile */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile search toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-md text-neutral-600 hover:bg-neutral-100 lg:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setProfileOpen(false);
              }}
              className="relative p-2 rounded-md text-neutral-600 hover:bg-neutral-100 transition-colors"
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl border border-neutral-200 shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-neutral-900">Notifications</h3>
                  <button className="text-xs font-medium text-brand-600 hover:text-brand-700">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "px-4 py-3 hover:bg-neutral-50 transition-colors cursor-pointer",
                        !n.read && "bg-brand-50/30"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && (
                          <span className="h-2 w-2 rounded-full bg-brand-500 shrink-0 mt-1.5" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-neutral-900">{n.title}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">{n.message}</p>
                          <p className="text-[11px] text-neutral-400 mt-1">
                            {new Date(n.timestamp).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-neutral-200">
                  <Link
                    href="/app/activity"
                    onClick={() => setNotifOpen(false)}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700"
                  >
                    View all activity
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile menu */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center">
                <span className="text-xs font-semibold text-brand-700">
                  {currentUser.initials}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-neutral-900 leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-neutral-500">{currentUser.firmName}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-neutral-400 hidden sm:block" />
            </button>

            {/* Profile dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-neutral-200 shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-neutral-200">
                  <p className="text-sm font-semibold text-neutral-900">{currentUser.name}</p>
                  <p className="text-xs text-neutral-500">{currentUser.email}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5 capitalize">
                    {currentUser.role} · {currentUser.firmName}
                  </p>
                </div>
                <div className="py-1">
                  <Link
                    href="/app/settings/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    <User className="h-4 w-4 text-neutral-400" />
                    Profile Settings
                  </Link>
                  <Link
                    href="/app/settings/team"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    <Settings className="h-4 w-4 text-neutral-400" />
                    Team Settings
                  </Link>
                </div>
                <div className="border-t border-neutral-200 py-1">
                  <a
                    href="/auth/logout"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-danger hover:bg-danger-light/50"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="px-4 pb-3 lg:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search clients, tasks..."
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
        </div>
      )}
    </header>
  );
}
