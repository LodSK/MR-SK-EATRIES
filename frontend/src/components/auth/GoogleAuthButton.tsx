import { getGoogleAuthUrl } from "@/lib/api/auth";

/**
 * A plain `<a>`, not a client-side click handler — this has to be a real
 * top-level browser navigation to the backend, which itself redirects to
 * Google. Nothing about this flow is an AJAX call.
 */
export function GoogleAuthButton() {
  return (
    <a
      href={getGoogleAuthUrl()}
      className="flex h-11 w-full items-center justify-center gap-3 rounded-md border border-border bg-card text-sm font-semibold transition-colors hover:bg-muted"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.98h3.86c2.26-2.09 3.56-5.17 3.56-8.8Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.92l-3.86-2.98c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.07C3.25 21.3 7.31 24 12 24Z"
        />
        <path
          fill="#FBBC05"
          d="M5.27 14.29A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.37-2.29V6.64H1.28A11.96 11.96 0 0 0 0 12c0 1.93.46 3.76 1.28 5.36l3.99-3.07Z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.64l3.99 3.07C6.22 6.86 8.87 4.75 12 4.75Z"
        />
      </svg>
      Continue with Google
    </a>
  );
}
