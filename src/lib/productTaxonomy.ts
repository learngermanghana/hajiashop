function normalizeTaxonomyKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

const CATEGORY_RENAMES: Record<string, string> = {
  supplement: "Skin Supplements",
  supplements: "Skin Supplements",
  beverage: "Weight",
  beverages: "Weight",
  "skin care": "Skin Care",
  skincare: "Skin Care"
};

export function normalizeCategory(category?: string | null) {
  const cleaned = category?.trim();

  if (!cleaned) {
    return "General";
  }

  const key = normalizeTaxonomyKey(cleaned);
  return CATEGORY_RENAMES[key] ?? cleaned;
}

export function categoryDeduplicationKey(category: string) {
  return normalizeTaxonomyKey(category);
}
