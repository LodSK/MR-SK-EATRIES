"use client";

import * as React from "react";
import { Briefcase } from "lucide-react";
import { adminListJobApplications, adminUpdateJobApplicationStatus } from "@/lib/api/careers";
import type { JobApplication, JobApplicationStatus } from "@/types/careers";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUS_VARIANT: Record<JobApplicationStatus, "outline" | "primary" | "success" | "spicy"> = {
  new: "primary",
  reviewed: "outline",
  contacted: "success",
  rejected: "spicy",
};

const STATUS_OPTIONS: JobApplicationStatus[] = ["new", "reviewed", "contacted", "rejected"];

export function AdminJobApplications() {
  const [applications, setApplications] = React.useState<JobApplication[] | null>(null);

  const load = React.useCallback(() => {
    adminListJobApplications()
      .then(setApplications)
      .catch(() => setApplications([]));
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleStatusChange(id: string, status: JobApplicationStatus) {
    await adminUpdateJobApplicationStatus(id, status);
    load();
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-2xl font-bold">Job Applications</h2>
        <p className="mt-1 text-sm text-muted-foreground">Applications submitted through the Careers page.</p>
      </div>

      {applications === null ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState icon={<Briefcase className="h-6 w-6" strokeWidth={1.5} />} title="No applications yet" />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          {applications.map((application) => (
            <div key={application.id} className="flex flex-wrap items-start justify-between gap-3 p-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">{application.fullName}</span>
                  <Badge variant={STATUS_VARIANT[application.status]}>{application.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {application.position} · {application.email} · {application.phone}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{application.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Applied {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Select
                value={application.status}
                onValueChange={(v) => handleStatusChange(application.id, v as JobApplicationStatus)}
              >
                <SelectTrigger className="w-36" aria-label="Update status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status} className="capitalize">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
