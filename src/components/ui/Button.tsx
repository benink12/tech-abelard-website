import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "ink" | "cream" | "outline" | "outline-cream" | "ghost";
type Size = "md" | "lg";

const variantClasses: Record<Variant, string> = {
  ink: "bg-ink text-cream hover:bg-ink-soft",
  cream: "bg-cream text-ink hover:bg-white",
  outline: "border border-ink/15 text-ink hover:border-ink/40 hover:bg-ink/5",
  "outline-cream": "border border-cream/30 text-cream hover:border-cream/60 hover:bg-cream/10",
  ghost: "text-ink hover:text-brass-ink",
};

const sizeClasses: Record<Size, string> = {
  md: "h-11 px-6 text-sm gap-2",
  lg: "h-13 px-8 text-[0.95rem] gap-2.5",
};

const baseClasses =
  "group inline-flex items-center justify-center rounded-full font-medium tracking-tight transition-all duration-300 whitespace-nowrap active:scale-[0.98]";

interface SharedProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  showArrow?: boolean;
  /** Stable identifier for click analytics — not wired to any provider yet, just present on the DOM node for later. */
  "data-cta"?: string;
}

interface LinkButtonProps extends SharedProps {
  href: string;
  external?: boolean;
  onClick?: () => void;
}

interface NativeButtonProps
  extends SharedProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | keyof SharedProps> {
  href?: undefined;
}

type ButtonProps = LinkButtonProps | NativeButtonProps;

export function Button(props: ButtonProps) {
  const variant = props.variant ?? "ink";
  const size = props.size ?? "md";
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], props.className);
  const arrow = props.showArrow ? (
    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  ) : null;

  if (props.href) {
    const { href, external, children, onClick } = props;
    const dataCta = props["data-cta"];
    const isProtocolLink = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");

    if (external || isProtocolLink) {
      return (
        <a href={href} className={classes} data-cta={dataCta} onClick={onClick} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
          {arrow}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} data-cta={dataCta} onClick={onClick}>
        {children}
        {arrow}
      </Link>
    );
  }

  const nativeProps = props as NativeButtonProps;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- stripping non-DOM props before spreading the rest onto <button>
  const { variant: _variant, size: _size, className: _className, showArrow: _showArrow, href: _href, children: nativeChildren, ...rest } = nativeProps;

  return (
    <button className={classes} {...rest}>
      {nativeChildren}
      {arrow}
    </button>
  );
}
