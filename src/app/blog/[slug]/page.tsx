import { notFound } from "next/navigation";
import { fetchSedifexBlogPosts } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const posts = await fetchSedifexBlogPosts(slug);
  const post = posts[0];

  if (!post) {
    notFound();
  }

  return (
    <article className="container-shell max-w-3xl py-16">
      <p className="text-sm text-gray-500">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Published"}</p>
      <h1 className="mt-2 text-3xl font-bold text-brand-900">{post.title}</h1>
      <div className="prose prose-sm mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
