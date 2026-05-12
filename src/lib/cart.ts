export const CART_STORAGE_KEY = "hajiashop_checkout_cart";

export type CartItem = { id: string; qty: number };

export function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return parsed.filter((item) => typeof item.id === "string" && Number(item.qty) > 0);
  } catch {
    return [];
  }
}

export function writeCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function addItemToCart(item: CartItem) {
  const existing = readCartFromStorage();
  const found = existing.find((entry) => entry.id === item.id);
  const next = found
    ? existing.map((entry) => (entry.id === item.id ? { ...entry, qty: entry.qty + item.qty } : entry))
    : [...existing, item];
  writeCartToStorage(next);
  return next;
}
