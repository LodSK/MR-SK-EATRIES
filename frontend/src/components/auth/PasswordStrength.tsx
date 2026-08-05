import { Check, X } from "lucide-react";
import { PASSWORD_REQUIREMENTS, getPasswordScore } from "@/lib/utils/auth";
import { cn } from "@/lib/utils/cn";

interface PasswordStrengthProps {
  password: string;
}

const STRENGTH_LABEL = ["Too weak", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLOR = [
  "bg-destructive",
  "bg-destructive",
  "bg-amber-500",
  "bg-amber-500",
  "bg-emerald-500",
];

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const score = getPasswordScore(password);

  if (!password) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="flex h-1.5 flex-1 gap-1 overflow-hidden rounded-full bg-muted">
          {PASSWORD_REQUIREMENTS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-full flex-1 rounded-full transition-colors",
                i < score ? STRENGTH_COLOR[score - 1] : "bg-transparent"
              )}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-muted-foreground">{STRENGTH_LABEL[score]}</span>
      </div>

      <ul className="grid grid-cols-2 gap-1.5">
        {PASSWORD_REQUIREMENTS.map((req) => {
          const met = req.test(password);
          return (
            <li
              key={req.label}
              className={cn(
                "flex items-center gap-1.5 text-xs",
                met ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
              )}
            >
              {met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              {req.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
