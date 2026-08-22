"use client";

import { User, Mail, Building2, Shield } from "lucide-react";

export default function ProfileSettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Profile Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage your account information
        </p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 max-w-2xl">
        <div className="space-y-5">
          <div className="flex items-center gap-4 pb-6 border-b border-neutral-200">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
              <span className="text-xl font-bold text-brand-700">RK</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-neutral-900">
                Rajesh Kumar
              </p>
              <p className="text-sm text-neutral-500">
                Kumar & Associates, Chartered Accountants
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50">
              <User className="h-4 w-4 text-neutral-400" />
              <div>
                <p className="text-xs text-neutral-500">Full Name</p>
                <p className="text-sm font-medium text-neutral-900">
                  Rajesh Kumar
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50">
              <Mail className="h-4 w-4 text-neutral-400" />
              <div>
                <p className="text-xs text-neutral-500">Email</p>
                <p className="text-sm font-medium text-neutral-900">
                  rajesh@kumarassociates.com
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50">
              <Building2 className="h-4 w-4 text-neutral-400" />
              <div>
                <p className="text-xs text-neutral-500">Firm Name</p>
                <p className="text-sm font-medium text-neutral-900">
                  Kumar & Associates, Chartered Accountants
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50">
              <Shield className="h-4 w-4 text-neutral-400" />
              <div>
                <p className="text-xs text-neutral-500">Role</p>
                <p className="text-sm font-medium text-neutral-900">Partner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
