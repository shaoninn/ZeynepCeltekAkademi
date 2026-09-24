"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { readAdsConsent, type AdsConsent } from "@/lib/ads";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
/** Google Ads — Hostinger’da NEXT_PUBLIC_AW_ID yoksa yedek */
const AW_ID = process.env.NEXT_PUBLIC_AW_ID || "AW-18472054951";
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

function applyConsent(consent: AdsConsent | null) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const granted = Boolean(consent?.analytics || consent?.marketing);
  const ads = Boolean(consent?.marketing);
  window.gtag("consent", "update", {
    analytics_storage: consent?.analytics ? "granted" : "denied",
    ad_storage: ads ? "granted" : "denied",
    ad_user_data: ads ? "granted" : "denied",
    ad_personalization: ads ? "granted" : "denied",
  });
  void granted;
}

/**
 * GA4 + Google Ads + optional Meta Pixel.
 * Consent Mode v2 defaults to denied until CookieBanner grants.
 */
export function Analytics() {
  const [consent, setConsent] = useState<AdsConsent | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setConsent(readAdsConsent());
    sync();
    setReady(true);
    window.addEventListener("zca-consent", sync);
    return () => window.removeEventListener("zca-consent", sync);
  }, []);

  useEffect(() => {
    if (!ready) return;
    applyConsent(consent);
  }, [consent, ready]);

  if (!GA_ID && !AW_ID && !PIXEL_ID) return null;

  const primaryId = GA_ID || AW_ID;
  const showGtag = Boolean(primaryId);
  const showPixel = Boolean(PIXEL_ID && consent?.marketing);

  const configs = [
    GA_ID ? `gtag('config', '${GA_ID}', { anonymize_ip: true });` : "",
    AW_ID ? `gtag('config', '${AW_ID}');` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <>
      {showGtag ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
            strategy="lazyOnload"
          />
          <Script id="gtag-init" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500
              });
              gtag('js', new Date());
              ${configs}
            `}
          </Script>
        </>
      ) : null}
      {showPixel ? (
        <Script id="meta-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      ) : null}
    </>
  );
}
