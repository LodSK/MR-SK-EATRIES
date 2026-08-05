"use client";

import * as React from "react";
import { JOB_OPENINGS } from "@/lib/constants/careers-data";
import { JobOpeningCard } from "@/components/careers/JobOpeningCard";
import { JobApplicationForm } from "@/components/careers/JobApplicationForm";

export function CareersPageContent() {
  const [position, setPosition] = React.useState("");

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr]">
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-bold">Open Positions</h2>
        {JOB_OPENINGS.map((job) => (
          <JobOpeningCard
            key={job.id}
            job={job}
            isSelected={position === job.title}
            onSelect={() => setPosition(job.title)}
          />
        ))}
      </div>

      <div>
        <h2 className="mb-4 font-display text-xl font-bold">Apply</h2>
        <JobApplicationForm position={position} onPositionChange={setPosition} />
      </div>
    </div>
  );
}
