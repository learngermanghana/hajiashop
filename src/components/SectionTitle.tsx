import { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
};

export default function SectionTitle({ eyebrow, title, description }: Props) {
  return (
    <div className="mb-8">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-3xl font-bold text-gray-900">{title}</h2>
      {description ? <p className="mt-3 max-w-3xl text-gray-600">{description}</p> : null}
    </div>
  );
}
