import type { ReservationStatus } from "@/types/reservation";
import { Badge, type BadgeVariant } from "@/components/shared/Badge";

const STATUS_VARIANT: Record<ReservationStatus, BadgeVariant> = {
  pending: "outline",
  confirmed: "success",
  seated: "primary",
  completed: "secondary",
  cancelled: "spicy",
  "no-show": "spicy",
};

const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  seated: "Seated",
  completed: "Completed",
  cancelled: "Cancelled",
  "no-show": "No Show",
};

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}
