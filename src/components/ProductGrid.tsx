"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type Props = {
  products: Product[];
  categories: string[];
};

const PRODUCTS_PER_PAGE = 9;
const RECENT_SEARCHES_KEY = "shop:recent-searches";
const MAX_RECENT_SEARCHES = 5;

const SEARCH_SYNONYMS: Record<string, string[]> = {
  sneakers: ["shoes", "trainers", "kicks"],
  shoes: ["sneakers", "trainers", "kicks"],
  tee: ["tshirt", "shirt", "top"],
  tshirt: ["tee", "shirt", "top"],
  jersey: ["shirt", "top"],
  pants: ["trousers", "bottoms"],
  hoodie: ["sweatshirt", "jumper"],
  adidas: ["adiddas", "adiadas"],
  nike: ["nik", "nkie"],
  puma: ["puuma"]
};

const normalizeTerm = (value: string) => value.toLowerCase().trim();

const levenshteinDistance = (left: string, right: string) => {
  const matrix = Array.from({ length: left.length + 1 }, () => Array(right.length + 1).fill(0));

  for (let i = 0; i <= left.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= right.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[left.length][right.length];
};

export default function ProductGrid({ products, categories }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const savedSearches = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!savedSearches) return;

    try {
      const parsed = JSON.parse(savedSearches);
      if (Array.isArray(parsed)) {
        setRecentSearches(parsed.filter((item) => typeof item === "string"));
      }
    } catch {
      window.localStorage.removeItem(RECENT_SEARCHES_KEY);
    }
  }, []);

  const suggestionPool = useMemo(() => {
    const terms = new Set<string>();

    products.forEach((product) => {
      [product.name, product.type, product.category].forEach((field) => {
        if (field) terms.add(normalizeTerm(field));
      });

      product.shortDescription
        .split(/\s+/)
        .map((token) => token.replace(/[^a-zA-Z0-9]/g, ""))
        .filter((token) => token.length >= 4)
        .forEach((token) => terms.add(normalizeTerm(token)));
    });

    Object.entries(SEARCH_SYNONYMS).forEach(([base, related]) => {
      terms.add(base);
      related.forEach((term) => terms.add(term));
    });

    return Array.from(terms);
  }, [products]);

  const resolvedQuery = useMemo(() => {
    const normalizedQuery = normalizeTerm(query);
    if (!normalizedQuery) return "";

    if (SEARCH_SYNONYMS[normalizedQuery]) return normalizedQuery;

    const canonicalSynonym = Object.keys(SEARCH_SYNONYMS).find((key) =>
      SEARCH_SYNONYMS[key].includes(normalizedQuery)
    );
    if (canonicalSynonym) return canonicalSynonym;

    const closeMatch = suggestionPool.find((term) => {
      if (Math.abs(term.length - normalizedQuery.length) > 2) return false;
      return levenshteinDistance(term, normalizedQuery) <= 2;
    });

    return closeMatch ?? normalizedQuery;
  }, [query, suggestionPool]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = category === "All" || product.category === category;
      const searchPool = `${product.name} ${product.type} ${product.shortDescription} ${product.category}`.toLowerCase();
      const synonymTerms = SEARCH_SYNONYMS[resolvedQuery] ?? [];
      const queryMatch = !resolvedQuery
        || searchPool.includes(resolvedQuery)
        || synonymTerms.some((term) => searchPool.includes(term));
      return categoryMatch && queryMatch;
    });
  }, [products, category, resolvedQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filtered.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filtered, currentPage]);

  const suggestions = useMemo(() => {
    const normalizedQuery = normalizeTerm(query);
    if (!normalizedQuery) return recentSearches;

    const matches = suggestionPool
      .filter((term) => term.includes(normalizedQuery) || levenshteinDistance(term, normalizedQuery) <= 2)
      .slice(0, 6);

    return Array.from(new Set(matches));
  }, [query, recentSearches, suggestionPool]);

  const persistRecentSearch = (value: string) => {
    const term = normalizeTerm(value);
    if (!term) return;

    const updated = [term, ...recentSearches.filter((item) => item !== term)].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const updateQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const applySuggestion = (value: string) => {
    updateQuery(value);
    persistRecentSearch(value);
  };

  const updateCategory = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const startItem = filtered.length ? (currentPage - 1) * PRODUCTS_PER_PAGE + 1 : 0;
  const endItem = filtered.length ? Math.min(currentPage * PRODUCTS_PER_PAGE, filtered.length) : 0;

  return (
    <section>
      <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto]">
        <div className="relative">
          <input
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            onBlur={() => persistRecentSearch(query)}
            placeholder="Search products (supports suggestions + typo fixes)"
            className="w-full rounded-xl border border-gray-200 px-4 py-2"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-xl border border-pink-100 bg-white p-1 shadow-lg">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    applySuggestion(suggestion);
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-pink-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((item) => (
            <button
              key={item}
              onClick={() => updateCategory(item)}
              className={`rounded-full px-4 py-2 text-sm ${
                category === item ? "bg-brand-500 text-white" : "bg-pink-50 text-brand-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      {filtered.length ? (
        <>
          <p className="mb-4 text-sm text-gray-600">
            Showing {startItem}-{endItem} of {filtered.length} products
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => {
                const number = index + 1;
                return (
                  <button
                    key={number}
                    onClick={() => setPage(number)}
                    className={`rounded-full px-4 py-2 text-sm ${
                      currentPage === number ? "bg-brand-500 text-white" : "bg-pink-50 text-brand-700"
                    }`}
                  >
                    {number}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-xl bg-pink-50 p-6 text-gray-600">
          <p>No products found. Try another search keyword.</p>
          <p className="mt-2">
            Need help?{" "}
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-brand-700 underline"
            >
              Contact us on WhatsApp
            </a>
            .
          </p>
        </div>
      )}
    </section>
  );
}
