"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";

type Props = {
  products: Product[];
  categories: string[];
};

export default function ProductGrid({ products, categories }: Props) {
  const PRODUCTS_PER_PAGE = 9;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = category === "All" || product.category === category;
      const searchPool = `${product.name} ${product.type} ${product.shortDescription}`.toLowerCase();
      const queryMatch = searchPool.includes(query.toLowerCase());
      return categoryMatch && queryMatch;
    });
  }, [products, category, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filtered.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filtered, currentPage, PRODUCTS_PER_PAGE]);

  const updateQuery = (value: string) => {
    setQuery(value);
    setPage(1);
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
        <input
          value={query}
          onChange={(event) => updateQuery(event.target.value)}
          placeholder="Search by name, type, or description"
          className="rounded-xl border border-gray-200 px-4 py-2"
        />
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
        <p className="rounded-xl bg-pink-50 p-6 text-gray-600">No products found. Try another search keyword.</p>
      )}
    </section>
  );
}
