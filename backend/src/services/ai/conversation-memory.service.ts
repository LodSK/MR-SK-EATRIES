import type { ChatMessage } from "@/types/ai";

const MAX_MESSAGES_PER_SESSION = 20;
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes of inactivity

interface SessionRecord {
  messages: ChatMessage[];
  lastAccessedAt: number;
}

/**
 * In-memory session store for Sprint 13A — this project already has Redis
 * configured (`env.redisUrl`, since Sprint 1) for exactly this kind of
 * ephemeral, TTL'd data, but wiring it up is a Sprint 13B/C concern once
 * there's an actual chat UI driving real traffic. The interface below
 * (`get`/`append`/`clear`) is intentionally storage-agnostic — swapping
 * this Map for a Redis-backed implementation later means changing this
 * one file, not any caller.
 */
class ConversationMemoryStore {
  private sessions = new Map<string, SessionRecord>();

  get(sessionId: string): ChatMessage[] {
    this.evictExpired();
    return this.sessions.get(sessionId)?.messages ?? [];
  }

  append(sessionId: string, message: ChatMessage): void {
    this.evictExpired();
    const existing = this.sessions.get(sessionId) ?? { messages: [], lastAccessedAt: Date.now() };
    existing.messages.push(message);
    if (existing.messages.length > MAX_MESSAGES_PER_SESSION) {
      existing.messages = existing.messages.slice(-MAX_MESSAGES_PER_SESSION);
    }
    existing.lastAccessedAt = Date.now();
    this.sessions.set(sessionId, existing);
  }

  clear(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  private evictExpired(): void {
    const now = Date.now();
    for (const [sessionId, record] of this.sessions) {
      if (now - record.lastAccessedAt > SESSION_TTL_MS) {
        this.sessions.delete(sessionId);
      }
    }
  }
}

export const ConversationMemory = new ConversationMemoryStore();
