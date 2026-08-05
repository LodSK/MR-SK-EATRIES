export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
}

export interface BlogPostPayload {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  tags?: string[];
  isPublished?: boolean;
}
