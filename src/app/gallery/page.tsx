import SectionTitle from "@/components/SectionTitle";
import { getCachedSedifexPromoGallery } from "@/lib/public-data";

export const revalidate = 900;

export default async function GalleryPage() {
  const promoGallery = await getCachedSedifexPromoGallery();
  const resolvedImages = promoGallery.map((item) => item.url);

  return (
    <section className="container-shell py-14">
      <SectionTitle
        eyebrow="Gallery"
        title="Beauty looks & product visuals"
        description="A curated showcase of makeup looks and product shots from Hajia Slay Shop."
      />
      {resolvedImages.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {resolvedImages.map((image) => (
            <img key={image} src={image} alt="Shop gallery" className="h-56 w-full rounded-xl object-cover" />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-pink-50 p-4 text-sm text-pink-900">No gallery images are available yet.</p>
      )}
    </section>
  );
}
