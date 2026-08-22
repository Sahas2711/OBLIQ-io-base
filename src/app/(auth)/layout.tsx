import Link from "next/link";
import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* Top nav */}
      <header className="bg-white border-b border-neutral-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group" aria-label="OBLIQ home">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 transition-colors group-hover:bg-brand-700">
                <Shield className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold tracking-tight text-neutral-900">
                OBLIQ
              </span>
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </header>

      {/* Auth content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200/60 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} OBLIQ. All rights reserved. Made for Indian CA firms.
          </p>
        </div>
      </footer>
    </div>
  );
}
