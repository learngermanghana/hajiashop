import fs from "node:fs";
import path from "node:path";

export function formatCurrency(amount: number, currency = "GHS") {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function getGalleryImages() {
  const galleryDir = path.join(process.cwd(), "public", "uploads", "gallery");

  if (!fs.existsSync(galleryDir)) {
    return [];
  }

  return fs
    .readdirSync(galleryDir)
    .filter((file) => /\.(png|jpe?g|webp|avif)$/i.test(file))
    .map((file) => `/uploads/gallery/${file}`);
}
