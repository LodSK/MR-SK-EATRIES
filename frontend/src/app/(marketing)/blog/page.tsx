import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { BlogCard } from "@/components/blog/BlogCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { getBlogPosts } from "@/lib/api/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Stories, recipes, and behind-the-scenes notes from MR_SK EATRIES.",
};

// Blog content is served by the backend. Do not make Netlify's build depend
// on the backend being reachable while generating this page.
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <PageHero
        eyebrow="From the Kitchen"
        title="The MR_SK EATRIES Blog"
        subtitle="Stories, recipes, and behind-the-scenes notes from our kitchen and bar."
        breadcrumbItems={[{ label: "Blog" }]}
      />
      <div className="section-container py-16 sm:py-20">
        {posts.length === 0 ? (
          <EmptyState title="No posts yet" description="Check back soon for stories from our kitchen." />
        ) : (
          <>
            {/* PageHero's h1 is otherwise followed directly by BlogCard's h3
                post titles — a skipped heading level. */}
            <h2 className="sr-only">Blog Posts</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
