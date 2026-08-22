import { Users, Plus } from "lucide-react";

export default function TeamSettingsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Team</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage your firm&rsquo;s team members
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700">
          <Plus className="h-4 w-4" />
          Invite Member
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 mx-auto mb-4">
          <Users className="h-7 w-7 text-neutral-400" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-1">
          Team management coming soon
        </h3>
        <p className="text-sm text-neutral-500 max-w-sm mx-auto">
          Invite team members, assign roles, and manage permissions. Coming in
          the next release.
        </p>
      </div>
    </div>
  );
}
