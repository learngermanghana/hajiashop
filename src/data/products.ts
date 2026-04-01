export type Product = {
  id: string;
  slug: string;
  name: string;
  type: string;
  category: string;
  price: number;
  currency: string;
  image: string;
  gallery?: string[];
  shortDescription: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
  tags?: string[];
};

const productImageUrls = {
  happyHormones:
    "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=1200",
  alphaArbutinCollagenPeptideDrink:
    "https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=1200",
  bloom:
    "https://images.pexels.com/photos/3873200/pexels-photo-3873200.jpeg?auto=compress&cs=tinysrgb&w=1200",
  neocellCollagen:
    "https://images.pexels.com/photos/593451/pexels-photo-593451.jpeg?auto=compress&cs=tinysrgb&w=1200"
} as const;

export const productCatalog: Record<string, Product> = {
  "happy-hormones": {
    id: "p1",
    slug: "happy-hormones",
    name: "Happy Hormones",
    type: "Supplement",
    category: "Wellness",
    price: 200,
    currency: "GHS",
    image: productImageUrls.happyHormones,
    gallery: [productImageUrls.happyHormones],
    shortDescription: "Hormone-support supplement for mood and balance.",
    description:
      "A daily wellness supplement formulated to support hormone balance and overall well-being.",
    inStock: true,
    featured: true,
    tags: ["wellness", "hormones", "supplement"]
  },
  "7d-alpha-arbutin-collagen-peptide-drink": {
    id: "p2",
    slug: "7d-alpha-arbutin-collagen-peptide-drink",
    name: "7 D Alpha Arbutin Collagen Peptide Drink",
    type: "Collagen Drink",
    category: "Wellness",
    price: 200,
    currency: "GHS",
    image: productImageUrls.alphaArbutinCollagenPeptideDrink,
    gallery: [productImageUrls.alphaArbutinCollagenPeptideDrink],
    shortDescription: "Collagen peptide drink with alpha arbutin blend.",
    description:
      "A beauty and wellness drink designed to support skin radiance with collagen peptides and alpha arbutin.",
    inStock: true,
    featured: true,
    tags: ["collagen", "drink", "arbutin"]
  },
  bloom: {
    id: "p3",
    slug: "bloom",
    name: "Bloom",
    type: "Supplement",
    category: "Wellness",
    price: 350,
    currency: "GHS",
    image: productImageUrls.bloom,
    gallery: [productImageUrls.bloom],
    shortDescription: "Daily wellness supplement for inner glow.",
    description:
      "Bloom is a daily supplement crafted to support nutrition, vitality, and healthy skin from within.",
    inStock: true,
    featured: false,
    tags: ["daily", "wellness", "nutrition"]
  },
  "neocell-collagen": {
    id: "p4",
    slug: "neocell-collagen",
    name: "Neocell Collagen",
    type: "Collagen Supplement",
    category: "Wellness",
    price: 400,
    currency: "GHS",
    image: productImageUrls.neocellCollagen,
    gallery: [productImageUrls.neocellCollagen],
    shortDescription: "Collagen supplement for skin, hair, and nails.",
    description:
      "A collagen-focused supplement created to support skin elasticity, hair strength, and nail health.",
    inStock: true,
    featured: true,
    tags: ["collagen", "beauty", "supplement"]
  }
};

export const products = Object.values(productCatalog);

export const productCategories = Array.from(
  new Set(products.map((product) => product.category))
);
