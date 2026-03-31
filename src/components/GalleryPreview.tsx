import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import { getHomeImages } from "@/lib/home-images";

export default function GalleryPreview() {
  const homeImages = getHomeImages();
  const previewImages =
    homeImages.length > 0
      ? homeImages.slice(0, 4)
      : ["/uploads/gallery/look-1.jpg", "/uploads/gallery/look-2.jpg", "/uploads/gallery/look-3.jpg", "/uploads/gallery/look-4.jpg"];

  return (
    <section className="container-shell py-16">
      <SectionTitle eyebrow="Beauty Visuals" title="Gallery highlights" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {previewImages.map((image) => (
          <img key={image} src={image} alt="Beauty look" className="h-48 w-full rounded-xl object-cover" />
        ))}
      </div>
      <Link href="/gallery" className="mt-5 inline-block text-sm font-semibold text-brand-700">
        See full gallery →
      </Link>
    </section>
  );
}
