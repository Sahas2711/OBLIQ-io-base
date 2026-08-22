"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Filter,
  ChevronRight,
  Building2,
  User,
  Users,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useClients } from "@/lib/hooks/use-data";
import { clients as allClients } from "@/lib/data/mock-data";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

const statusFilters = [
  { key: "", label: "All" },
  { key: "active", label: "Active" },
  { key: "onboarding", label: "Onboarding" },
  { key: "inactive", label: "Inactive" },
];

const entityFilters = [
  { key: "", label: "All Types" },
  { key: "company", label: "Company" },
  { key: "individual", label: "Individual" },
  { key: "partnership", label: "Partnership" },
  { key: "llp", label: "LLP" },
  { key: "huf", label: "HUF" },
  { key: "trust", label: "Trust" },
];

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: "bg-success-light", text: "text-success", dot: "bg-success" },
  inactive: { bg: "bg-neutral-100", text: "text-neutral-500", dot: "bg-neutral-400" },
  onboarding: { bg: "bg-brand-50", text: "text-brand-700", dot: "bg-brand-500" },
};

const entityIcons: Record<string, React.ReactNode> = {
  company: <Building2 className="h-4 w-4" />,
  individual: <User className="h-4 w-4" />,
  partnership: <Users className="h-4 w-4" />,
  llp: <Building2 className="h-4 w-4" />,
  huf: <Users className="h-4 w-4" />,
  trust: <Building2 className="h-4 w-4" />,
};

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { clients, loading } = useClients({
    search,
    status: statusFilter,
    entityType: entityFilter,
  });

  const stats = useMemo(() => {
    const active = allClients.filter((c) => c.status === "active").length;
    const onboarding = allClients.filter((c) => c.status === "onboarding").length;
    const totalTasks = allClients.reduce((sum, c) => sum + c.activeTasks, 0);
    const totalPending = allClients.reduce((sum, c) => sum + c.pendingDocuments, 0);
    return { active, onboarding, totalTasks, totalPending };
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Clients</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {stats.active} active · {stats.onboarding} onboarding · {stats.totalPending} pending documents
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 shrink-0">
          <Plus className="h-4 w-4" />
          Add Client
        </button>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, email, PAN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
              showFilters
                ? "border-brand-200 bg-brand-50 text-brand-700"
                : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
            )}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 p-4 bg-white rounded-xl border border-neutral-200">
            <div>
              <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">
                Status
              </label>
              <div className="flex gap-1">
                {statusFilters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setStatusFilter(f.key)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                      statusFilter === f.key
                        ? "bg-brand-50 text-brand-700"
                        : "text-neutral-500 hover:bg-neutral-100"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">
                Entity Type
              </label>
              <div className="flex gap-1 flex-wrap">
                {entityFilters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setEntityFilter(f.key)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                      entityFilter === f.key
                        ? "bg-brand-50 text-brand-700"
                        : "text-neutral-500 hover:bg-neutral-100"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Client Table */}
      {clients.length === 0 ? (
        <EmptyState
          icon={<Users className="h-7 w-7" />}
          title={
            search || statusFilter || entityFilter
              ? "No clients match your filters"
              : "No clients yet"
          }
          description={
            search || statusFilter || entityFilter
              ? "Try adjusting your search or filter criteria."
              : "Add your first client to start tracking compliance tasks and deadlines."
          }
          action={
            search || statusFilter || entityFilter ? (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                  setEntityFilter("");
                }}
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Clear filters
              </button>
            ) : (
              <button className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700">
                <Plus className="h-4 w-4" />
                Add First Client
              </button>
            )
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-5 py-3">
                    Client
                  </th>
                  <th className="text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-5 py-3">
                    Type
                  </th>
                  <th className="text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-5 py-3">
                    Status
                  </th>
                  <th className="text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-5 py-3">
                    Tasks
                  </th>
                  <th className="text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-5 py-3">
                    Pending Docs
                  </th>
                  <th className="text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-5 py-3">
                    Overdue
                  </th>
                  <th className="text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-5 py-3">
                    Assigned To
                  </th>
                  <th className="w-10 px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {clients.map((client) => {
                  const ss = statusStyles[client.status] || statusStyles.active;
                  return (
                    <tr
                      key={client.id}
                      className="hover:bg-neutral-50/50 transition-colors group"
                    >
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/app/clients/${client.id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="h-9 w-9 rounded-lg bg-brand-50 flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors">
                            <span className="text-xs font-bold text-brand-700">
                              {client.name
                                .split(" ")
                                .slice(0, 2)
                                .map((w) => w[0])
                                .join("")}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate group-hover:text-brand-700 transition-colors">
                              {client.name}
                            </p>
                            <p className="text-xs text-neutral-500 truncate">
                              {client.pan}
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-neutral-500">
                          {entityIcons[client.entityType]}
                          <span className="text-sm capitalize">{client.entityType}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
                            ss.bg,
                            ss.text
                          )}
                        >
                          <span className={cn("h-1.5 w-1.5 rounded-full", ss.dot)} />
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium text-neutral-900">
                          {client.activeTasks}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            client.pendingDocuments > 0
                              ? "text-warning"
                              : "text-neutral-900"
                          )}
                        >
                          {client.pendingDocuments}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            client.overdueItems > 0
                              ? "text-danger"
                              : "text-success"
                          )}
                        >
                          {client.overdueItems}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-neutral-600">
                          {client.assignedTo}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:text-brand-500 transition-colors" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-neutral-100">
            {clients.map((client) => {
              const ss = statusStyles[client.status] || statusStyles.active;
              return (
                <Link
                  key={client.id}
                  href={`/app/clients/${client.id}`}
                  className="block p-4 hover:bg-neutral-50/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-brand-700">
                        {client.name
                          .split(" ")
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {client.name}
                        </p>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0",
                            ss.bg,
                            ss.text
                          )}
                        >
                          <span className={cn("h-1 w-1 rounded-full", ss.dot)} />
                          {client.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {client.entityType} · {client.pan}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-neutral-500">
                          <span className="font-medium text-neutral-700">{client.activeTasks}</span> tasks
                        </span>
                        {client.pendingDocuments > 0 && (
                          <span className="text-xs text-warning">
                            {client.pendingDocuments} docs pending
                          </span>
                        )}
                        {client.overdueItems > 0 && (
                          <span className="text-xs text-danger">
                            {client.overdueItems} overdue
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-neutral-300 shrink-0 mt-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
