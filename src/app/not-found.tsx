import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-ink py-24 text-cream">
      <Container className="text-center">
        <p className="font-display text-7xl font-medium text-brass sm:text-8xl">404</p>
        <h1 className="mt-6 font-display text-2xl font-medium sm:text-3xl">
          This page took a wrong turn on the job site.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-cream/60 sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist — it may have moved, or the link was mistyped.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/" variant="cream" size="lg" showArrow>
            Back to Home
          </Button>
          <Button href="/contact" variant="outline-cream" size="lg">
            Contact Us
          </Button>
        </div>
      </Container>
    </section>
  );
}
