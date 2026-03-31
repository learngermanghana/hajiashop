import SectionTitle from "@/components/SectionTitle";
import { testimonials } from "@/data/testimonials";

export default function TestimonialsSection() {
  return (
    <section className="container-shell py-16">
      <SectionTitle eyebrow="Social Proof" title="What our customers say" />
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <blockquote key={testimonial.name} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-gray-700">“{testimonial.quote}”</p>
            <footer className="mt-3 text-sm font-semibold text-brand-700">{testimonial.name}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
