import { cn } from "@/lib/utils/cn";

interface DashboardCardProps {
  title?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function DashboardCard({ title, action, className, children }: DashboardCardProps) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-6", className)}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-3">
          {title && <h2 className="font-display text-lg font-bold">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
