import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { getBlogExcerpt } from "@/lib/blog";

type Props = {
  posts: BlogPost[];
};

export default function BlogCards({ posts }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {posts.map((post) => (
        <article key={post.id} className="overflow-hidden rounded-xl border border-pink-100 bg-white shadow-sm">
          {post.imageUrl ? (
            <img src={post.imageUrl} alt={post.title} className="h-44 w-full object-cover" loading="lazy" />
          ) : null}
          <div className="space-y-3 p-5">
            <p className="text-xs text-gray-500">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Published"}</p>
            <h3 className="text-lg font-semibold text-brand-900">{post.title}</h3>
            <p className="text-sm text-gray-600">{getBlogExcerpt(post.content)}</p>
            <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-brand-700 hover:text-brand-900">
              Read more →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
