import type { Metadata } from "next";
import { Calendar, Mail, Phone, Clock, ScanSearch } from "lucide-react";
import { site } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a discovery call or send a message to Tech Abélard — Canada's web design and local SEO agency for home service businesses.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your website."
        description="Book a discovery call, or send a message and we'll reply within one business day."
      />

      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_0.8fr]">
            <ContactForm />

            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-ink/8 bg-cream-card p-8">
                <div className="flex items-center gap-2.5 text-brass-ink">
                  <Calendar className="h-5 w-5" />
                  <p className="text-xs font-semibold uppercase tracking-wide">Book Directly</p>
                </div>
                <h3 className="mt-4 font-display text-xl font-medium text-ink">Discovery Call</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">
                  Prefer to skip the form? Grab a slot directly — 20 minutes, no obligation.
                </p>
                {/* Integration point: replace with a real embedded Calendly widget
                    (inline embed script) once site.calendlyUrl is finalized. */}
                <a
                  href={site.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-center justify-center rounded-xl border border-dashed border-ink/20 bg-cream px-4 py-8 text-center text-sm text-ink/45 transition-colors hover:border-brass-ink/50 hover:text-brass-ink"
                >
                  Calendly widget placeholder — opens booking page
                </a>
              </div>

              <div className="rounded-2xl border border-ink/8 bg-cream-card p-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-brass-ink">Direct</p>
                <ul className="mt-4 flex flex-col gap-4">
                  <li>
                    <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-sm text-ink/75 hover:text-brass-ink">
                      <Mail className="h-4 w-4 shrink-0" /> {site.email}
                    </a>
                  </li>
                  <li>
                    <a href={site.phone.href} className="flex items-center gap-3 text-sm text-ink/75 hover:text-brass-ink">
                      <Phone className="h-4 w-4 shrink-0" /> {site.phone.display}
                    </a>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-ink/50">
                    <Clock className="h-4 w-4 shrink-0" /> Replies within 1 business day
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-ink/8 bg-cream-card p-8">
                <div className="flex items-center gap-2.5 text-brass-ink">
                  <ScanSearch className="h-5 w-5" />
                  <p className="text-xs font-semibold uppercase tracking-wide">Not Ready to Talk Yet?</p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">
                  Start with a free, honest audit of your current website instead — no obligation.
                </p>
                <Button href="/free-audit" variant="outline" size="md" className="mt-5 w-full" data-cta="contact-free-audit" showArrow>
                  Get a Free Website Audit
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
