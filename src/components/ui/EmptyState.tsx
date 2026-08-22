import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("bg-white rounded-xl border border-neutral-200 p-12 text-center", className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 mx-auto mb-4">
        <span className="text-neutral-400">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-sm mx-auto mb-6">
        {description}
      </p>
      {action}
    </div>
  );
}
