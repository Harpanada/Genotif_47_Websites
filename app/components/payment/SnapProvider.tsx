"use client";

import Script from "next/script";

const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";

const snapScriptUrl = isProduction
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

type SnapProviderProps = {
  onReady?: () => void;
};

export default function SnapProvider({ onReady }: SnapProviderProps) {
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

  if (!clientKey) {
    console.error("NEXT_PUBLIC_MIDTRANS_CLIENT_KEY belum diatur.");
    return null;
  }

  return (
    <Script
      id="midtrans-snap"
      src={snapScriptUrl}
      data-client-key={clientKey}
      strategy="afterInteractive"
      onReady={onReady}
    />
  );
}
