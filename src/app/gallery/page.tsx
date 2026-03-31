import SectionTitle from "@/components/SectionTitle";
import { getGalleryImages } from "@/lib/gallery";

export default function GalleryPage() {
  const images = getGalleryImages();

  return (
    <section className="container-shell py-14">
      <SectionTitle
        eyebrow="Gallery"
        title="Beauty looks & product visuals"
        description="A curated showcase of makeup looks and product shots from Hajia Slay Shop."
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {(images.length
          ? images
          : [
              "/uploads/gallery/look-1.jpg",
              "/uploads/gallery/look-2.jpg",
              "/uploads/gallery/look-3.jpg",
              "/uploads/gallery/look-4.jpg"
            ]
        ).map((image) => (
          <img key={image} src={image} alt="Hajia Slay Shop gallery" className="h-56 w-full rounded-xl object-cover" />
        ))}
      </div>
    </section>
  );
}
