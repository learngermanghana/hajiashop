import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import { fetchSedifexPromoGallery } from "@/lib/sedifex";

export default async function GalleryPreview() {
  const promoGallery = await fetchSedifexPromoGallery();
  const previewImages = promoGallery.slice(0, 4).map((item) => ({ src: item.url, alt: item.alt ?? "Promo gallery image" }));

  return (
    <section className="container-shell py-16">
      <SectionTitle eyebrow="Beauty Visuals" title="Gallery highlights" />
      {previewImages.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {previewImages.map((image) => (
            <img key={image.src} src={image.src} alt={image.alt} className="h-48 w-full rounded-xl object-cover" />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-pink-50 p-4 text-sm text-pink-900">No gallery images available from integrationGallery yet.</p>
      )}
      <Link href="/gallery" className="mt-5 inline-block text-sm font-semibold text-brand-700">
        See full gallery →
      </Link>
    </section>
  );
}
