"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { BLOG_COVER_IMAGE } from "@/lib/constants/media";
import { Badge } from "@/components/shared/Badge";
import { useImageReveal } from "@/lib/hooks/useImageReveal";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const coverImage = BLOG_COVER_IMAGE[post.slug] ?? "/images/gallery/ambiance-kitchen.jpg";
  const imageRevealRef = useImageReveal<HTMLDivElement>();

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      <div ref={imageRevealRef} className="relative h-40 overflow-hidden">
        <Image
          src={coverImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="font-display text-lg font-bold leading-snug group-hover:text-brand-primary dark:group-hover:text-brand-accent">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <div className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          {/* Locale pinned (not `undefined`) — this renders inside a Server
              Component tree, and letting it resolve to the server's vs.
              browser's runtime locale can format the date differently
              between SSR and hydration, throwing a React hydration-mismatch
              error (caught live via Lighthouse's console-errors audit). */}
          {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" · "}
          {post.author}
        </div>
      </div>
    </Link>
  );
}
