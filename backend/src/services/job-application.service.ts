import { JobApplication, type IJobApplication, type JobApplicationStatus } from "@/models/JobApplication.model";
import { ApiError } from "@/utils/ApiError";

export async function createJobApplication(data: {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  message: string;
}): Promise<IJobApplication> {
  return JobApplication.create(data);
}

export async function listJobApplications(): Promise<IJobApplication[]> {
  return JobApplication.find().sort({ createdAt: -1 });
}

export async function updateJobApplicationStatus(
  id: string,
  status: JobApplicationStatus
): Promise<IJobApplication> {
  const application = await JobApplication.findByIdAndUpdate(id, { status }, { new: true });
  if (!application) throw ApiError.notFound("Application not found.");
  return application;
}
