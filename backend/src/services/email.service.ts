import nodemailer from "nodemailer";
import { env } from "@/config/env";
import { logger } from "@/config/logger";

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

/**
 * Provider-agnostic email interface. Every other part of the backend
 * calls `sendEmail()` or one of the templated helpers below — never
 * `nodemailer` directly. Swapping to SendGrid/Postmark/SES later means
 * changing only the transport inside this file.
 */
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.password } : undefined,
    });
  }
  return transporter;
}

export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
  if (!env.smtp.host) {
    // No SMTP configured (e.g. local dev without credentials) — log instead of failing the request.
    logger.warn(`[email:skipped] To: ${to} | Subject: ${subject}`);
    return;
  }

  await getTransporter().sendMail({ from: env.smtp.from, to, subject, html });
}

function wrapTemplate(title: string, bodyHtml: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #C62828;">MR_SK EATRIES</h2>
      <h3>${title}</h3>
      ${bodyHtml}
      <p style="color: #888; font-size: 12px; margin-top: 32px;">Taste Beyond Expectations</p>
    </div>
  `;
}

export async function sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
  await sendEmail({
    to,
    subject: "Verify your MR_SK EATRIES account",
    html: wrapTemplate(
      "Verify your email",
      `<p>Thanks for creating an account. Click below to verify your email address:</p>
       <p><a href="${verifyUrl}">${verifyUrl}</a></p>`
    ),
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  await sendEmail({
    to,
    subject: "Reset your MR_SK EATRIES password",
    html: wrapTemplate(
      "Reset your password",
      `<p>We received a request to reset your password. This link expires in 1 hour:</p>
       <p><a href="${resetUrl}">${resetUrl}</a></p>
       <p>If you didn't request this, you can safely ignore this email.</p>`
    ),
  });
}

export async function sendOrderConfirmationEmail(
  to: string,
  orderNumber: string,
  grandTotal: number,
  currency: string
): Promise<void> {
  await sendEmail({
    to,
    subject: `Order Confirmed — ${orderNumber}`,
    html: wrapTemplate(
      "Your order is confirmed",
      `<p>Order <strong>${orderNumber}</strong> has been received.</p>
       <p>Total: <strong>${currency} ${grandTotal.toFixed(2)}</strong></p>`
    ),
  });
}

export async function sendReservationConfirmationEmail(
  to: string,
  reservationNumber: string,
  date: string,
  time: string,
  partySize: number
): Promise<void> {
  await sendEmail({
    to,
    subject: `Reservation Confirmed — ${reservationNumber}`,
    html: wrapTemplate(
      "Your table is booked",
      `<p>Reservation <strong>${reservationNumber}</strong> is confirmed.</p>
       <p>We'll see you on <strong>${date}</strong> at <strong>${time}</strong> for a party of ${partySize}.</p>`
    ),
  });
}
