import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, User } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Badge } from "@/components/shared/Badge";
import { getBlogPostBySlug } from "@/lib/api/blog";
import { BLOG_COVER_IMAGE } from "@/lib/constants/media";
import { SITE_CONFIG } from "@/config/site";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.content.split(/\n\n+/).filter(Boolean);
  const coverImage = BLOG_COVER_IMAGE[post.slug] ?? "/images/gallery/ambiance-kitchen.jpg";
  const publishedDate = post.publishedAt ?? post.createdAt;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
        image: [`${SITE_CONFIG.url}${coverImage}`],
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: SITE_CONFIG.name },
    datePublished: publishedDate,
    dateModified: publishedDate,
    mainEntityOfPage: `${SITE_CONFIG.url}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        imageSrc={coverImage}
        eyebrow={post.tags[0] ?? "From the Kitchen"}
        title={post.title}
        subtitle={post.excerpt}
        breadcrumbItems={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
      />

      <div className="section-container max-w-3xl py-16 sm:py-20">
        <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-border pb-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="relative mb-10 h-56 overflow-hidden rounded-2xl sm:h-80">
          <Image src={coverImage} alt={post.title} fill priority className="object-cover" sizes="(min-width: 1024px) 768px, 100vw" />
        </div>

        <div className="flex flex-col gap-5 text-base leading-relaxed text-muted-foreground">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </>
  );
}
