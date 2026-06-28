"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import * as fpixel from "@/utils/fpixel";

function NavigationTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    fpixel.pageview();

    if (searchParams.get("checkout") === "success") {
      if (typeof window !== "undefined") {
        const hasTracked = sessionStorage.getItem("tracked_checkout_success");
        if (!hasTracked) {
          sessionStorage.setItem("tracked_checkout_success", "true");

          fpixel.event("Purchase", {
            value: 5.99,
            currency: "USD",
            content_name: "Plan Premium Mensual",
            content_category: "Suscripción"
          });
          fpixel.event("Subscribe", {
            value: 5.99,
            currency: "USD",
            content_name: "Plan Premium Mensual",
            content_category: "Suscripción"
          });

          setTimeout(() => {
            const cleanUrl = window.location.pathname + window.location.hash;
            window.history.replaceState(null, "", cleanUrl);
            sessionStorage.removeItem("tracked_checkout_success");
          }, 2000);
        }
      }
    }
  }, [pathname, searchParams]);

  return null;
}

export default function MetaPixel() {
  if (!fpixel.FB_PIXEL_ID) {
    return null;
  }

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('set', 'autoConfig', false, '${fpixel.FB_PIXEL_ID}');
            fbq('init', '${fpixel.FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${fpixel.FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt="facebook pixel noscript"
        />
      </noscript>
      <Suspense fallback={null}>
        <NavigationTracker />
      </Suspense>
    </>
  );
}
