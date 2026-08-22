/* ─── Enums & Union Types ─── */

export type ClientStatus = "active" | "inactive" | "onboarding";
export type EntityType = "individual" | "company" | "partnership" | "llp" | "huf" | "trust";

export type TaskStatus =
  | "not_started"
  | "in_progress"
  | "awaiting_documents"
  | "under_review"
  | "completed"
  | "overdue";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type ComplianceCategory =
  | "gst"
  | "income_tax"
  | "tds"
  | "roc"
  | "audit"
  | "kyc"
  | "financial_statements";

export type DocumentStatus =
  | "requested"
  | "uploaded"
  | "approved"
  | "rejected"
  | "expired";

export type ActivityAction =
  | "task_completed"
  | "task_created"
  | "task_assigned"
  | "task_status_changed"
  | "document_uploaded"
  | "document_requested"
  | "document_approved"
  | "client_added"
  | "reminder_sent"
  | "ai_recommendation"
  | "ai_flagged";

/* ─── Core Entities ─── */

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  pan: string;
  entityType: EntityType;
  status: ClientStatus;
  firmName?: string;
  assignedTo: string;
  complianceTypes: ComplianceCategory[];
  activeTasks: number;
  pendingDocuments: number;
  overdueItems: number;
  createdAt: string;
}

export interface ComplianceTask {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  category: ComplianceCategory;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  dueDate: string;
  completedAt?: string;
  createdAt: string;
  financialYear: string;
  period: string;
  documentRequired: boolean;
  documentsUploaded: number;
  documentsTotal: number;
}

export interface Document {
  id: string;
  clientId: string;
  clientName: string;
  taskId?: string;
  name: string;
  type: string;
  status: DocumentStatus;
  uploadedBy?: string;
  uploadedAt?: string;
  requestedAt: string;
  dueDate: string;
  size?: string;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: ActivityAction;
  description: string;
  clientName: string;
  clientId: string;
  timestamp: string;
  isAI: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "partner" | "manager" | "member";
  firmName: string;
  initials: string;
}

export interface ComplianceCalendarEvent {
  id: string;
  date: string;
  title: string;
  category: ComplianceCategory;
  clientCount: number;
  isDeadline: boolean;
  isToday: boolean;
  isOverdue: boolean;
}

export interface AIRecommendation {
  id: string;
  type: "reminder" | "risk" | "optimization" | "document";
  title: string;
  description: string;
  priority: TaskPriority;
  clientName?: string;
  clientId?: string;
  actionLabel: string;
  timestamp: string;
}

export interface KPIData {
  label: string;
  value: number | string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string;
}
