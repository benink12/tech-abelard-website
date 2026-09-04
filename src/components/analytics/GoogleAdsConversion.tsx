"use client";

import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";

// Fires a Google Ads conversion event on mount — meant to be rendered only
// on /contact/thank-you, which (per ContactForm.tsx) is reached exclusively
// via a client-side redirect after /api/contact confirms a successful
// submission. Uses @next/third-parties' sendGAEvent (not a raw
// window.gtag call) because it safely queues the event into the dataLayer
// even if gtag.js hasn't finished loading yet — no manual ready-check
// needed.
//
// No-ops entirely when the env vars are unset, rather than fabricating an
// AW- conversion ID: get the real ID/label from Google Ads (Tools &
// Settings > Conversions > your conversion action > Tag setup > Use Google
// tag) and set NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID /
// NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL — see .env.example.
export function GoogleAdsConversion() {
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;
    const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
    if (!id || !label) return;

    sendGAEvent("event", "conversion", { send_to: `${id}/${label}` });
  }, []);

  return null;
}
