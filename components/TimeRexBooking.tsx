"use client";

import Script from "next/script";

declare global {
  interface Window {
    TimerexCalendar?: () => void;
  }
}

const TIMEREX_URL = "https://timerex.net/s/irk911et_a00f/51b1a12e";

export function TimeRexBooking() {
  return (
    <div className="timerex-embed">
      <div id="timerex_calendar" data-url={TIMEREX_URL} />
      <Script
        src="https://asset.timerex.net/js/embed.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.TimerexCalendar?.();
        }}
      />
    </div>
  );
}
