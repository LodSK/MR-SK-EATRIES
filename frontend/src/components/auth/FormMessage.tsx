import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface FormMessageProps {
  type: "success" | "error";
  children: React.ReactNode;
  className?: string;
}

export function FormMessage({ type, children, className }: FormMessageProps) {
  const isSuccess = type === "success";

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={cn(
        "flex items-start gap-2 rounded-lg border px-4 py-3 text-sm",
        isSuccess
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          : "border-destructive/30 bg-destructive/10 text-destructive",
        className
      )}
    >
      {isSuccess ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 translate-y-0.5" />
      ) : (
        <AlertCircle className="h-4 w-4 shrink-0 translate-y-0.5" />
      )}
      <span>{children}</span>
    </div>
  );
}
