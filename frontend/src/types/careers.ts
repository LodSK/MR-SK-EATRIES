export type EmploymentType = "Full-time" | "Part-time";

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: EmploymentType;
  description: string;
}

export interface JobApplicationPayload {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  message: string;
}

export type JobApplicationStatus = "new" | "reviewed" | "contacted" | "rejected";

export interface JobApplication extends JobApplicationPayload {
  id: string;
  status: JobApplicationStatus;
  createdAt: string;
}
