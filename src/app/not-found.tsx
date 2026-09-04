import Link from "next/link";
import { homeFontClassName } from "@/lib/fonts/home";

export default function NotFound() {
  return (
    <div className={`home-concept ${homeFontClassName}`}>
      <section className="hc-notfound">
        <p className="hc-notfound__code">404</p>
        <h1 className="hc-h1 hc-notfound__title">
          <span className="hc-notfound__line">
            <span>You took</span>
          </span>
          <span className="hc-notfound__line hc-notfound__line--2">
            <span>a wrong turn.</span>
          </span>
        </h1>
        <Link href="/" className="hc-notfound__link">
          Back home <span className="hc-btn__arrow">→</span>
        </Link>
      </section>
    </div>
  );
}
