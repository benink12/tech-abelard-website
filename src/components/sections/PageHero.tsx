import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="hc-pagehero">
      <div className="hc-wrap">
        <p className="hc-eyebrow hc-pagehero__eyebrow">{eyebrow}</p>
        <h1 className="hc-pagehero__title">{title}</h1>
        {description && <p className="hc-pagehero__desc">{description}</p>}
        {children}
      </div>
    </section>
  );
}
