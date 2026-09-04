import { Inter, JetBrains_Mono } from "next/font/google";

// Homepage-only fonts (src/styles/home.css), shared from one module so every
// consumer — the homepage wrapper in page.tsx, and HomeHeader's mobile nav,
// which portals into document.body and so sits OUTSIDE that wrapper's DOM
// subtree — applies the exact same CSS variable classes. Without this,
// anything rendered via the portal would have var(--font-bricolage) etc.
// resolve to nothing.
//
// Reference (tinywins.com, inspected via computed styles/@font-face, not
// guessed): every weight of body copy and display type on their site is a
// single family — "suisseIntl" — a commercial/licensed typeface from Swiss
// Typefaces, not available under a free license. We can't ship their font
// files. Inter is the closest widely-available, fully free (SIL Open Font
// License, via Google Fonts) neo-grotesque with a comparable weight range
// and metrics — used here as one family for both display and body, the
// same one-typeface-multiple-weights structure their site actually uses,
// rather than our previous two-family pairing (Bricolage Grotesque +
// Instrument Sans). Variable names kept as --font-bricolage/--font-instrument
// since dozens of existing home.css rules already reference var(--display)/
// var(--body), which map to these — renaming would be a pure churn edit.
const bricolage = Inter({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});
const instrument = Inter({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: ["400", "500"],
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-home",
  display: "swap",
});

export const homeFontClassName = `${bricolage.variable} ${instrument.variable} ${jetbrainsMono.variable}`;
