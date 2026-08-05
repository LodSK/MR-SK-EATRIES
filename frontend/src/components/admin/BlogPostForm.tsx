"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import type { BlogPost, BlogPostPayload } from "@/types/blog";
import { adminCreateBlogPost, adminUpdateBlogPost } from "@/lib/api/blog";
import { Checkbox } from "@/components/ui/checkbox";
import { FormMessage } from "@/components/auth/FormMessage";
import { Button } from "@/components/ui/button";

interface BlogPostFormProps {
  initialPost?: BlogPost;
  onDone: () => void;
  onCancel: () => void;
}

const INPUT_CLASS =
  "h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary";

export function BlogPostForm({ initialPost, onDone, onCancel }: BlogPostFormProps) {
  const [values, setValues] = React.useState<BlogPostPayload>({
    title: initialPost?.title ?? "",
    excerpt: initialPost?.excerpt ?? "",
    content: initialPost?.content ?? "",
    author: initialPost?.author ?? "MR_SK EATRIES Kitchen",
    tags: initialPost?.tags ?? [],
    isPublished: initialPost?.isPublished ?? false,
  });
  const [tagsInput, setTagsInput] = React.useState(initialPost?.tags.join(", ") ?? "");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function set<K extends keyof BlogPostPayload>(key: K, value: BlogPostPayload[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = { ...values, tags };

    const result = initialPost
      ? await adminUpdateBlogPost(initialPost.id, payload)
      : await adminCreateBlogPost(payload);

    setIsSubmitting(false);
    if (result.success) {
      onDone();
    } else {
      setError(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      {error && <FormMessage type="error">{error}</FormMessage>}

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Title</label>
        <input
          type="text"
          required
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Author</label>
          <input
            type="text"
            required
            value={values.author}
            onChange={(e) => set("author", e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="menu, behind-the-scenes"
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Excerpt</label>
        <textarea
          required
          rows={2}
          maxLength={300}
          value={values.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus-visible:border-brand-primary"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          Content (paragraphs separated by a blank line)
        </label>
        <textarea
          required
          rows={10}
          value={values.content}
          onChange={(e) => set("content", e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus-visible:border-brand-primary"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={values.isPublished} onCheckedChange={(v) => set("isPublished", v === true)} />
        Published
      </label>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : initialPost ? "Save Changes" : "Create Post"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
