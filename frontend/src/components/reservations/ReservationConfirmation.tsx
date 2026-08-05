"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";
import type { Reservation } from "@/types/reservation";
import { ReservationSummaryCard } from "@/components/reservations/ReservationSummaryCard";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/animations/variants";

interface ReservationConfirmationProps {
  reservation: Reservation;
}

export function ReservationConfirmation({ reservation }: ReservationConfirmationProps) {
  return (
    <motion.div
      variants={staggerContainer(0.12)}
      initial="hidden"
      animate="visible"
      className="mx-auto flex max-w-lg flex-col items-center gap-5 text-center"
    >
      <motion.div
        variants={fadeUp}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
      >
        <CheckCircle2 className="h-8 w-8" />
      </motion.div>

      <motion.h1 variants={fadeUp} className="font-display text-3xl font-bold">
        Table Reserved!
      </motion.h1>

      <motion.p variants={fadeUp} className="text-muted-foreground">
        A confirmation has been sent to <strong>{reservation.email}</strong>.
      </motion.p>

      <motion.div variants={fadeUp} className="w-full">
        <ReservationSummaryCard reservation={reservation} />
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm"
      >
        <Clock className="h-4 w-4 text-brand-primary dark:text-brand-accent" />
        Please arrive within 15 minutes of your reservation time.
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 sm:flex-row">
        <Button asChild size="lg" variant="accent">
          <Link href="/menu">Browse the Menu</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
