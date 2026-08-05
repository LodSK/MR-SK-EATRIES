"use client";

import * as React from "react";
import { Mail, MailOpen } from "lucide-react";
import { adminListContactMessages, adminMarkContactMessageRead } from "@/lib/api/contact";
import type { ContactMessage } from "@/types/contact";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/ui/button";

export function AdminContactMessages() {
  const [messages, setMessages] = React.useState<ContactMessage[] | null>(null);

  const load = React.useCallback(() => {
    adminListContactMessages()
      .then(setMessages)
      .catch(() => setMessages([]));
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleToggle(id: string, isRead: boolean) {
    await adminMarkContactMessageRead(id, !isRead);
    load();
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-2xl font-bold">Contact Messages</h2>
        <p className="mt-1 text-sm text-muted-foreground">Messages submitted through the public Contact page.</p>
      </div>

      {messages === null ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <EmptyState icon={<Mail className="h-6 w-6" strokeWidth={1.5} />} title="No messages yet" />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-wrap items-start justify-between gap-3 p-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">{message.subject}</span>
                  {!message.isRead && <Badge variant="primary">New</Badge>}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {message.name} · {message.email} · {new Date(message.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{message.message}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleToggle(message.id, message.isRead)}>
                {message.isRead ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                {message.isRead ? "Mark Unread" : "Mark Read"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
