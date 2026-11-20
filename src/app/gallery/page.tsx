import SectionTitle from "@/components/SectionTitle";
const photos = [
  "/uploads/home/IMG_4430.JPG.jpeg", "/uploads/home/IMG_4431.JPG.jpeg",
  "/uploads/home/IMG_4432.JPG.jpeg", "/uploads/home/IMG_4435.JPG.jpeg",
  "/uploads/home/IMG_4436.JPG.jpeg", "/uploads/home/IMG_4437.JPG.jpeg"
];
export default function GalleryPage() {
  return <section className="container-shell py-14">
    <SectionTitle eyebrow="Gallery" title="Beauty looks & product visuals" description="A selection of photos from Hajia Slay Shop." />
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {photos.map(src => <img key={src} src={src} alt="Hajia Slay Shop gallery" className="h-56 w-full rounded-xl object-cover" />)}
    </div>
  </section>;
}
