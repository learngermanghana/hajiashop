import BlogCards from "@/components/blog/BlogCards";
import SectionTitle from "@/components/SectionTitle";
import { fetchSedifexBlogPosts } from "@/lib/blog";

export default async function BlogPage() {
  const posts = await fetchSedifexBlogPosts();

  return (
    <section className="container-shell py-16">
      <SectionTitle eyebrow="Blog" title="Latest from our store" />
      {posts.length ? <BlogCards posts={posts} /> : <p className="text-sm text-gray-600">No published blog posts available yet.</p>}
    </section>
  );
}
