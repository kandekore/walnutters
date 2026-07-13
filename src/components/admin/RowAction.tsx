"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Generic admin action button that hits an endpoint then refreshes the page. */
export default function RowAction({
  url,
  method = "PATCH",
  body,
  label,
  confirmText,
  className = "text-sm font-semibold text-secondary hover:underline",
}: {
  url: string;
  method?: "PATCH" | "DELETE" | "POST";
  body?: Record<string, unknown>;
  label: string;
  confirmText?: string;
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function run() {
    if (confirmText && !confirm(confirmText)) return;
    setBusy(true);
    try {
      await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button onClick={run} disabled={busy} className={className}>
      {busy ? "…" : label}
    </button>
  );
}
