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
  premixJulietEveMirificaBustUp: "/uploads/products/1.Premix Juliet  Eve Mirifica Bust up.jpeg",
  snowWhiteFlawlessBeauty: "/uploads/products/2.Snow White Flawless Beauty.jpeg",
  phytoBoosterWhitening: "/uploads/products/3.PhytoBooster Whitening.jpeg",
  phytoCollagenKingOfWhitening: "/uploads/products/4.Phyto Collagen King of Whitening.jpeg",
  ladiesShine: "/uploads/products/5.Ladies Shine.jpeg"
} as const;

export const productCatalog: Record<string, Product> = {
  "premix-juliet-eve-mirifica-bust-up": {
    id: "p1",
    slug: "premix-juliet-eve-mirifica-bust-up",
    name: "Premix Juliet Eve Mirifica Bust up",
    type: "Beauty Supplement",
    category: "Whitening",
    price: 450,
    currency: "GHS",
    image: productImageUrls.premixJulietEveMirificaBustUp,
    gallery: [productImageUrls.premixJulietEveMirificaBustUp],
    shortDescription: "Enhances glow while supporting a fuller feminine look.",
    description:
      "Premix Juliet Eve Mirifica Bust up is crafted for women who want brighter skin confidence with everyday beauty support.",
    inStock: true,
    featured: true,
    tags: ["bust care", "glow", "beauty"]
  },
  "snow-white-flawless-beauty": {
    id: "p2",
    slug: "snow-white-flawless-beauty",
    name: "Snow White Flawless Beauty",
    type: "Beauty Supplement",
    category: "Whitening",
    price: 450,
    currency: "GHS",
    image: productImageUrls.snowWhiteFlawlessBeauty,
    gallery: [productImageUrls.snowWhiteFlawlessBeauty],
    shortDescription: "Daily beauty support for smooth, radiant-looking skin.",
    description:
      "Snow White Flawless Beauty supports a bright and flawless beauty routine with a simple daily intake.",
    inStock: true,
    featured: true,
    tags: ["flawless", "radiance", "daily"]
  },
  "phyto-booster-whitening": {
    id: "p3",
    slug: "phyto-booster-whitening",
    name: "PhytoBooster Whitening",
    type: "Beauty Supplement",
    category: "Whitening",
    price: 450,
    currency: "GHS",
    image: productImageUrls.phytoBoosterWhitening,
    gallery: [productImageUrls.phytoBoosterWhitening],
    shortDescription: "Plant-powered formula to boost brightness and glow.",
    description:
      "PhytoBooster Whitening is a botanical-focused beauty booster designed to improve skin brilliance and confidence.",
    inStock: true,
    featured: false,
    tags: ["phyto", "boost", "whitening"]
  },
  "phyto-collagen-king-of-whitening": {
    id: "p4",
    slug: "phyto-collagen-king-of-whitening",
    name: "Phyto Collagen King of Whitening",
    type: "Collagen Supplement",
    category: "Whitening",
    price: 450,
    currency: "GHS",
    image: productImageUrls.phytoCollagenKingOfWhitening,
    gallery: [productImageUrls.phytoCollagenKingOfWhitening],
    shortDescription: "Collagen-rich whitening support for healthy skin glow.",
    description:
      "Phyto Collagen King of Whitening combines collagen and beauty nutrients to support a luminous complexion.",
    inStock: true,
    featured: true,
    tags: ["collagen", "whitening", "skin support"]
  },
  "ladies-shine": {
    id: "p5",
    slug: "ladies-shine",
    name: "Ladies Shine",
    type: "Beauty Supplement",
    category: "Whitening",
    price: 450,
    currency: "GHS",
    image: productImageUrls.ladiesShine,
    gallery: [productImageUrls.ladiesShine],
    shortDescription: "Everyday beauty formula to keep your shine on.",
    description:
      "Ladies Shine is made for women who want visible glow, confident skin, and a beauty routine that feels effortless.",
    inStock: true,
    featured: false,
    tags: ["ladies", "shine", "beauty"]
  }
};

export const products = Object.values(productCatalog);

export const productCategories = Array.from(
  new Set(products.map((product) => product.category))
);
