import fs from "fs";
import path from "path";

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
