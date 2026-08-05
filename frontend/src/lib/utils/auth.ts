import type { UserRole } from "@/types/auth";

/**
 * Every permission the app might gate behavior on. Adding a new
 * permission is a one-line addition here plus one line in
 * ROLE_PERMISSIONS — no component ever hardcodes a role check like
 * `user.role === "admin"`; they call `can()`/`isRole()` from `useAuth()`
 * instead, so the actual policy lives in exactly one place.
 */
export type Permission =
  | "orders:view-own"
  | "orders:view-all"
  | "menu:edit"
  | "reservations:manage"
  | "users:manage"
  | "dashboard:staff"
  | "dashboard:admin";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  customer: ["orders:view-own"],
  staff: ["orders:view-own", "orders:view-all", "reservations:manage", "dashboard:staff"],
  manager: [
    "orders:view-own",
    "orders:view-all",
    "menu:edit",
    "reservations:manage",
    "users:manage",
    "dashboard:staff",
  ],
  admin: [
    "orders:view-own",
    "orders:view-all",
    "menu:edit",
    "reservations:manage",
    "users:manage",
    "dashboard:staff",
    "dashboard:admin",
  ],
};

export function hasPermission(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function hasRole(role: UserRole | undefined, allowed: UserRole[]): boolean {
  if (!role) return false;
  return allowed.includes(role);
}

/**
 * Single source of truth for "where does this role land after signing in."
 * Used by LoginForm's post-login redirect and ProtectedRoute's
 * staff-away-from-/account redirect (Sprint 12.1) — one place, not two
 * separate hardcoded role checks that could drift out of sync.
 */
export function getRoleHomeRoute(role: UserRole | undefined): string {
  return role && role !== "customer" ? "/admin/dashboard" : "/account/dashboard";
}

export function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase() || "?";
}

export interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

/**
 * The single source of truth for password policy — both the Zod schema
 * (`lib/validations/auth.ts`) and the `PasswordStrength` UI checklist
 * express this same policy, one for gating submission, one for guiding
 * the user as they type.
 */
export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "One number", test: (pw) => /[0-9]/.test(pw) },
];

export function getPasswordScore(password: string): number {
  return PASSWORD_REQUIREMENTS.filter((r) => r.test(password)).length;
}
