import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "ink",
  className,
  titleAs: TitleTag = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "ink" | "cream";
  className?: string;
  titleAs?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "hc-heading",
        align === "center" && "hc-heading--center",
        tone === "cream" && "hc-heading--onDark",
        className
      )}
    >
      {eyebrow && <p className="hc-eyebrow hc-heading__eyebrow">{eyebrow}</p>}
      <TitleTag className="hc-heading__title">{title}</TitleTag>
      {description && <p className="hc-heading__desc">{description}</p>}
    </div>
  );
}
