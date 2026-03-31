"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";

type Props = {
  products: Product[];
  categories: string[];
};

export default function ProductGrid({ products, categories }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = category === "All" || product.category === category;
      const searchPool = `${product.name} ${product.type} ${product.shortDescription}`.toLowerCase();
      const queryMatch = searchPool.includes(query.toLowerCase());
      return categoryMatch && queryMatch;
    });
  }, [products, category, query]);

  return (
    <section>
      <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, type, or description"
          className="rounded-xl border border-gray-200 px-4 py-2"
        />
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-pink-50 p-6 text-gray-600">No products found. Try another search keyword.</p>
      )}
    </section>
  );
}
