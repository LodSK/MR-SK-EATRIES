import { httpClient, getApiErrorMessage } from "@/lib/api/httpClient";
import type { JobApplication, JobApplicationPayload, JobApplicationStatus } from "@/types/careers";

export async function submitJobApplication(
  payload: JobApplicationPayload
): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.post("/careers/apply", payload);
    return { success: true, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "We couldn't submit your application. Please try again."),
    };
  }
}

// ── Admin ──────────────────────────────────────────────────────────

function normalizeApplication(raw: JobApplication & { _id?: string }): JobApplication {
  return { ...raw, id: raw.id ?? raw._id ?? "" };
}

export async function adminListJobApplications(): Promise<JobApplication[]> {
  const { data } = await httpClient.get("/admin/job-applications");
  return (data.data as JobApplication[]).map(normalizeApplication);
}

export async function adminUpdateJobApplicationStatus(
  id: string,
  status: JobApplicationStatus
): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.patch(`/admin/job-applications/${id}`, { status });
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}
