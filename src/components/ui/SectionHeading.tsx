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
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "brass-line mb-5 inline-block font-sans text-xs font-semibold uppercase tracking-[0.18em]",
            tone === "ink" ? "text-brass-ink" : "text-brass-light"
          )}
        >
          {eyebrow}
        </p>
      )}
      <TitleTag
        className={cn(
          "text-balance font-display text-3xl font-medium tracking-tight sm:text-4xl lg:text-[2.75rem]",
          tone === "ink" ? "text-ink" : "text-cream"
        )}
      >
        {title}
      </TitleTag>
      {description && (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed sm:text-lg",
            tone === "ink" ? "text-ink/65" : "text-cream/70"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
