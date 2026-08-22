import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-neutral-100 text-neutral-700",
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  danger: "bg-danger-light text-danger",
  info: "bg-brand-50 text-brand-700",
  outline: "border border-neutral-200 text-neutral-600 bg-white",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium leading-none",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

/* Domain-specific badge factories */
export function TaskStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    not_started: { label: "Not Started", variant: "default" },
    in_progress: { label: "In Progress", variant: "info" },
    awaiting_documents: { label: "Awaiting Docs", variant: "warning" },
    under_review: { label: "Under Review", variant: "info" },
    completed: { label: "Completed", variant: "success" },
    overdue: { label: "Overdue", variant: "danger" },
  };
  const config = map[status] || { label: status, variant: "default" as BadgeVariant };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    low: { label: "Low", variant: "default" },
    medium: { label: "Medium", variant: "info" },
    high: { label: "High", variant: "warning" },
    urgent: { label: "Urgent", variant: "danger" },
  };
  const config = map[priority] || { label: priority, variant: "default" as BadgeVariant };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function CategoryBadge({ category }: { category: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    gst: { label: "GST", variant: "info" },
    income_tax: { label: "Income Tax", variant: "success" },
    tds: { label: "TDS", variant: "warning" },
    roc: { label: "ROC", variant: "danger" },
    audit: { label: "Audit", variant: "default" },
    kyc: { label: "KYC", variant: "outline" },
    financial_statements: { label: "Financials", variant: "info" },
  };
  const config = map[category] || { label: category, variant: "default" as BadgeVariant };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
