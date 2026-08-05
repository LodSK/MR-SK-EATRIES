"use client";

import * as React from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { submitJobApplication } from "@/lib/api/careers";
import { JOB_OPENINGS } from "@/lib/constants/careers-data";
import { Button } from "@/components/ui/button";

const INPUT_CLASS =
  "h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary";

interface JobApplicationFormProps {
  position: string;
  onPositionChange: (position: string) => void;
}

export function JobApplicationForm({ position, onPositionChange }: JobApplicationFormProps) {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!position) {
      setError("Please select a position.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const result = await submitJobApplication({ fullName, email, phone, position, message });
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccessMessage(result.message);
    setFullName("");
    setEmail("");
    setPhone("");
    setMessage("");
  }

  if (successMessage) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-brand-primary dark:text-brand-accent" />
        <p className="font-display text-lg font-bold">Application Received</p>
        <p className="text-sm text-muted-foreground">{successMessage}</p>
        <Button variant="outline" size="sm" onClick={() => setSuccessMessage(null)}>
          Apply for another role
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div>
        <label htmlFor="job-position" className="mb-1.5 block text-sm font-semibold">
          Position
        </label>
        <select
          id="job-position"
          required
          value={position}
          onChange={(e) => onPositionChange(e.target.value)}
          className={INPUT_CLASS}
        >
          <option value="" disabled>
            Select a position
          </option>
          {JOB_OPENINGS.map((job) => (
            <option key={job.id} value={job.title}>
              {job.title}
            </option>
          ))}
          <option value="General Application">General Application</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="applicant-name" className="mb-1.5 block text-sm font-semibold">
            Full Name
          </label>
          <input
            id="applicant-name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="applicant-phone" className="mb-1.5 block text-sm font-semibold">
            Phone
          </label>
          <input
            id="applicant-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <div>
        <label htmlFor="applicant-email" className="mb-1.5 block text-sm font-semibold">
          Email
        </label>
        <input
          id="applicant-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="applicant-message" className="mb-1.5 block text-sm font-semibold">
          Tell us about yourself
        </label>
        <textarea
          id="applicant-message"
          required
          minLength={10}
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Relevant experience, availability, and why you'd like to join us."
          className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus-visible:border-brand-primary"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Submit Application
      </Button>
    </form>
  );
}
