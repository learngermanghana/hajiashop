export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  linkUrl?: string;
  imageUrl?: string;
  publishedAt?: string;
};

type BlogPayload = {
  items?: unknown;
};

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function toBlogPosts(payload: BlogPayload): BlogPost[] {
  if (!Array.isArray(payload.items)) {
    return [];
  }

  return payload.items.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const record = item as Record<string, unknown>;
    const id = typeof record.id === "string" ? record.id : "";
    const title = typeof record.title === "string" ? record.title : "Untitled";
    const slug = typeof record.slug === "string" ? record.slug : "";

    if (!id || !slug) {
      return [];
    }

    return [
      {
        id,
        title,
        slug,
        content: typeof record.content === "string" ? record.content : "",
        linkUrl: typeof record.linkUrl === "string" ? record.linkUrl : undefined,
        imageUrl: typeof record.imageUrl === "string" ? record.imageUrl : undefined,
        publishedAt: typeof record.publishedAt === "string" ? record.publishedAt : undefined
      } satisfies BlogPost
    ];
  });
}

export async function fetchSedifexBlogPosts(slug?: string): Promise<BlogPost[]> {
  const baseUrl = process.env.SEDIFEX_SITE_BASE_URL ?? "https://www.sedifex.com";
  const storeId = process.env.SEDIFEX_STORE_ID ?? "";

  if (!storeId) {
    return [];
  }

  const endpoint = new URL(`${normalizeBaseUrl(baseUrl)}/api/public-blog`);
  endpoint.searchParams.set("storeId", storeId);

  if (slug) {
    endpoint.searchParams.set("slug", slug);
  }

  const response = await fetch(endpoint.toString(), {
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    throw new Error(`Blog pull failed: ${response.status}`);
  }

  const payload = (await response.json()) as BlogPayload;
  return toBlogPosts(payload);
}

export function getBlogExcerpt(content: string, maxLength = 140) {
  const stripped = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (stripped.length <= maxLength) {
    return stripped;
  }

  return `${stripped.slice(0, maxLength).trimEnd()}...`;
}
