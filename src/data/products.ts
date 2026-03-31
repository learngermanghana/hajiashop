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
  matteLipGlossRed:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
  hydratingLiquidFoundation:
    "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1200&q=80",
  radianceSettingPowder:
    "https://images.unsplash.com/photo-1583241800698-c8188cc6f0f8?auto=format&fit=crop&w=1200&q=80",
  volumizingMascara:
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80",
  sunGlowBlushPalette:
    "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1200&q=80",
  browSculptPencil:
    "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=80",
  aloeMakeupRemover:
    "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80",
  velvetNudeLipstick:
    "https://images.unsplash.com/photo-1631214524020-57f7f0c5fc29?auto=format&fit=crop&w=1200&q=80",
  liquidEyelinerJetBlack:
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80",
  overnightLipMask:
    "https://images.unsplash.com/photo-1571781418606-70265b9cce90?auto=format&fit=crop&w=1200&q=80"
} as const;

export const productCatalog: Record<string, Product> = {
  "matte-lip-gloss-red": {
    id: "p1",
    slug: "matte-lip-gloss-red",
    name: "Matte Lip Gloss Red",
    type: "Lip Gloss",
    category: "Lips",
    price: 45,
    currency: "GHS",
    image: productImageUrls.matteLipGlossRed,
    gallery: [productImageUrls.matteLipGlossRed],
    shortDescription: "Long-lasting matte lip gloss with rich color.",
    description:
      "A smooth matte lip gloss with bold color payoff for everyday wear and event-ready looks.",
    inStock: true,
    featured: true,
    tags: ["matte", "lip", "beauty"]
  },
  "hydrating-liquid-foundation": {
    id: "p2",
    slug: "hydrating-liquid-foundation",
    name: "Hydrating Liquid Foundation",
    type: "Foundation",
    category: "Face",
    price: 120,
    currency: "GHS",
    image: productImageUrls.hydratingLiquidFoundation,
    gallery: [productImageUrls.hydratingLiquidFoundation],
    shortDescription: "Buildable medium coverage with dewy finish.",
    description:
      "Lightweight foundation that blends effortlessly and keeps your skin fresh for up to 12 hours.",
    inStock: true,
    featured: true,
    tags: ["foundation", "dewy", "face"]
  },
  "radiance-setting-powder": {
    id: "p3",
    slug: "radiance-setting-powder",
    name: "Radiance Setting Powder",
    type: "Setting Powder",
    category: "Face",
    price: 90,
    currency: "GHS",
    image: productImageUrls.radianceSettingPowder,
    gallery: [productImageUrls.radianceSettingPowder],
    shortDescription: "Soft-focus finish that controls shine.",
    description: "Locks makeup in place and blurs pores without caking.",
    inStock: true,
    featured: true,
    tags: ["powder", "setting", "oil-control"]
  },
  "volumizing-mascara": {
    id: "p4",
    slug: "volumizing-mascara",
    name: "Volumizing Mascara",
    type: "Mascara",
    category: "Eyes",
    price: 65,
    currency: "GHS",
    image: productImageUrls.volumizingMascara,
    gallery: [productImageUrls.volumizingMascara],
    shortDescription: "Intense black formula for fuller lashes.",
    description:
      "Smudge-resistant mascara that adds volume and length with every stroke.",
    inStock: true,
    featured: false,
    tags: ["lashes", "eyes", "volume"]
  },
  "sun-glow-blush-palette": {
    id: "p5",
    slug: "sun-glow-blush-palette",
    name: "Sun Glow Blush Palette",
    type: "Blush",
    category: "Face",
    price: 85,
    currency: "GHS",
    image: productImageUrls.sunGlowBlushPalette,
    gallery: [productImageUrls.sunGlowBlushPalette],
    shortDescription: "Three wearable shades for warm glow.",
    description: "Mix and match blush tones for soft daytime or bold glam looks.",
    inStock: true,
    featured: false,
    tags: ["blush", "palette", "glow"]
  },
  "brow-sculpt-pencil": {
    id: "p6",
    slug: "brow-sculpt-pencil",
    name: "Brow Sculpt Pencil",
    type: "Brow Pencil",
    category: "Brows",
    price: 50,
    currency: "GHS",
    image: productImageUrls.browSculptPencil,
    gallery: [productImageUrls.browSculptPencil],
    shortDescription: "Precision brow pencil with spoolie brush.",
    description: "Define and fill your brows naturally with long-wear pigment.",
    inStock: true,
    featured: false,
    tags: ["brow", "precision"]
  },
  "aloe-makeup-remover": {
    id: "p7",
    slug: "aloe-makeup-remover",
    name: "Aloe Makeup Remover",
    type: "Skincare",
    category: "Skincare",
    price: 70,
    currency: "GHS",
    image: productImageUrls.aloeMakeupRemover,
    gallery: [productImageUrls.aloeMakeupRemover],
    shortDescription: "Gentle cleansing remover for waterproof makeup.",
    description: "Bi-phase formula melts makeup while leaving skin soothed and hydrated.",
    inStock: true,
    featured: false,
    tags: ["skincare", "cleanse"]
  },
  "velvet-nude-lipstick": {
    id: "p8",
    slug: "velvet-nude-lipstick",
    name: "Velvet Nude Lipstick",
    type: "Lipstick",
    category: "Lips",
    price: 55,
    currency: "GHS",
    image: productImageUrls.velvetNudeLipstick,
    gallery: [productImageUrls.velvetNudeLipstick],
    shortDescription: "Creamy nude lipstick for versatile looks.",
    description: "Comfort matte lipstick with rich pigment and all-day confidence.",
    inStock: true,
    featured: true,
    tags: ["lipstick", "nude", "velvet"]
  },
  "liquid-eyeliner-jet-black": {
    id: "p9",
    slug: "liquid-eyeliner-jet-black",
    name: "Liquid Eyeliner Jet Black",
    type: "Eyeliner",
    category: "Eyes",
    price: 48,
    currency: "GHS",
    image: productImageUrls.liquidEyelinerJetBlack,
    gallery: [productImageUrls.liquidEyelinerJetBlack],
    shortDescription: "Quick-dry eyeliner with precise tip.",
    description: "Create sharp wings and defined eyes with water-resistant wear.",
    inStock: true,
    featured: false,
    tags: ["eyeliner", "eyes", "water-resistant"]
  },
  "overnight-lip-mask": {
    id: "p10",
    slug: "overnight-lip-mask",
    name: "Overnight Lip Mask",
    type: "Lip Care",
    category: "Lips",
    price: 60,
    currency: "GHS",
    image: productImageUrls.overnightLipMask,
    gallery: [productImageUrls.overnightLipMask],
    shortDescription: "Nourishing lip mask for soft lips by morning.",
    description: "A restorative treatment infused with shea butter and vitamin E.",
    inStock: false,
    featured: false,
    tags: ["lip-care", "hydrating"]
  }
};

export const products = Object.values(productCatalog);

export const productCategories = Array.from(
  new Set(products.map((product) => product.category))
);
