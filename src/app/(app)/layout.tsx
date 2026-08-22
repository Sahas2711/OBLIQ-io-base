"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppTopbar } from "@/components/layout/AppTopbar";
import { MobileSidebar } from "@/components/layout/MobileSidebarOverlay";
import { ToastProvider } from "@/components/ui/Toast";
import { AIAssistant } from "@/components/ai/AIAssistant";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    const handler = () => setAiOpen(true);
    window.addEventListener("open-ai-assistant", handler);
    return () => window.removeEventListener("open-ai-assistant", handler);
  }, []);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-neutral-50">
        {/* Desktop sidebar */}
        <AppSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Mobile sidebar */}
        <MobileSidebar
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main content */}
        <div
          className={`transition-all duration-200 ${
            sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-60"
          }`}
        >
          {/* Topbar (search + notifications + profile) */}
          <AppTopbar
            onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            mobileMenuOpen={mobileMenuOpen}
          />

          {/* Page content */}
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>

        {/* AI Assistant Floating Button */}
        <button
          onClick={() => setAiOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg hover:bg-brand-700 hover:shadow-xl transition-all group"
          title="Open Obliq AI Assistant"
        >
          <Sparkles className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </button>

        {/* AI Assistant Panel */}
        <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
      </div>
    </ToastProvider>
  );
}
