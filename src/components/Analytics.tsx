'use client';

import { useEffect } from 'react';

const GA_ID = 'G-2STZBPMQ0Z';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics, loaded on the visitor's first interaction (scroll, tap, key) or 4 seconds
 * after the page has loaded, whichever comes first. The 170 KB tag otherwise blocks the main
 * thread for ~300 ms during load (Lighthouse TBT); this way every real visit is still counted,
 * but the first paint is not slowed down.
 */
export default function Analytics() {
  useEffect(() => {
    let done = false;
    const events = ['scroll', 'pointerdown', 'keydown', 'touchstart'] as const;

    const load = () => {
      if (done) return;
      done = true;
      events.forEach((e) => window.removeEventListener(e, load));
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        // gtag.js expects the arguments object itself, not an array.
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', GA_ID);
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(s);
    };

    events.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));
    let timer: number | undefined;
    const startTimer = () => {
      timer = window.setTimeout(load, 4000);
    };
    if (document.readyState === 'complete') startTimer();
    else window.addEventListener('load', startTimer, { once: true });

    return () => {
      events.forEach((e) => window.removeEventListener(e, load));
      window.removeEventListener('load', startTimer);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return null;
}
