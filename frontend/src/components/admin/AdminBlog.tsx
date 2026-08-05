"use client";

import * as React from "react";
import { Pencil, Plus, Newspaper, Trash2 } from "lucide-react";
import { adminListBlogPosts, adminDeleteBlogPost } from "@/lib/api/blog";
import type { BlogPost } from "@/types/blog";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/ui/button";

export function AdminBlog() {
  const [posts, setPosts] = React.useState<BlogPost[] | null>(null);
  const [formState, setFormState] = React.useState<"closed" | "create" | BlogPost>("closed");

  const load = React.useCallback(() => {
    adminListBlogPosts()
      .then(setPosts)
      .catch(() => setPosts([]));
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string) {
    await adminDeleteBlogPost(id);
    load();
  }

  function handleFormDone() {
    setFormState("closed");
    load();
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-2xl font-bold">Blog</h2>
        <p className="mt-1 text-sm text-muted-foreground">Write and publish posts to the public blog.</p>
      </div>

      {formState !== "closed" ? (
        <BlogPostForm
          initialPost={formState === "create" ? undefined : formState}
          onDone={handleFormDone}
          onCancel={() => setFormState("closed")}
        />
      ) : (
        <Button onClick={() => setFormState("create")} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      )}

      {posts === null ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={<Newspaper className="h-6 w-6" strokeWidth={1.5} />}
          title="No posts yet"
          description="Write your first blog post."
        />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          {posts.map((post) => (
            <div key={post.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{post.title}</span>
                  <Badge variant={post.isPublished ? "success" : "outline"}>
                    {post.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {post.author} · {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setFormState(post)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(post.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
