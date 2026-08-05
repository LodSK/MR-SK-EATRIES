import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import * as jobApplicationService from "@/services/job-application.service";

export const createApplication = asyncHandler(async (req: Request, res: Response) => {
  const application = await jobApplicationService.createJobApplication(req.body);
  return ApiResponse.created(res, application, "Application received — we'll be in touch if it's a fit.");
});

// ── Admin ──────────────────────────────────────────────────────────

export const listApplications = asyncHandler(async (_req: Request, res: Response) => {
  const applications = await jobApplicationService.listJobApplications();
  return ApiResponse.ok(res, applications);
});

export const updateApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
  const application = await jobApplicationService.updateJobApplicationStatus(
    req.params.id as string,
    req.body.status
  );
  return ApiResponse.ok(res, application, "Application updated.");
});
