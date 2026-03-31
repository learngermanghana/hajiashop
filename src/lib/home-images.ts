import fs from "fs";
import path from "path";

export function getHomeImages() {
  const homeDir = path.join(process.cwd(), "public", "uploads", "home");

  if (!fs.existsSync(homeDir)) {
    return [];
  }

  return fs
    .readdirSync(homeDir)
    .filter((file) => /\.(png|jpe?g|webp|avif)$/i.test(file))
    .sort()
    .map((file) => `/uploads/home/${file}`);
}
