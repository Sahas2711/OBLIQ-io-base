import { Activity, Sparkles } from "lucide-react";

export default function ActivityPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Activity Feed</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Complete audit trail of all actions across your firm
        </p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 mx-auto mb-4">
          <Activity className="h-7 w-7 text-neutral-400" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-1">
          No activity yet
        </h3>
        <p className="text-sm text-neutral-500 max-w-sm mx-auto">
          Activity will appear here as your team completes tasks, uploads
          documents, and manages clients.
        </p>
      </div>
    </div>
  );
}
