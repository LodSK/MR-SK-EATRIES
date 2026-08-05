import { MapPin, Briefcase } from "lucide-react";
import type { JobOpening } from "@/types/careers";
import { Badge } from "@/components/shared/Badge";

interface JobOpeningCardProps {
  job: JobOpening;
  isSelected: boolean;
  onSelect: () => void;
}

export function JobOpeningCard({ job, isSelected, onSelect }: JobOpeningCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full flex-col gap-3 rounded-2xl border p-5 text-left transition-colors ${
        isSelected
          ? "border-brand-primary bg-brand-primary/5 dark:border-brand-accent dark:bg-brand-accent/10"
          : "border-border bg-card hover:border-brand-primary/40"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-bold">{job.title}</h3>
          <p className="text-xs text-muted-foreground">{job.department}</p>
        </div>
        <Badge variant={job.type === "Full-time" ? "primary" : "outline"}>{job.type}</Badge>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{job.description}</p>
      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" />
        {job.location}
      </span>
      {isSelected && (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-brand-primary dark:text-brand-accent">
          <Briefcase className="h-3.5 w-3.5" />
          Selected for application below
        </span>
      )}
    </button>
  );
}
