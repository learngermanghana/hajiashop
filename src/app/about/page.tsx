import SectionTitle from "@/components/SectionTitle";

export default function AboutPage() {
  return (
    <section className="container-shell py-14">
      <SectionTitle eyebrow="About us" title="The story behind Hajia Slay Shop" />
      <div className="space-y-5 text-gray-700">
        <p>
          Hajia Slay Shop was built to make premium, everyday beauty products accessible to every confident woman who wants to slay effortlessly.
        </p>
        <p>
          Our mission is to provide authentic cosmetics, honest product guidance, and responsive customer support that helps shoppers make the right choices.
        </p>
        <p>
          Customers trust us for consistent quality, quick WhatsApp support, and reliable delivery service.
        </p>
      </div>
    </section>
  );
}
