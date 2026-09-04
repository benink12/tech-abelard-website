import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Mail, Phone, Clock, ScanSearch } from "lucide-react";
import { site } from "@/data/site";
import { regionCopy } from "@/data/localization";
import { getRegion } from "@/lib/region";
import { homeFontClassName } from "@/lib/fonts/home";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { Button } from "@/components/ui/Button";

export async function generateMetadata(): Promise<Metadata> {
  const region = await getRegion();
  return {
    title: "Contact",
    description: regionCopy[region].pageDescriptions.contact,
    alternates: { canonical: "/contact" },
  };
}

export default function ContactPage() {
  return (
    <div className={`home-concept ${homeFontClassName}`}>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your website."
        description="Book a discovery call, or send a message and we'll reply within one business day."
      />

      <section className="hc-section">
        <div className="hc-wrap">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_0.8fr]">
            <ContactForm />

            <div className="flex flex-col gap-10">
              <div className="hc-flatcard">
                <div className="hc-flatcard__kicker">
                  <Calendar className="h-4 w-4" /> Book Directly
                </div>
                <h3>Discovery Call</h3>
                <p>Prefer to skip the form? Grab a slot directly — 20 minutes, no obligation.</p>
                {/* Opens the real booking page in a new tab today. A future
                    pass could swap this for Calendly's inline embed script
                    once we're ready to add that third-party dependency. */}
                <div style={{ marginTop: 20 }}>
                  <Button href={site.calendlyUrl} external variant="outline" size="lg" className="w-full" data-cta="contact-book-discovery-call">
                    <Calendar className="h-4 w-4" /> Open booking calendar
                  </Button>
                </div>
              </div>

              <div className="hc-flatcard">
                <div className="hc-flatcard__kicker">Direct</div>
                <ul className="mt-4 flex flex-col gap-4">
                  <li>
                    <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 shrink-0" /> {site.email}
                    </a>
                  </li>
                  <li>
                    <a href={site.phone.href} className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 shrink-0" /> {site.phone.display}
                    </a>
                    <p className="hc-worknote" style={{ marginTop: 6, paddingLeft: 28, textTransform: "none", letterSpacing: 0 }}>
                      Want to test our <Link href="/ai-receptionist-for-small-business">AI receptionist for small business</Link>? Call
                      this number and speak with it yourself.
                    </p>
                  </li>
                  <li className="flex items-center gap-3 text-sm" style={{ color: "var(--slate)" }}>
                    <Clock className="h-4 w-4 shrink-0" /> Replies within 1 business day
                  </li>
                </ul>
              </div>

              <div className="hc-flatcard">
                <div className="hc-flatcard__kicker">
                  <ScanSearch className="h-4 w-4" /> Not Ready to Talk Yet?
                </div>
                <p>Start with a free, honest audit of your current website instead — no obligation.</p>
                <div style={{ marginTop: 20 }}>
                  <Button href="/audit" variant="outline" size="md" className="w-full" data-cta="contact-free-audit" showArrow>
                    Get a Free Website Audit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
