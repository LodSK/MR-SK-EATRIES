import type { Metadata } from "next";
import { AdminBlog } from "@/components/admin/AdminBlog";

export const metadata: Metadata = {
  title: "Blog",
};

export default function AdminBlogPage() {
  return <AdminBlog />;
}
