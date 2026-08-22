"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Search,
  Plus,
  Filter,
  FileText,
  Upload,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Loader2,
  Send,
  Link2,
  Calendar,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { documents as allDocs, clients } from "@/lib/data/mock-data";
import { useToast } from "@/components/ui/Toast";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";

/* ─── Status config ─── */

const statusConfig: Record<string, { label: string; variant: BadgeVariant; icon: React.ReactNode }> = {
  requested: { label: "Requested", variant: "warning", icon: <Clock className="h-3.5 w-3.5" /> },
  uploaded: { label: "Uploaded", variant: "info", icon: <Upload className="h-3.5 w-3.5" /> },
  under_review: { label: "Under Review", variant: "info", icon: <Eye className="h-3.5 w-3.5" /> },
  approved: { label: "Approved", variant: "success", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  rejected: { label: "Rejected", variant: "danger", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
};

const statusFilters = [
  { key: "", label: "All" },
  { key: "requested", label: "Requested" },
  { key: "uploaded", label: "Uploaded" },
  { key: "under_review", label: "Under Review" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

/* ─── Upload Modal ─── */

function UploadModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    clientId: "",
    taskId: "",
    type: "pdf",
    dueDate: "",
    notes: "",
  });
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file.name);
      setForm((prev) => ({
        ...prev,
        name: file.name,
        type: file.name.split(".").pop() || "pdf",
      }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      setForm((prev) => ({
        ...prev,
        name: file.name,
        type: file.name.split(".").pop() || "pdf",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientId) {
      toast({ message: "Please select a client", type: "error" });
      return;
    }
    if (!form.name.trim()) {
      toast({ message: "Please enter a document name", type: "error" });
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    toast({ message: `Document "${form.name}" uploaded successfully`, type: "success" });
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-xl border border-neutral-200 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Upload Document</h2>
          <button onClick={onClose} className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
              dragOver
                ? "border-brand-400 bg-brand-50"
                : selectedFile
                ? "border-success bg-success-light/30"
                : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
            )}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              className="hidden"
              accept=".pdf,.xlsx,.xls,.csv,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
            />
            {selectedFile ? (
              <>
                <FileText className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-sm font-medium text-neutral-900">{selectedFile}</p>
                <p className="text-xs text-neutral-500 mt-1">Click to replace</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-neutral-700">
                  Drop file here or click to browse
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  PDF, Excel, CSV, Word, Images — up to 25MB
                </p>
              </>
            )}
          </div>

          {/* Document name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Document Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. GST Invoice Register — August 2025"
              className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Client + Task */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Client *</label>
              <select
                value={form.clientId}
                onChange={(e) => setForm((p) => ({ ...p, clientId: e.target.value }))}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Select client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Optional notes about this document..."
              rows={2}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-700 rounded-lg border border-neutral-300 hover:bg-neutral-50 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedFile}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Uploading...</>
              ) : (
                <><Upload className="h-4 w-4" />Upload Document</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Request Document Modal ─── */

function RequestModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    clientId: "",
    name: "",
    dueDate: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientId || !form.name.trim()) {
      toast({ message: "Please fill in all required fields", type: "error" });
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    const client = clients.find((c) => c.id === form.clientId);
    toast({ message: `Document request sent to ${client?.name || "client"}`, type: "success" });
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-xl border border-neutral-200 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Request Document</h2>
          <button onClick={onClose} className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Client *</label>
            <select
              value={form.clientId}
              onChange={(e) => setForm((p) => ({ ...p, clientId: e.target.value }))}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Select client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Document Needed *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Bank Statement — August 2025"
              className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Due By</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-700 rounded-lg border border-neutral-300 hover:bg-neutral-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Documents Page ─── */

export default function DocumentsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showRequest, setShowRequest] = useState(false);

  const filteredDocs = useMemo(() => {
    let result = [...allDocs];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(s) ||
          d.clientName.toLowerCase().includes(s)
      );
    }
    if (statusFilter) {
      result = result.filter((d) => d.status === statusFilter);
    }
    if (clientFilter) {
      result = result.filter((d) => d.clientId === clientFilter);
    }
    return result.sort(
      (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    );
  }, [search, statusFilter, clientFilter]);

  const stats = useMemo(() => ({
    total: allDocs.length,
    requested: allDocs.filter((d) => d.status === "requested").length,
    uploaded: allDocs.filter((d) => d.status === "uploaded").length,
    approved: allDocs.filter((d) => d.status === "approved").length,
  }), []);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Documents</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {stats.requested} requested · {stats.uploaded} uploaded · {stats.approved} approved
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRequest(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <Send className="h-4 w-4" />
            Request
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700"
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
            showFilters ? "border-brand-200 bg-brand-50 text-brand-700" : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
          )}
        >
          <Filter className="h-4 w-4" />
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 bg-white rounded-xl border border-neutral-200 mb-4">
          <div>
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Status</label>
            <div className="flex gap-1">
              {statusFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    statusFilter === f.key ? "bg-brand-50 text-brand-700" : "text-neutral-500 hover:bg-neutral-100"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">Client</label>
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">All Clients</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Document List */}
      {filteredDocs.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-7 w-7" />}
          title={search || statusFilter || clientFilter ? "No documents match" : "No documents yet"}
          description={search || statusFilter || clientFilter ? "Try adjusting your filters." : "Upload or request documents to get started."}
          action={
            <div className="flex gap-2">
              <button onClick={() => setShowRequest(true)} className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                <Send className="h-4 w-4" />Request
              </button>
              <button onClick={() => setShowUpload(true)} className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
                <Upload className="h-4 w-4" />Upload
              </button>
            </div>
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-5 py-3">Document</th>
                  <th className="text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-5 py-3">Client</th>
                  <th className="text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-5 py-3">Type</th>
                  <th className="text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-5 py-3">Requested</th>
                  <th className="text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-5 py-3">Due</th>
                  <th className="w-10 px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredDocs.map((doc) => {
                  const sc = statusConfig[doc.status] || statusConfig.requested;
                  return (
                    <tr key={doc.id} className="hover:bg-neutral-50/50 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                            <FileText className="h-4 w-4 text-neutral-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate max-w-[240px]">{doc.name}</p>
                            {doc.size && <p className="text-xs text-neutral-500">{doc.size}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-neutral-700">{doc.clientName}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-medium text-neutral-500 uppercase">{doc.type}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={sc.variant}>{sc.label}</Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-neutral-500">{doc.requestedAt}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-neutral-500">{doc.dueDate}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button className="p-1 rounded text-neutral-400 hover:text-brand-600 hover:bg-brand-50 opacity-0 group-hover:opacity-100 transition-all">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-neutral-100">
            {filteredDocs.map((doc) => {
              const sc = statusConfig[doc.status] || statusConfig.requested;
              return (
                <div key={doc.id} className="p-4 hover:bg-neutral-50/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-neutral-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-neutral-900 truncate">{doc.name}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{doc.clientName} · {doc.type.toUpperCase()}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={sc.variant}>{sc.label}</Badge>
                        <span className="text-[11px] text-neutral-400">Due {doc.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <UploadModal open={showUpload} onClose={() => setShowUpload(false)} onSuccess={() => {}} />
      <RequestModal open={showRequest} onClose={() => setShowRequest(false)} onSuccess={() => {}} />
    </div>
  );
}
