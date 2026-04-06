import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import { getHomeImages } from "@/lib/home-images";
import { fetchSedifexPromoGallery } from "@/lib/sedifex";

export default async function GalleryPreview() {
  const promoGallery = await fetchSedifexPromoGallery();
  const homeImages = getHomeImages();
  const previewImages = promoGallery.length
    ? promoGallery.slice(0, 4).map((item) => ({ src: item.url, alt: item.alt ?? "Promo gallery image" }))
    : homeImages.length > 0
      ? homeImages.slice(0, 4).map((image) => ({ src: image, alt: "Beauty look" }))
      : ["/uploads/gallery/look-1.jpg", "/uploads/gallery/look-2.jpg", "/uploads/gallery/look-3.jpg", "/uploads/gallery/look-4.jpg"].map((image) => ({
          src: image,
          alt: "Beauty look"
        }));

  return (
    <section className="container-shell py-16">
      <SectionTitle eyebrow="Beauty Visuals" title="Gallery highlights" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {previewImages.map((image) => (
          <img key={image.src} src={image.src} alt={image.alt} className="h-48 w-full rounded-xl object-cover" />
        ))}
      </div>
      <Link href="/gallery" className="mt-5 inline-block text-sm font-semibold text-brand-700">
        See full gallery →
      </Link>
    </section>
  );
}
